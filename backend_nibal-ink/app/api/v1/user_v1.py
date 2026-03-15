# backend_nibal-ink/app/api/v1/user_v1.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session_db import get_db_session
from app.models.user_model import UserModel
from app.schemas.user_schema import UserCreateSchema, UserResponseSchema
from app.core.security_core import get_password_hash

from app.api.deps_api import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreateSchema,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Registra un nuevo cliente en la plataforma.
    Verifica que el email no este duplicado antes de insertar.
    """
    # 1. Verificar si el usuario ya existe
    query = select(UserModel).where(UserModel.email == user_in.email)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="El email ya se encuentra registrado."
        )
    
    # 2. Crear instancia del modelo con password hasheado
    new_user = UserModel(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        is_superuser=False  # Por seguridad, el registro publico nunca es admin
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.get("/me", response_model=UserResponseSchema)
async def read_users_me(
    current_user: UserModel = Depends(get_current_user)
):
    """
    Devuelve la info del user autenticado actualmente.
    Sirve para validar el token y obtener el perfil.
    """
    return current_user


