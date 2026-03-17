import { useEffect, useState } from 'react';
import { designService } from '../../services/api_service';

const HistoryGallery = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [designs, setDesigns] = useState<string[]>([]);

  const loadHistory = async () => {
    try {
      const data = await designService.getHistory();
      setDesigns(data);
    } catch (err) {
      console.error("Error cargando historial");
    }
  };

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]); // Se recarga cuando subimos algo nuevo

  return (
    <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-800">
      <h3 className="text-emerald-400 font-bold mb-4 uppercase text-sm tracking-widest">
        Diseños Registrados
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {designs.length === 0 && <p className="text-slate-500 text-sm">No hay diseños aún.</p>}
        {designs.map((fileId) => (
          <div key={fileId} className="flex-shrink-0 group relative">
            <img 
              src={designService.getFileUrl(fileId)} 
              alt="Thumbnail" 
              className="h-20 w-40 object-cover rounded-lg border border-slate-700 group-hover:border-emerald-500 transition-all"
            />
            <span className="absolute bottom-1 right-1 bg-black/70 text-[8px] p-1 rounded">
              {fileId.slice(-8)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;
