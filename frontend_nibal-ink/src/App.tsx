// src/App.tsx
import CanvasEditor from './components/editor/CanvasEditor_component';
import Escenario3D from './components/preview/Escenario3D_component';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header Estilo Tech */}
      <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-black tracking-tighter text-sky-400">
          NIBAL<span className="text-white">.INK</span> 
          <span className="ml-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Customizer v1.0</span>
        </h1>
      </header>

      <main className="container mx-auto p-4 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Columna Izquierda: El Editor 2D */}
          <section className="space-y-6">
            <div className="bg-slate-900 p-1 rounded-2xl shadow-2xl border border-slate-800">
              <CanvasEditor />
            </div>
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
              <h3 className="text-sky-400 font-bold mb-2">Instrucciones Ninja:</h3>
              <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                <li>Subí tu logo o imagen (PNG/JPG).</li>
                <li>Acomodalo dentro del recuadro azul.</li>
                <li>Observá la vista previa 3D en tiempo real.</li>
              </ul>
            </div>
          </section>

          {/* Columna Derecha: El Render 3D */}
          <section className="sticky top-28">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative">
                <Escenario3D />
              </div>
            </div>
            <button 
              onClick={() => alert("Aquí dispararemos el POST /create que hicimos en el backend")}
              className="w-full mt-6 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-sky-500/20"
            >
              CONFIRMAR DISEÑO Y PEDIR
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;