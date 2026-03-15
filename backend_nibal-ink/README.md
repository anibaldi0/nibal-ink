# BACKEND_NIBAL-INK - API REST

Este es el motor de servicios asincronos para el ecosistema nibal.ink, 
especializado en e-commerce de tazas personalizadas, visualizacion 3D
y gestion de regalos mediante tokens UUID.

## 1. STACK TECNICO (CORE)

- **Framework:** FastAPI (Python 3.13+)
- **Base de Datos:** PostgreSQL 16+
- **Motor de DB:** SQLAlchemy 2.0 (Mapped Style)
- **Driver Async:** asyncpg
- **Validacion:** Pydantic v2 (Strict Typing)
- **Seguridad:** JWT (python-jose) + Bcrypt (passlib)
- **Servidor:** Uvicorn (con loop de eventos uvloop)

## 2. ARQUITECTURA DE DIRECTORIOS

```text
backend_nibal-ink/
├── app/
│   ├── api/                # Versionado de Endpoints (v1)
│   ├── core/               # Configuracion y Seguridad centralizada
│   ├── db/                 # Sesion asincrona y scripts de DB
│   ├── models/             # Modelos de SQLAlchemy (Tablas)
│   ├── schemas/            # Esquemas de Pydantic (Validacion)
│   ├── services/           # Logica de negocio (Pure Python)
│   └── main.py             # Punto de entrada de la aplicacion
├── venv/                   # Entorno virtual (Ignorado en Git)
├── .env                    # Variables de entorno (Privado)
├── .env.example            # Plantilla para despliegue
├── requirements.txt        # Dependencias fijadas
└── README.md               # Documentacion del sistema
3. INSTALACION Y CONFIGURACION
A. Requisitos previos (Debian Trixie)
Bash
sudo apt update
sudo apt install python3-venv python3-pip build-essential libpq-dev -y
B. Preparar el entorno
Bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
C. Variables de Entorno
Copia el archivo .env.example a .env y completa los campos:

JWT_SECRET_KEY: Generado con openssl rand -hex 32.

DATABASE_URL: Formato postgresql+asyncpg://user:pass@host:port/dbname.

4. INICIALIZACION DE LA BASE DE DATOS
El sistema cuenta con un script de "Seeding" para crear tablas y un usuario administrador inicial.

Bash
# Con el venv activo
python3 -m app.db.init_db
Nota: Esto creara el usuario admin@nibal.ink con permisos de SuperUser.

5. EJECUCION
Desarrollo (con Hot-Reload)
Bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
Produccion (Recomendado)
Bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
6. DOCUMENTACION DE LA API
Una vez iniciado el servidor, puedes acceder a la documentacion interactiva:

Swagger UI: http://localhost:8000/docs

ReDoc: http://localhost:8000/redoc

7. LOGICA DE REGALOS (GIFT EXPERIENCE)
El sistema soporta un flujo de acceso dual:

Compradores: Autenticacion fuerte via JWT para gestion de pedidos y "Vitrina de Regalos".

Destinatarios: Acceso limitado via UUID (Token en QR de la taza) para visualizar modelos 3D (.glb) sin necesidad de registro previo.

8. REGLAS NINJA PARA CONTRIBUIDORES
No se permite el uso de 'Any' en el tipado. Todo debe estar estrictamente definido.

Cada nuevo modelo debe heredar de app.models.base_model.Base.

Los commits deben seguir la convencion de Conventional Commits (feat, fix, docs, refactor).

No subir el archivo .env al repositorio bajo ninguna circunstancia.

El codigo debe seguir los principios de modularizacion y legibilidad.

Mantenido por Anibal Caeiro (nibalink.com) - Estudiante UTN Avellaneda.
