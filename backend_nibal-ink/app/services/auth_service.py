# backend_nibal-ink/app/services/auth_service.py
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from app.core.config_core import settings
from app.core.security_core import pwd_context

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Genera un JWT firmado con el secret key.
    """
    to_encode = data.copy()
    
    # Calculamos la expiración
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Generamos el token usando las constantes de tu config_core
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara el texto plano con el hash de la DB"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Transforma la contraseña plana en un hash irreversible.
    Uso: Antes de guardar en la DB durante el registro.
    """
    return pwd_context.hash(password)