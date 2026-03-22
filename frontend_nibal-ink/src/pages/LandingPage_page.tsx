// src/pages/LandingPage_page.tsx
import { Link } from 'react-router-dom';
import '../styles/theme_style.css'; 

const LandingPage = () => {
  return (
    <div className="page-main-layout">
      
      {/* HERO SECTION - TIPOGRÁFICO Y ARTÍSTICO */}
      <section className="hero-container">
        <div className="node-badge">
          Node: Debian Trixie // Beelink S13 Online
        </div>
        
        <div className="hero-text-stack">
          <h2 className="hero-title">
            MAS QUE <br />
            <span className="hero-gradient-text">UNA TAZA.</span>
          </h2>
          
          <p className="hero-description">
            Plataforma para personalizar tu arte. <br />
            Previsualización <span className="tech-span">3D Real-Time</span> y producción directa.
          </p>
        </div>
        
        <div className="hero-actions">
          {/* btn-access ya usa la paleta indigo en el CSS del Header */}
          <Link to="/editor" className="btn-access py-6 text-center flex items-center justify-center">
            Lanzar Editor
          </Link>

          <Link to="/login" className="btn-secondary-art">
            Portal Cliente
          </Link>
        </div>

        {/* Glow Decorativo de fondo */}
        <div className="hero-glow-effect" />
      </section>

      {/* VITRINA DE PRODUCCIÓN */}
      <section className="vitrina-section">
        <div className="vitrina-header">
          <div className="vitrina-title-group">
            <h3 className="section-title">
              Vitrina de Producción
            </h3>
            <p className="section-subtitle">Latest batches from UTN Node // Avellaneda</p>
          </div>
          {/* nav-link-art ya tiene los hovers indigo/sky definidos */}
          <Link to="/vitrina" className="nav-link-art border border-slate-200 dark:border-slate-800 py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
            Ver Todo el Nodo →
          </Link>
        </div>

        <div className="vitrina-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="vitrina-card group">
              <div className="vitrina-image-container">
                 <div className="vitrina-card-overlay" />
                 <span className="vitrina-card-number">0{i}</span>
              </div>
              
              <div className="vitrina-card-info">
                <div className="vitrina-card-meta">
                  <span className="status-badge">Ready_to_Print</span>
                  <span className="serial-number">ALPHA-ST-0{i}</span>
                </div>
                <h4 className="product-name">Modelo Sublimación Alpha</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;