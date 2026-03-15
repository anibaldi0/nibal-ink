# NIBAL-INK E-COMMERCE ECOSYSTEM

Este repositorio centraliza el desarrollo de nibal.ink, una plataforma 
desacoplada para la venta de tazas personalizadas e impresion 3D, 
enfocada en una experiencia de usuario (UX) de alta gama mediante 
visualizacion 3D y gestion de obsequios.

## 1. ARQUITECTURA GENERAL DEL SISTEMA

El sistema se basa en un modelo Cliente-Servidor estrictamente tipado:

- **Backend (API):** FastAPI + PostgreSQL sobre una MiniPC Beelink S13.
- **Frontend (UI):** React + TypeScript enfocado en SPA (Single Page Application).
- **Conectividad:** Cloudflare Tunnels para exposicion segura de servicios locales.



---

## 2. VISION DE UI/UX (USER EXPERIENCE)

Nibal-ink no es solo un carrito de compras; es un puente entre quien regala 
y quien recibe. El sistema implementa tres niveles de interfaz:

### A. Dashboard del Comprador (Full Auth)
- **Registro/Login:** Autenticacion fuerte via JWT.
- **Proceso de Compra:** Seleccion de tazas y visualizacion previa 3D.
- **Configuracion de Regalo:** Formulario para incluir mensaje personal, 
  nombre del destinatario y generacion automatica del UUID de acceso.
- **La Vitrina:** Dashboard exclusivo donde el usuario ve todas las tazas 
  que ha regalado, como una coleccion digital de sus gestos afectuosos.

### B. Dashboard del Destinatario (Guest Access via QR)
- **Acceso:** Sin friccion. Escaneo de QR fisico en la taza -> URL con UUID.
- **Interfaz:** Visualizador interactivo 3D (.glb) de la taza recibida.
- **Personalizacion:** Muestra el mensaje de felicitaciones y quien lo envio.
- **Engagement:** Boton de conversion directa para crear su propio regalo.

### C. Dashboard Administrativo (Ninja Mode)
- Gestion de inventario de tazas y estado de las impresiones 3D.
- Monitoreo de pedidos y generacion de etiquetas de envio.



---

## 3. ESTRUCTURA DEL REPOSITORIO

```text
nibal-ink/
├── backend_nibal-ink/       # Motor de servicios (Python 3.13)
│   ├── app/                 # Codigo fuente de la API
│   └── ...                  # Ver README.md interno para detalles
│
├── frontend_nibal-ink/      # Interfaz de usuario (React + TS)
│   ├── src/                 # Componentes, Hooks y Paginas
│   └── ...                  # Ver README.md interno para detalles
│
└── docker-compose.yml       # Orquestacion de servicios (Pruebas Locales)
4. REGLAS DE ORO (NINJA CODE)
Nomenclatura: Prohibido el uso de abreviaturas. Ejemplo: user_identification_number en lugar de user_id.

Seguridad: Los UUID son obligatorios para cualquier recurso publico (regalos). No usar IDs incrementales en las URLs.

Modularizacion: Logica de negocio en services/, validacion en schemas/ y tipos en types/.

Higiene: El archivo .env nunca se trackea. Usar .env.example como guia.

5. GUIA DE INICIO RAPIDO
Backend
Bash
cd backend_nibal-ink
source venv/bin/activate
python3 -m app.db.init_db  # Crea tablas y admin inicial
uvicorn app.main:app --reload
Frontend
Bash
cd frontend_nibal-ink
npm install
npm run dev
6. INFRAESTRUCTURA DE DESPLIEGUE
Host: Beelink S13 (Debian Trixie)

Proxy Inverso: Nginx

Tunel: Cloudflare Tunnel (cloudflared)

Dominio: nibalink.com (E-commerce) / nibal.ink (Regalos/QR)

Mantenido por Anibal Caeiro (nibalink.com) - Padawan Sysadmin Ninja.
