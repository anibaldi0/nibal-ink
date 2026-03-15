# backend_nibal-ink/app/core/config_core.py
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class ProjectSettings(BaseSettings):
    """
    Configuracion centralizada del proyecto nibal.ink.
    Valida que el .env sea correcto antes de iniciar la app.
    """
    
    # --- PROYECTO ---
    PROJECT_NAME: str = "nibal.ink API"
    API_VERSION_STR: str = "/api/v1"
    
    # --- SEGURIDAD ---
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    # --- BASE DE DATOS ---
    DATABASE_URL: PostgresDsn
    
    # --- CORS ---
    # Cambiamos a Union para que Pydantic no intente parsear JSON de inmediato
    CORS_ORIGINS_LIST: Union[List[AnyHttpUrl], str] = []

    @field_validator("CORS_ORIGINS_LIST", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value: Union[str, List[str]]) -> List[str]:
        """
        Convierte el string del .env separado por comas en una lista real.
        """
        if isinstance(value, str) and not value.startswith("["):
            return [origin.strip() for origin in value.split(",")]
        elif isinstance(value, (list, str)):
            return value
        return []

    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=True,
        env_file_encoding="utf-8",
        extra="ignore" # Ignora variables extra en el .env
    )

settings = ProjectSettings()