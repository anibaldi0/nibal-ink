// src/pages/LandingPage_page.tsx
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="space-y-32 pb-20 max-w-7xl mx-auto px-4">
      
      {/* HERO SECTION - TIPOGRÁFICO Y AGRESIVO */}
      <section className="flex flex-col items-center justify-center pt-32 pb-20 min-h-[60vh] text-center space-y-12">
        <div className="inline-block px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse">
          Node: Debian Trixie // Beelink S13 Online
        </div>
        
        <div className="space-y-6">
          <h2 className="text-7xl md:text-9xl font-black leading-[0.8] tracking-tighter text-white">
            MAS QUE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 italic">UNA TAZA.</span>
          </h2>
          
          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
            Plataforma para personalizar tu taza o mug. <br />
            Previsualización <span className="text-white font-mono uppercase text-lg">3D Real-Time</span> y producción directa.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full max-w-lg">
          <Link 
            to="/editor"
            className="flex-1 group relative px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:bg-sky-400 transition-all overflow-hidden shadow-[0_20px_80px_rgba(56,189,248,0.2)] text-center"
          >
            <span className="relative z-10 uppercase tracking-[0.2em] text-sm">Lanzar Editor</span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link 
            to="/login" 
            className="flex-1 px-12 py-6 border border-slate-700 font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest text-slate-200 text-center"
          >
            Portal Cliente
          </Link>
        </div>

        {/* Decorativo de Fondo para compensar la falta del 3D */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* VITRINA DE PRODUCCIÓN (Mantenida intacta) */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-white">
              Vitrina de Producción
            </h3>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Latest batches from UTN Node // Avellaneda</p>
          </div>
          <Link to="/vitrina" className="text-sky-400 text-xs font-mono hover:underline uppercase tracking-widest py-2 px-4 border border-sky-400/20 rounded-lg bg-sky-400/5">
            Ver Todo el Nodo →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative bg-slate-900/20 rounded-[40px] border border-slate-800 p-8 hover:border-sky-500/40 transition-all hover:-translate-y-2">
              <div className="aspect-square bg-slate-950 rounded-[30px] mb-8 overflow-hidden border border-slate-800 flex items-center justify-center relative shadow-inner">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 z-10" />
                 <span className="text-slate-800 font-black text-7xl opacity-10">0{i}</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-bold font-mono uppercase tracking-widest border border-emerald-500/20">
                    Ready_to_Print
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono italic text-slate-500 uppercase tracking-tighter">ALPHA-ST-0{i}</span>
                </div>
                <h4 className="font-bold text-white text-xl tracking-tight">Modelo Sublimación Alpha</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;