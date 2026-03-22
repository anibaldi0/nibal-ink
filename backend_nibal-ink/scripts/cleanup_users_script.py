
# backend_nibal-ink/scripts/cleanup_users_script.py

import asyncio
from datetime import datetime, timedelta
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

import sys
import os

# Hace que el script vea la carpeta 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import delete

# IMPORTANTE: Ajustar URL de conexion segun tu .env
DATABASE_URL = "postgresql+asyncpg://nibal_user:Pip0ca@localhost/nibal_db"

async def purge_unverified_users():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    # Definimos el tiempo de gracia (ej: 24 horas)
    limite = datetime.now() - timedelta(hours=24)
    
    async with async_session() as session:
        async with session.begin():
            # Importamos el modelo aquí para evitar problemas de circularidad
            from app.models.user_model import UserModel
            
            # Ejecutamos el borrado
            stmt = delete(UserModel).where(
                UserModel.is_verified == False,
                UserModel.created_at < limite
            )
            result = await session.execute(stmt)
            print(f"[{datetime.now()}] Purga completada: {result.rowcount} usuarios eliminados.")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(purge_unverified_users())
