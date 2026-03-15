# backend_nibal-ink/app/db/session_db.py
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config_core import settings

# El motor asincrono. 
# Usamos str() porque settings.DATABASE_URL es un objeto PostgresDsn de Pydantic
engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=False,  # Cambiar a True solo para debugear queries SQL pesadas
    pool_pre_ping=True,
    future=True
)

# Fabrica de sesiones asincronas
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Crucial para evitar errores de carga diferida en async
    autocommit=False,
    autoflush=False
)

async def get_db_session():
    """
    Dependency Injection para FastAPI. 
    Asegura que cada request tenga su propia sesion y se cierre al finalizar.
    """
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
