# backend_nibal-ink/app/api/v1/design_v1.py
from fastapi import APIRouter, HTTPException, Depends, status # Agregamos Depends y status
from fastapi.responses import FileResponse
from pydantic import BaseModel
import base64
import uuid
import os
from io import BytesIO
from PIL import Image

# --- IMPORTACIONES DEL SISTEMA DE ESCUDOS (deps_api.py) ---
from app.api.deps_api import get_current_user # El guardia de la puerta
from app.models.user_model import UserModel     # El modelo de identidad

router = APIRouter()
UPLOAD_DIR = "uploads"

class DesignUpload(BaseModel):
    image_data: str 

@router.post("/upload")
async def upload_design(
    design: DesignUpload,
    # --- INYECCION DEL ESCUDO ---
    current_user: UserModel = Depends(get_current_user) # EXIGIMOS LOGIN
):
    # --- REGLA NINJA DE ALTA SEGURIDAD ---
    # Si el usuario no verifico su email via Resend (is_verified es 'f' en DB),
    # el escudo lo rebota con un 403 Forbidden.
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="VERIFICATION_REQUIRED"
        )

    # =========================================================================
    # --- TU CÓDIGO ORIGINAL (INTACTO, SIN TOCAR UNA COMA) ---
    # =========================================================================
    try:
        # 1. Decodificacion
        if "base64," in design.image_data:
            imgstr = design.image_data.split(";base64,")[1]
        else:
            imgstr = design.image_data
        
        image_bytes = base64.b64decode(imgstr)

        # 2. SANITIZACION
        try:
            img = Image.open(BytesIO(image_bytes))
            # No usamos verify() aquí porque queremos procesarla
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
        except Exception:
            raise HTTPException(status_code=400, detail="Imagen no válida")

        # 3. Guardado seguro
        file_name = f"design_{uuid.uuid4()}.webp"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        img.save(file_path, "WEBP", quality=100, lossless=True) 

        return {
            "status": "success", 
            "file_id": file_name,
            "message": "Diseño en Alta Resolución guardado"
        }
    except HTTPException as he: # Capturamos excepciones HTTP que hayamos lanzado
        raise he
    except Exception as e: # Capturamos errores inesperados
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    # =========================================================================
    # --- FIN DE TU CÓDIGO ORIGINAL ---
    # =========================================================================

@router.get("/list")
async def list_designs(
    # --- INYECCIÓN DEL ESCUDO ---
    current_user: UserModel = Depends(get_current_user) # EXIGIMOS LOGIN PARA VER EL HISTORIAL
):
    """Retorna la lista de nombres de archivos guardados en la Beelink (Solo usuarios)"""
    # ... (Tu código original de listado sigue aquí, protegido) ...
    try:
        if not os.path.exists(UPLOAD_DIR):
            return []
        
        # Listamos archivos .webp y los ordenamos por fecha (el más reciente primero)
        files = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".webp")]
        files.sort(key=lambda x: os.path.getmtime(os.path.join(UPLOAD_DIR, x)), reverse=True)
        
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo listar: {str(e)}")

@router.get("/file/{file_id}")
async def get_design_file(file_id: str):
    """Sirve el archivo físico (Sigue siendo público para renderizar miniaturas)"""
    # ... (Tu código original de servir archivo sigue igual) ...
    if ".." in file_id or "/" in file_id:
        raise HTTPException(status_code=400, detail="ID de archivo inválido")
        
    file_path = os.path.join(UPLOAD_DIR, file_id)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
        
    return FileResponse(file_path)

@router.delete("/file/{file_id}")
async def delete_design(
    file_id: str,
    # --- INYECCION DEL ESCUDO ---
    current_user: UserModel = Depends(get_current_user) # EXIGIMOS LOGIN PARA BORRAR
):
    """Borra un diseño de la base de datos (Solo usuarios logueados)"""
    # ... (Tu código original de borrado sigue igual, protegido) ...
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"status": "success", "message": f"Archivo {file_id} eliminado"}
    raise HTTPException(status_code=404, detail="Archivo no encontrado")