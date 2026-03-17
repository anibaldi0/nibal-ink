// src/pages/LandingPage_page.tsx
import { Link } from 'react-router-dom';
import Escenario3D from '../components/preview/Escenario3D_component';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20 max-w-7xl mx-auto">
      
      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center gap-16 pt-10 min-h-[60vh]">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-block px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-[10px] font-mono tracking-widest uppercase">
            Node: Debian Trixie Active
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
            MAS QUE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 italic">UNA TAZA.</span>
          </h2>
          
          <p className="text-slate-400 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Sistemas de personalización industrial con previsualización en tiempo real. 
            Directo desde tu navegador a nuestra <span className="text-white font-mono">Beelink S13</span>.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
            <Link to="/admin" className="group relative px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-sky-400 transition-all overflow-hidden">
              <span className="relative z-10">LANZAR EDITOR</span>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/login" className="px-10 py-4 border border-slate-700 font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest">
              PORTAL CLIENTE
            </Link>
          </div>
        </div>
        
        {/* PREVIEW 3D DINÁMICO */}
        <div className="flex-1 w-full max-w-[500px] relative">
          <div className="absolute -inset-10 bg-sky-500/10 blur-[100px] rounded-full" />
          <div className="relative bg-slate-900/40 p-4 rounded-[40px] border border-slate-800/50 backdrop-blur-sm shadow-2xl">
            <div className="h-[400px] w-full overflow-hidden rounded-[30px]">
               <Escenario3D /> 
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA DE VITRINA (Simulando el futuro Dashboard de Guest) */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
              Vitrina de Producción
            </h3>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Latest batches from UTN Avellaneda Node</p>
          </div>
          <Link to="/vitrina" className="text-sky-400 text-xs font-mono hover:underline">VER TODA LA GALERIA →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative bg-slate-900/30 rounded-3xl border border-slate-800 p-6 hover:border-sky-500/40 transition-all hover:translate-y-[-5px]">
              <div className="aspect-square bg-slate-950 rounded-2xl mb-6 overflow-hidden border border-slate-800 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 z-10" />
                 <span className="text-slate-800 font-black text-6xl opacity-20">#{i}</span>
                 {/* Aquí iría la imagen cargada de la Beelink */}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-emerald-500">READY_TO_PRINT</span>
                  <span className="text-[10px] text-slate-600 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <h4 className="font-bold text-white text-lg">Modelo Sublimación Alpha</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;