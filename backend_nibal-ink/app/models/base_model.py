# backend_nibal-ink/app/models/base_model.py
from datetime import datetime
from sqlalchemy import func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """
    Clase base para todos los modelos del sistema.
    Incluye campos de auditoria basicos de forma automatica.
    """
    # Columnas comunes para todas las tablas
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), 
        onupdate=func.now()
    )
