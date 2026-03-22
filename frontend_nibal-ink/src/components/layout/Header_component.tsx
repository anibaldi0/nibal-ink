// src/components/layout/Header_component.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; // Traemos el store para la logica de usuario 

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, userEmail, setLogout } = useAuthStore(); // Usamos tu store persistente 
  const isAdmin = location.pathname === '/admin';

  return (
    <header className="p-6 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* LOGO DINAMICO Y FLEXIBLE */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group transition-transform active:scale-95 flex-shrink-0"
        >
          <img 
            src="/logo_nibal_blanco_rojo.png" 
            alt="NIBAL.INK Logo" 
            className="
              /* Altura base para moviles */
              h-12 
              /* Altura para tablets/laptops medianas */
              md:h-14 
              /* Altura para monitores grandes */
              lg:h-16 
              /* Mantiene la proporcion y suaviza los bordes */
              w-auto object-contain 
              /* Efectos visuales de Nibal.ink */
              brightness-110 
              group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] 
              transition-all duration-300
            "
          />
          
          {isAdmin && (
            <span className="hidden xs:block px-2 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-sky-400 border border-slate-700 animate-pulse uppercase tracking-widest">
              SYSADMIN
            </span>
          )}
        </Link>

        {/* NAVEGACION DINAMICA */}
        <nav className="flex items-center gap-8">
          {isAuthenticated ? (
            // VISTA CUANDO EL USUARIO ESTA LOGUEADO [cite: 201, 212]
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Operador</span>
                <span className="text-xs font-bold text-white">{userEmail}</span>
              </div>
              
              <div className="h-8 w-[1px] bg-slate-800 mx-2" />

              <button 
                onClick={() => setLogout()} // Limpia el LocalStorage gracias a tu persist [cite: 204, 213, 215]
                className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-[0.2em] border border-red-400/20 px-3 py-2 rounded-lg hover:bg-red-400/10"
              >
                Salir
              </button>
            </div>
          ) : (
            // VISTA VISITANTE (Tu logica original) 
            <div className="flex gap-6 text-xs font-bold uppercase tracking-wider">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">Inicio</Link>
              <Link to="/login" className="px-5 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-all shadow-lg shadow-sky-900/20 active:scale-95">
                Acceso
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;