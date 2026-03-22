# backend_nibal-ink/app/api/v1/auth_v1.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session_db import get_db_session
from app.models.user_model import UserModel
from app.services.auth_service import create_access_token, verify_password
from app.schemas.auth_schema import TokenSchema

router = APIRouter()

@router.post("/login", response_model=TokenSchema)
async def login_for_access_token(
    # form_data sigue recibiendo 'username' (que es el email que el usuario escribe)
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db_session)
):
    # Buscamos en la DB comparando el email con form_data.username
    query = select(UserModel).where(UserModel.email == form_data.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contrasenia incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # El "sub" del JWT sigue siendo el email
    access_token = create_access_token(data={"sub": user.email})
    
    # IMPORTANTE: Aquí sí usamos user.user_name (el campo de tu UserModel)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": user.user_name # <--- Este es el dato real de la DB
    }