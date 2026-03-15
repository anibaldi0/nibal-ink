# backend_nibal-ink/app/models/order_model.py
import uuid
from sqlalchemy import String, Float, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base_model import Base

class OrderModel(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    buyer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="pending") # pending, paid, shipped
    
    # Relaciones
    buyer = relationship("UserModel")
    items = relationship("OrderItemModel", back_populates="order")

class OrderItemModel(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(default=1)
    unit_price: Mapped[float] = mapped_column(Float)

    order = relationship("OrderModel", back_populates="items")
    # Link al regalo si este item es para obsequiar
    gift_info = relationship("GiftModel", back_populates="order_item", uselist=False)

class GiftModel(Base):
    """
    Esta es la tabla que consultara el destinatario del QR.
    No requiere login, solo conocer el gift_token (UUID).
    """
    __tablename__ = "gifts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_item_id: Mapped[int] = mapped_column(ForeignKey("order_items.id"), unique=True)
    
    # El token que ira en el QR (nibal.ink/regalo/{gift_token})
    gift_token: Mapped[uuid.UUID] = mapped_column(default=uuid.uuid4, unique=True, index=True)
    
    recipient_name: Mapped[str | None] = mapped_column(String(100))
    message: Mapped[str | None] = mapped_column(Text)
    
    # Metadata para el visor 3D
    model_url: Mapped[str | None] = mapped_column(String(500)) # Link al .glb
    is_opened: Mapped[bool] = mapped_column(default=False) # Para avisar al comprador cuando lo escaneen

    order_item = relationship("OrderItemModel", back_populates="gift_info")
