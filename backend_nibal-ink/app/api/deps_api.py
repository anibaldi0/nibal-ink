# backend_nibal-ink/app/api/deps_api.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config_core import settings
from app.db.session_db import get_db_session
from app.models.user_model import UserModel
from app.schemas.auth_schema import TokenDataSchema

# El path debe coincidir con tu ruta de login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_VERSION_STR}/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db_session),
    token: str = Depends(oauth2_scheme)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el acceso.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenDataSchema(email=email)
    except JWTError:
        raise credentials_exception
        
    query = select(UserModel).where(UserModel.email == token_data.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    return user
