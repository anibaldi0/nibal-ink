# backend_nibal-ink/app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional

class UserBaseSchema(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=150)

class UserCreateSchema(UserBaseSchema):
    password: str = Field(..., min_length=8) # Seguridad mínima para el hash

class UserUpdateSchema(BaseModel):
    # Por si el usuario quiere completar estos datos después
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    shipping_address: Optional[str] = None

class UserResponseSchema(UserBaseSchema):
    id: int
    is_active: bool
    is_superuser: bool
    is_verified: bool  # <--- CRÍTICO: El frontend lo necesita
    role: str          # <--- Para saber si es user, admin o guest
    created_at: datetime
    
    # Datos opcionales que también queremos devolver
    phone_number: Optional[str] = None
    shipping_address: Optional[str] = None

    # Permite que Pydantic lea los atributos del modelo de SQLAlchemy
    model_config = ConfigDict(from_attributes=True)