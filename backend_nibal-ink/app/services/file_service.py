# backend_nibal-ink/app/services/file_service.py
import os
import uuid
from fastapi import UploadFile, HTTPException
from PIL import Image
import io

UPLOAD_DIR = "static/designs"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

def save_design_file(file: UploadFile) -> str:
    # 1. Validacion de extension (Filtro rapido)
    extension = file.filename.split(".")[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extension de archivo no permitida.")

    try:
        # Leer el contenido en memoria
        content = file.file.read()
        
        # 2. Validacion de integridad y limpieza de metadatos con Pillow
        image = Image.open(io.BytesIO(content))
        image.verify() # Verifica que sea una imagen valida
        
        # Re-abrimos para procesar (verify() cierra el archivo)
        image = Image.open(io.BytesIO(content))
        
        # 3. Convertir a un formato estandar y "aplanar" (elimina perfiles ICC, EXIF, etc)
        # Esto mata cualquier malware oculto en metadatos
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        # Generar nombre unico
        file_name = f"{uuid.uuid4()}.webp" # Guardamos todo como webp por eficiencia
        file_path = os.path.join(UPLOAD_DIR, file_name)

        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        # Guardar version "sanitizada"
        image.save(file_path, "WEBP", quality=90)
        
        return f"/{UPLOAD_DIR}/{file_name}"

    except Exception:
        raise HTTPException(status_code=400, detail="El archivo esta corrupto o es malicioso.")