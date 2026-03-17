# backend_nibal-ink/app/services/mail_service.py
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from app.core.config_core import settings
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=True
)

async def send_verification_email(email: EmailStr, token: str):
    """
    Envía el link de verificación al usuario.
    """
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    html = f"""
    <div style="font-family: sans-serif; background-color: #020617; color: #f1f5f9; padding: 40px; border-radius: 20px;">
        <h2 style="color: #38bdf8;">NIBAL<span style="color: #ffffff;">.INK</span></h2>
        <p style="font-size: 16px;">Bienvenido al nodo de producción, operador.</p>
        <p>Para activar tu cuenta y empezar a diseñar, hacé click en el siguiente botón:</p>
        <a href="{verification_url}" 
           style="display: inline-block; padding: 12px 24px; background-color: #38bdf8; color: #020617; 
                  text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;">
           VERIFICAR CUENTA
        </a>
        <p style="font-size: 10px; color: #64748b; margin-top: 40px; border-top: 1px solid #1e293b; pt: 10px;">
            Enviado desde Beelink S13 - Debian Trixie - UTN Avellaneda
        </p>
    </div>
    """

    message = MessageSchema(
        subject="🚀 Activa tu cuenta en NIBAL.INK",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
