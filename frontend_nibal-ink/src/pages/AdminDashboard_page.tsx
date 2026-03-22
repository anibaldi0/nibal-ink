// src/pages/AdminDashboard_page.tsx
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Agregado para redirección
import { useAuthStore } from '../store/useAuthStore'; // Importamos tu store de auth [cite: 194-217]
import CanvasEditor from '../components/editor/CanvasEditor_component';
import Escenario3D from '../components/preview/Escenario3D_component';
import HistoryGallery from '../components/editor/HistoryGallery_component';
import { designService } from '../services/api_service';

const AdminDashboard = () => {
  const editorRef = useRef<{ getRecorteParaProduccion: () => string | null }>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0);
  
  const navigate = useNavigate(); // Hook para navegar
  const { isAuthenticated } = useAuthStore(); // Leemos el estado de autenticación [cite: 210]

  const handleConfirmarPedido = async () => {
    if (isUploading) return;

    // --- FILTRO DE SEGURIDAD NINJA ---
    if (!isAuthenticated) {
      alert("Debes iniciar sesion.");
      navigate('/login?redirect=admin'); // Redirigimos al login [cite: 703]
      return;
    }

    const croppedImage = editorRef.current?.getRecorteParaProduccion();
    if (!croppedImage) {
      alert("Error: No hay diseño para exportar.");
      return;
    }

    try {
      setIsUploading(true);
      await designService.upload(croppedImage); // [cite: 480-485]
      setRefreshGallery(prev => prev + 1);
      alert("¡Sincronizado con Beelink S13 con éxito!");
    } catch (error) {
      alert("Falla de conexión con Beelink S13.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <header className="p-6 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">NIBAL</span>
            <span className="text-white">.INK</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-sky-400 border border-slate-700">ADMIN-CONSOLE</span>
          </h1>
          <nav className="flex gap-6 text-[10px] font-mono uppercase tracking-[0.2em]">
            <a href="/" className="text-slate-500 hover:text-white transition-colors">Cerrar Sesión</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 lg:p-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <section className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-slate-900/50 p-2 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <CanvasEditor ref={editorRef} />
            </div>
          </section>
          <section className="sticky top-32 space-y-8 animate-in fade-in slide-in-from-right duration-700">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-3xl blur opacity-20 transition duration-1000"></div>
              <div className="relative"><Escenario3D /></div>
            </div>
            <button
              onClick={handleConfirmarPedido}
              disabled={isUploading}
              className={`group relative w-full overflow-hidden py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all
                ${isUploading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-white text-slate-950 hover:bg-sky-400 active:scale-95 shadow-[0_0_30px_-5px_rgba(56,189,248,0.4)]'
                }`}
            >
              {isUploading ? 'Sincronizando con Beelink...' : 'Confirmar y Enviar a Producción'}
            </button>
          </section>
        </div>
        <section className="pt-12 border-t border-slate-800/50">
          <HistoryGallery refreshTrigger={refreshGallery} />
        </section>
      </main>
    </>
  );
};

export default AdminDashboard;