# backend_nibal-ink/app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBaseSchema(BaseModel):
    email: EmailStr
    full_name: str

class UserCreateSchema(UserBaseSchema):
    password: str

class UserResponseSchema(UserBaseSchema):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    # Permite que Pydantic lea los atributos del modelo de SQLAlchemy
    model_config = ConfigDict(from_attributes=True)
