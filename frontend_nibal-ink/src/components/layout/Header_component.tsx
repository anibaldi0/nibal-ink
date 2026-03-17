// src/components/layout/Header_component.tsx
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header className="p-6 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
          <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-sky-400 transition-all duration-500">
            NIBAL
          </span>
          <span className="text-white">.INK</span> 
          {isAdmin && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-sky-400 border border-slate-700 animate-pulse">
              SYSADMIN-MODE
            </span>
          )}
        </Link>

        {/* NAVEGACIÓN DINÁMICA */}
        <nav className="flex items-center gap-8">
          {isAdmin ? (
            // Información técnica solo para el Admin
            <div className="hidden md:flex gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                Beelink S13: Online
              </span>
              <span>Debian Trixie</span>
              <span>UTN-AVA</span>
            </div>
          ) : (
            // Links para el usuario común
            <div className="flex gap-6 text-xs font-bold uppercase tracking-wider">
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">Inicio</Link>
              <Link to="/login" className="px-4 py-2 bg-slate-800 text-sky-400 rounded-lg hover:bg-slate-700 transition-colors">Acceso</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
