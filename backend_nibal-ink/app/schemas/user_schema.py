# backend_nibal-ink/app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional

class UserBaseSchema(BaseModel):
    email: EmailStr
    user_name: str = Field(..., min_length=3, max_length=150) 

class UserCreateSchema(UserBaseSchema):
    password: str = Field(..., min_length=8)

class UserUpdateSchema(BaseModel):
    user_name: Optional[str] = None # Normalizado aquí también
    phone_number: Optional[str] = None
    shipping_address: Optional[str] = None

class UserResponseSchema(UserBaseSchema):
    id: int
    is_active: bool
    is_superuser: bool
    is_verified: bool
    role: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)