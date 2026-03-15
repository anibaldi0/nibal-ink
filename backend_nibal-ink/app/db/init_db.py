# backend_nibal-ink/app/db/init_db.py
import asyncio
from app.db.session_db import engine
from app.models.base_model import Base
from app.models.user_model import UserModel
from app.db.session_db import async_session_factory
from app.core.security_core import get_password_hash

async def init_database():
    """
    Crea las tablas y genera el primer administrador de sistema.
    """
    print("[NINJA-LOG] Iniciando creacion de tablas...")
    
    async with engine.begin() as conn:
        # Esto crea las tablas si NO existen segun los modelos importados
        await conn.run_sync(Base.metadata.create_all)
    
    print("[NINJA-LOG] Tablas creadas con exito.")
    
    async with async_session_factory() as session:
        # Verificar si ya existe un admin para no duplicar
        from sqlalchemy import select
        result = await session.execute(select(UserModel).where(UserModel.email == "admin@nibal.ink"))
        admin_exists = result.scalar_one_or_none()
        
        if not admin_exists:
            print("[NINJA-LOG] Creando SuperUser inicial...")
            new_admin = UserModel(
                full_name="Ani Admin",
                email="admin@nibal.ink",
                hashed_password=get_password_hash("Cambiame123!"), # Password temporal
                is_superuser=True
            )
            session.add(new_admin)
            await session.commit()
            print("[NINJA-LOG] Admin creado: admin@nibal.ink / Cambiame123!")
        else:
            print("[NINJA-LOG] El Admin ya existe, saltando seed.")

if __name__ == "__main__":
    asyncio.run(init_database())
