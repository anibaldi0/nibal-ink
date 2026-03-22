// src/components/layout/Header_component.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import '../../styles/theme_style.css'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, setLogout } = useAuthStore();
  
  const isAdmin = location.pathname === '/admin';

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
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    const newTheme = newIsDark ? 'dark' : 'light';
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const handleLogoutAction = () => {
    setLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header-main">
        <div className="container mx-auto flex justify-between items-center">
          
          <Link to="/" className="logo-link group">
            <img 
              src={isDark ? "/logo_nibal_blanco_rojo.png" : "/logo_nibal_negro_rojo_01.png"} 
              alt="NIBAL.INK" 
              className="logo-img" 
            />
            {isAdmin && <span className="badge-admin">SYSADMIN</span>}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/editor" className="nav-link-art">Editor</Link>
            <Link to="/vitrina" className="nav-link-art">Galería</Link>
            <div className="nav-divider" />

            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[12px] font-mono opacity-60 uppercase tracking-widest">Operador</span>
                  <span className="text-sm font-bold">{userName}</span>
                </div>
                <button onClick={handleLogoutAction} className="btn-logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-access">Acceso</Link>
            )}

            <button onClick={toggleTheme} className="theme-switcher">
              {isDark ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
            </button>
          </nav>

          {/* MOBILE TOGGLE BUTTONS */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={toggleTheme} className="theme-switcher">
              {isDark ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-500">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU SYSTEM */}
      {isMenuOpen && (
        <>
          {/* Backdrop: Al hacer click aquí (afuera del menú), se cierra */}
          <div className="mobile-menu-backdrop" onClick={() => setIsMenuOpen(false)} />
          
          {/* El Panel que sale de izquierda a derecha */}
          <div className="mobile-overlay">
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute top-8 right-8 p-2 text-slate-500"
            >
              <X size={32} />
            </button>
            
            <nav className="flex flex-col items-center gap-8 text-center">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Inicio</Link>
              <Link to="/editor" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Editor</Link>
              <Link to="/vitrina" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Galería</Link>
              
              <div className="pt-8 flex flex-col items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-slate-400 font-mono text-sm">{userName}</span>
                    <button onClick={handleLogoutAction} className="btn-logout text-xl">Cerrar Sesión</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-access text-base py-4 px-10">
                    Acceso Operador
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;