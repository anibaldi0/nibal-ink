# backend_nibal-ink/app/api/v1/user_v1.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from jose import jwt, JWTError

from app.db.session_db import get_db_session
from app.models.user_model import UserModel
from app.schemas.user_schema import UserCreateSchema, UserResponseSchema
from app.core.security_core import get_password_hash
from app.core.config_core import settings
from app.api.deps_api import get_current_user
from app.services.auth_service import create_access_token
from app.services.mail_service import send_verification_email

router = APIRouter()

@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreateSchema,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Registra un nuevo cliente y dispara el email de verificacion.
    """
    # 1. Verificar existencia
    query = select(UserModel).where(UserModel.email == user_in.email)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="El email ya se encuentra registrado en el nodo."
        )
    
    # 2. Crear instancia
    new_user = UserModel(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
        is_verified=False,
        is_superuser=False,
        role="user"
    )
    
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        # 3. Generar token corto (24h) para el email
        email_token = create_access_token(
            data={"sub": new_user.email, "purpose": "email_verification"},
            expires_delta=timedelta(hours=24)
        )
        
        # 4. Enviar email en Background (Sysadmin style: no bloquea el response)
        background_tasks.add_task(send_verification_email, new_user.email, email_token)
        
        return new_user

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Error critico en la base de datos de la Beelink."
        )

@router.get("/verify-email")
async def verify_email(
    token: str = Query(...),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Endpoint que recibe el click del mail.
    Corregido para asegurar el commit en la Beelink.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        purpose: str = payload.get("purpose")
        
        if email is None or purpose != "email_verification":
            raise HTTPException(status_code=400, detail="Token invalido o malformado")
    except JWTError:
        raise HTTPException(status_code=400, detail="El link ha expirado o es invalido")

    # 1. Buscamos al usuario explícitamente
    result = await db.execute(select(UserModel).where(UserModel.email == email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado en el nodo")

    # 2. Modificamos el objeto directamente (Esto marca la sesión como 'dirty')
    if not user.is_verified:
        user.is_verified = True
        try:
            # 3. Forzamos el guardado y confirmamos la transacción
            await db.commit() 
            # Opcional: refrescamos para estar seguros
            await db.refresh(user) 
        except Exception:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Error al actualizar la base de datos")

    return {
        "status": "success", 
        "message": f"¡Hola {user.full_name}! Email verificado correctamente. Ya podes operar."
    }

@router.get("/me", response_model=UserResponseSchema)
async def read_users_me(
    current_user: UserModel = Depends(get_current_user)
):
    return current_user