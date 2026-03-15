# backend_nibal-ink/app/api/deps_api.py
from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config_core import settings
from app.db.session_db import get_db_session
from app.models.user_model import UserModel
from app.schemas.auth_schema import TokenDataSchema

# Este objeto le dice a FastAPI que busque el token en el header 'Authorization'
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_VERSION_STR}/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db_session),
    token: str = Depends(reusable_oauth2)
) -> UserModel:
    """
    Dependency que valida el token y retorna el objeto usuario de la DB.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el acceso",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenDataSchema(email=email)
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(UserModel).where(UserModel.email == token_data.email))
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    
    return user

def get_current_active_superuser(
    current_user: UserModel = Depends(get_current_user),
) -> UserModel:
    """
    Dependency adicional para rutas que requieren privilegios ninja (Admin).
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="El usuario no tiene suficientes privilegios"
        )
    return current_user
