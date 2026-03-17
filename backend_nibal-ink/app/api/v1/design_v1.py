# backend_nibal-ink/app/api/v1/design_v1.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse # Necesario para servir las miniaturas
from pydantic import BaseModel
import base64
import uuid
import os
from io import BytesIO
from PIL import Image

router = APIRouter()

UPLOAD_DIR = "uploads" # Centralizamos el nombre de la carpeta

class DesignUpload(BaseModel):
    image_data: str 

@router.post("/upload")
async def upload_design(design: DesignUpload):
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# --- NUEVOS ENDPOINTS PARA EL HISTORY VIEWER ---

@router.get("/list")
async def list_designs():
    """Retorna la lista de nombres de archivos guardados en la Beelink"""
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
    """Sirve el archivo físico para que el navegador lo pueda mostrar"""
    # Validación básica de seguridad: evitar Path Traversal
    if ".." in file_id or "/" in file_id:
        raise HTTPException(status_code=400, detail="ID de archivo inválido")
        
    file_path = os.path.join(UPLOAD_DIR, file_id)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
        
    return FileResponse(file_path)

@router.delete("/file/{file_id}")
async def delete_design(file_id: str):
    """Borra un diseño de la Beelink"""
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"status": "success", "message": f"Archivo {file_id} eliminado"}
    raise HTTPException(status_code=404, detail="Archivo no encontrado")