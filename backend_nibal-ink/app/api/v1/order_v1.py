# backend_nibal-ink/app/api/v1/order_v1.py
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session_db import get_db_session
from app.api.deps_api import get_current_user
from app.models.user_model import UserModel
from app.models.order_model import OrderModel, OrderItemModel, GiftModel
from app.services.file_service import save_design_file
from app.schemas.order_schema import OrderCreateResponseSchema

router = APIRouter()

@router.post("/create", response_model=OrderCreateResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_order(
    design_file: UploadFile = File(...),
    total_amount: float = Form(...),
    product_id: int = Form(...),
    recipient_name: str = Form(None),
    gift_message: str = Form(None),
    db: AsyncSession = Depends(get_db_session),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Crea un pedido completo y sanitiza la imagen para produccion.
    """
    file_path = None
    try:
        # 1. Guardar y sanitizar archivo (Pillow se encarga de la seguridad)
        file_path = save_design_file(design_file)
        
        # 2. Crear la Orden (Cabecera)
        new_order = OrderModel(
            buyer_id=current_user.id,
            total_amount=total_amount,
            status="paid" 
        )
        db.add(new_order)
        await db.flush() 

        # 3. Crear el item (Relacion entre producto y diseño)
        new_item = OrderItemModel(
            order_id=new_order.id,
            product_id=product_id,
            quantity=1,
            unit_price=total_amount,
            raw_image_url=file_path
        )
        db.add(new_item)
        await db.flush()

        # 4. Logica de Regalo (UUID dinámico para acceso QR)
        gift_token = None
        if recipient_name or gift_message:
            new_gift = GiftModel(
                order_item_id=new_item.id,
                recipient_name=recipient_name,
                message=gift_message,
                model_url="/static/models/taza_base.glb"
            )
            db.add(new_gift)
            await db.flush()
            gift_token = new_gift.gift_token

        await db.commit()

        # Retornamos segun el esquema definido
        return {
            "order_id": new_order.id,
            "status": new_order.status,
            "gift_token": gift_token,
            "file_path": file_path
        }

    except Exception as e:
        await db.rollback()
        # Si el archivo se guardo pero la DB fallo, como sysadmins deberiamos 
        # implementar luego una limpieza de huerfanos, por ahora logueamos.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error critico en la transaccion: {str(e)}"
        )