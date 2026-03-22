// src/components/layout/Footer_component.tsx
const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          
          {/* SECCIÓN IZQUIERDA: INFO - Blanco con opacidad alta para legibilidad */}
          <div className="space-y-2 text-center md:text-left">
            {/* <h4 className="text-[18px] font-black tracking-widest text-white uppercase">NIBAL.INK</h4> */}
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
            <p className="text-[14px] text-slate-200 font-mono leading-relaxed">
              Laboratorio de prototipado rápido y sublimación digital. 
              Desarrollado para la Tecnicatura Universitaria en Programación - UTN Avellaneda.
            </p>
          </div>

          {/* SECCIÓN CENTRAL: STACK - Slate claro para que destaque */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-[14px] font-mono text-slate-400 uppercase tracking-[0.4em]">Stack</div>
            <div className="flex gap-4 text-[14px] font-bold text-white">
              <span className="hover:text-sky-400 transition-colors">React</span>
              <span className="hover:text-sky-400 transition-colors">FastAPI</span>
              <span className="hover:text-sky-400 transition-colors">PostgreSQL</span>
              <span className="hover:text-sky-400 transition-colors">Docker</span>
            </div>
          </div>

          {/* SECCIÓN DERECHA: SERVER & LINK - Emerald brillante y blanco puro */}
          <div className="text-center md:text-right">
            <div className="text-[16px] font-mono text-slate-400 uppercase tracking-widest">Procesado en</div>
            <div className="text-[18px] font-black text-emerald-400 uppercase tracking-tight">
              Beelink S13 @ Debian Trixie
            </div>
            <div className="text-[16px] text-slate-200 mt-2 font-medium">
              © 2026 - {" "}
              <a 
                href="https://nibalink.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 transition-colors underline decoration-sky-400/50 underline-offset-4 font-bold"
              >
                nibalink.com
              </a>
              . Todos los derechos reservados.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;