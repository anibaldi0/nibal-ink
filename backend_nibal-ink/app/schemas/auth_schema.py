# backend_nibal-ink/app/schemas/auth_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class TokenSchema(BaseModel):
    """Esquema que devuelve el JWT al cliente"""
    access_token: str
    token_type: str

class TokenDataSchema(BaseModel):
    """Datos que viajan dentro del payload del token"""
    email: Optional[str] = None

class LoginSchema(BaseModel):
    """Validacion de los datos de entrada para el login"""
    email: EmailStr
    password: str
