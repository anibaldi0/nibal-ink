// src/pages/Editor_page.tsx
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Escenario3D from '../components/preview/Escenario3D_component';
import CanvasEditor from '../components/editor/CanvasEditor_component';
import { designService } from '../services/api_service';
import { ArrowLeft, Save, Cloud, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore'; 

const EditorPage = () => {
  const { token } = useAuthStore(); 
  const canvasRef = useRef<any>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false); 
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', msg: string} | null>(null);

  useEffect(() => {
    if (!token) navigate('/login?redirect=editor');
  }, [token, navigate]);

  useEffect(() => {
    if (status?.type === 'success') {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSaveToBeelink = async () => {
    // 1. Verificación de contenido
    if (!canvasRef.current?.hasContent()) {
      setStatus({ type: 'error', msg: '❌ El lienzo está vacío.' });
      setIsReady(false);
      return;
    }

    const designData = canvasRef.current?.getRecorteParaProduccion();
    if (!designData) return;

    setIsLoading(true);
    setStatus({ type: 'info', msg: 'Sincronizando con el nodo...' });

    try {
      await designService.upload(designData);
      
      // 2. Éxito y Limpieza
      setStatus({ type: 'success', msg: '✅ ¡Diseño guardado! Lienzo liberado.' });
      
      // Llamamos a la función expuesta en el Canvas
      if (canvasRef.current?.clear) {
        canvasRef.current.clear();
      }
      
      setIsReady(false);
    } catch (err: any) {
      const msg = err.message === "DEBE_VERIFICAR_EMAIL" 
        ? 'Acción bloqueada: Verifica tu email.' 
        : 'Error de conexión con el servidor.';
      setStatus({ type: 'error', msg });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-8 text-white font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Volver al Home
        </button>
        <div className="flex items-center gap-3">
          <Cloud size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">Node: Debian-Beelink Online</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          <div className="p-8 border-r border-slate-800 space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter">Canvas para diseño</h2>
            <CanvasEditor ref={canvasRef} />

            <div className="space-y-4 pt-4">
              {!isReady ? (
                <button 
                  onClick={() => {
                    if (canvasRef.current?.hasContent()) {
                      setIsReady(true);
                      setStatus(null);
                    } else {
                      setStatus({ type: 'error', msg: '❌ Agregue una imagen antes de confirmar.' });
                    }
                  }}
                  className="w-full py-5 bg-slate-800 hover:bg-slate-700 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  <CheckCircle size={18} /> Diseño Listo
                </button>
              ) : (
                <button 
                  onClick={handleSaveToBeelink}
                  disabled={isLoading}
                  className="w-full py-5 bg-sky-600 hover:bg-emerald-500 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-lg disabled:opacity-50"
                >
                  <Save size={18} />
                  {isLoading ? 'Transmitiendo...' : 'Confirmar y Guardar'}
                </button>
              )}

              {isReady && !isLoading && (
                <button onClick={() => setIsReady(false)} className="w-full text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest">
                  Seguir Editando
                </button>
              )}
              
              {status && (
                <div className={`p-4 rounded-xl border text-center font-bold text-xs animate-in zoom-in duration-300 ${
                  status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
                  status.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-400' :
                  'bg-sky-500/10 border-sky-500 text-sky-400'
                }`}>
                  {status.msg}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/50 p-8 flex flex-col items-center justify-center relative">
            <h2 className="absolute top-8 right-8 text-xl font-black text-sky-500 uppercase tracking-tighter text-right">Vista de Producción</h2>
            <div className="w-full h-full flex items-center justify-center">
               <Escenario3D /> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;