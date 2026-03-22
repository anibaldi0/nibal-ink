from pydantic import BaseModel, EmailStr
from typing import Optional

class TokenSchema(BaseModel):
    """Esquema que devuelve el JWT y datos del usuario al cliente"""
    access_token: str
    token_type: str
    username: str  # <--- Agregado para que el front lo capture al loguear

class TokenDataSchema(BaseModel):
    """Datos que viajan dentro del payload del token"""
    email: Optional[str] = None
    username: Optional[str] = None # <--- Opcional: para identificar al usuario por nombre en el token
    role: Optional[str] = None 

class LoginSchema(BaseModel):
    email: EmailStr
    password: str