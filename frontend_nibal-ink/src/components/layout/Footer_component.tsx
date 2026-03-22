// src/components/layout/Footer_component.tsx
import '../../styles/theme_style.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          
          {/* SECCIÓN IZQUIERDA: IDENTIDAD */}
          <div className="space-y-4 text-center md:text-left">
            {/* Logo para Modo Claro (Se oculta en dark) */}
            <img 
              src="/logo_nibal_negro_rojo_01.png" 
              alt="NIBAL.INK Logo" 
              className="footer-logo dark:hidden mx-auto md:mx-0"
            />
            {/* Logo para Modo Oscuro (Se oculta en light, se muestra en dark) */}
            <img 
              src="/logo_nibal_blanco_rojo.png" 
              alt="NIBAL.INK Logo" 
              className="footer-logo hidden dark:block mx-auto md:mx-0"
            />
            
            <p className="footer-text">
              Laboratorio de prototipado rápido y sublimación digital.<br />
              Desarrollado para la UTN Avellaneda.
            </p>
          </div>

          {/* SECCIÓN CENTRAL: TECNOLOGÍA */}
          <div className="flex flex-col items-center">
            <div className="footer-label">Stack</div>
            <div className="flex gap-5">
              <span className="footer-stack-item">React</span>
              <span className="footer-stack-item">FastAPI</span>
              <span className="footer-stack-item">PostgreSQL</span>
              <span className="footer-stack-item">Docker</span>
            </div>
          </div>

          {/* SECCIÓN DERECHA: INFRAESTRUCTURA */}
          <div className="text-center md:text-right space-y-1">
            <div className="footer-label">Procesado en</div>
            <div className="footer-server-tag">
              Beelink S13 @ Debian Trixie
            </div>
            <div className="footer-text pt-2">
              © 2026 - {" "}
              <a 
                href="https://nibalink.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                nibalink.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;