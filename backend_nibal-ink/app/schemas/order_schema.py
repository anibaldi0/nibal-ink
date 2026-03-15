# backend_nibal-ink/app/schemas/order_schema.py
from pydantic import BaseModel
from typing import Optional
import uuid

class OrderCreateResponseSchema(BaseModel):
    order_id: int
    status: str
    gift_token: Optional[uuid.UUID] = None  # Solo si fue un regalo
    file_path: str

    class Config:
        from_attributes = True
