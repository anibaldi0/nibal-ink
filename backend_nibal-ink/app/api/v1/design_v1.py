# backend_nibal-ink/app/api/v1/design_v1.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
import uuid
import os
from io import BytesIO
from PIL import Image  # Aqui entra la sanitizacion

router = APIRouter()

class DesignUpload(BaseModel):
    image_data: str 

@router.post("/upload")
async def upload_design(design: DesignUpload):
    try:
        # 1. Decodificacion inicial
        if "base64," in design.image_data:
            imgstr = design.image_data.split(";base64,")[1]
        else:
            imgstr = design.image_data
        
        image_bytes = base64.b64decode(imgstr)

        # 2. SANITIZACION CON PILLOW 🥷
        # Abrimos los bytes como imagen para verificar que sea valida
        try:
            img = Image.open(BytesIO(image_bytes))
            # Al hacer verify() o simplemente re-guardarla, 
            # eliminamos cualquier metadata maliciosa (EXIF)
            img.verify() 
            
            # Re-abrimos para procesar (verify cierra el file pointer)
            img = Image.open(BytesIO(image_bytes))
            
            # Convertimos a RGB si es necesario (por si mandan RGBA y queres JPEG/WebP)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
        except Exception:
            raise HTTPException(status_code=400, detail="El archivo enviado no es una imagen valida")

        # 3. Guardado seguro
        file_name = f"design_{uuid.uuid4()}.webp"
        file_path = os.path.join("uploads", file_name)
        os.makedirs("uploads", exist_ok=True)

        # Guardamos usando Pillow, esto garantiza que el archivo final 
        # es generado por nosotros y no es el original del atacante
        img.save(file_path, "WEBP", quality=80)

        return {
            "status": "success", 
            "file_id": file_name,
            "message": "Disenio sanitizado y guardado"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")