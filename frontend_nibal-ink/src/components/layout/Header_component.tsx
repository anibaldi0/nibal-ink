// src/components/layout/Header_component.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import '../../styles/theme_style.css'; // Tu nueva nomenclatura

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, setLogout } = useAuthStore();
  
  const isAdmin = location.pathname === '/admin';

  // Lógica de Persistencia de Tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleLogoutAction = () => {
    setLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header-main px-6 py-4 md:px-10">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* LOGO: Identidad NIBAL.INK */}
          {/* LOGO: Identidad NIBAL.INK con Sombra Inversa */}
          <Link to="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <img 
              src="/logo_nibal_negro_rojo_01.png" 
              alt="NIBAL.INK" 
              className="
                h-12 md:h-14 w-auto object-contain 
                transition-all duration-300 
                
                /* 1. SOMBRA SIEMPRE ACTIVA (Estado inicial) */
                drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] 
                
                /* 2. QUITAR SOMBRA AL PASAR EL CURSOR (Estado hover) */
                group-hover:drop-shadow-none
              " 
            />
            {isAdmin && (
              <span className="hidden xs:block px-2 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-sky-400 border border-slate-700 uppercase tracking-widest">
                SYSADMIN
              </span>
            )}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/editor" className="nav-link-art">Editor</Link>
            <Link to="/vitrina" className="nav-link-art">Galería</Link>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                    Operador
                  </span>
                  {/* Eliminamos el split para mostrar el userName tal cual viene del Store */}
                  <span className="text-xs font-bold">{userName}</span>
                </div>
                <button 
                  onClick={handleLogoutAction} 
                  className="nav-link-art text-red-500 dark:text-red-400 font-bold"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-105 transition-all"
              >
                Acceso
              </Link>
            )}

            <button onClick={toggleTheme} className="theme-switcher">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          {/* MOBILE TOGGLE */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggleTheme} className="theme-switcher">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="p-2">
              <Menu size={28} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="mobile-overlay animate-in fade-in slide-in-from-right-5 duration-300">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 p-2">
            <X size={32} />
          </button>
          
          <nav className="flex flex-col items-center gap-8 text-center">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-serif">Inicio</Link>
            <Link to="/editor" onClick={() => setIsMenuOpen(false)} className="text-4xl font-serif">Editor</Link>
            <Link to="/vitrina" onClick={() => setIsMenuOpen(false)} className="text-4xl font-serif">Galería</Link>
            
            <div className="pt-8 flex flex-col items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-slate-400 font-mono text-sm">{userName}</span>
                  <button onClick={handleLogoutAction} className="text-red-500 font-black uppercase tracking-widest">Cerrar Sesión</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black uppercase tracking-widest">
                  Acceso Operador
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;