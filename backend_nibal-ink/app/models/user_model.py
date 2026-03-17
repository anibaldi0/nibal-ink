# backend_nibal-ink/app/models/user_model.py
from sqlalchemy import String, Boolean, text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base_model import Base
from datetime import datetime

class UserModel(Base):
    """
    Modelo unico para la gestion de identidad en nibal.ink.
    Maneja tanto clientes como administradores mediante flags de seguridad.
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Datos de Identidad
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Flags de Estado y Permisos
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # --- NUEVOS CAMPOS PARA EL FLUJO DE CONFIRMACIÓN ---
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)  # Para el email
    role: Mapped[str] = mapped_column(String(20), server_default="user") # user, admin, guest
    
    # Auditoría (Fundamental para un Sysadmin)
    created_at: Mapped[datetime] = mapped_column(server_default=text("TIMEZONE('utc', now())"))
    # ---------------------------------------------------

    # Informacion para e-commerce (opcional al registro)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    shipping_address: Mapped[str | None] = mapped_column(String(500), nullable=True)

    def __repr__(self) -> str:
        return f"<UserModel(email={self.email}, verified={self.is_verified}, admin={self.is_superuser})>"