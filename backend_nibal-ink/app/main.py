# backend_nibal-ink/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config_core import settings

# Importacion de routers con la nueva nomenclatura
from app.api.v1 import auth_v1, user_v1

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API para gestion de e-commerce de tazas personalizadas e impresion 3D",
    openapi_url=f"{settings.API_VERSION_STR}/openapi.json"
)

# Configuracion de CORS
if settings.CORS_ORIGINS_LIST:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.CORS_ORIGINS_LIST],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/", tags=["Health Check"])
async def root():
    """Endpoint basico de salud del sistema."""
    return {
        "status": "online",
        "message": f"Bienvenido a la API de {settings.PROJECT_NAME}",
        "version": "v1"
    }

# --- REGISTRO DE ROUTERS ---

# Rutas de Autenticacion (Login)
app.include_router(
    auth_v1.router, 
    prefix=settings.API_VERSION_STR, 
    tags=["Authentication"]
)

# Rutas de Usuarios (Registro y Perfil)
app.include_router(
    user_v1.router, 
    prefix=f"{settings.API_VERSION_STR}/users", 
    tags=["Users"]
)