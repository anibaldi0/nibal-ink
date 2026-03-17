// src/components/editor/CanvasEditor_component.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric'; 
import { useDesignStore } from '../../store/useDesignStore';

const CanvasEditor = forwardRef((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const { setDesignImage } = useDesignStore();

  // EXPOSICIÓN DE COMANDOS AL PADRE (App.tsx)
  // Aquí definimos la función de recorte sin alterar el flujo del editor
  useImperativeHandle(ref, () => ({
    getRecorteParaProduccion: () => {
      if (!fabricCanvas.current) return null;

      const objects = fabricCanvas.current.getObjects();
      const safetyFrame = objects.find(obj => obj.stroke === 'red');
      
      if (safetyFrame) safetyFrame.set('visible', false);
      fabricCanvas.current.renderAll();

      // EXPORTACIÓN DE ALTA RESOLUCIÓN PARA SUBLIMACIÓN
      const croppedData = fabricCanvas.current.toDataURL({
        format: 'webp',
        quality: 1,      // Calidad máxima sin pérdidas notables
        multiplier: 4,   // <--- AQUÍ ESTÁ EL TRUCO: Multiplica los píxeles por 4
        left: 50,
        top: 25,
        width: 400,
        height: 170,
      });

      if (safetyFrame) safetyFrame.set('visible', true);
      fabricCanvas.current.renderAll();

      return croppedData;
    }
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    // Inicializamos el Canvas con tus medidas base
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 225,
      backgroundColor: '#ffffff',
    });

    // --- CREACION DEL MARCO DE SEGURIDAD (RED FRAME) ---
    const safetyFrame = new fabric.Rect({
      left: 50,           // Margen Left: 20mm
      top: 25,            // Margen Top: 10mm
      width: 400,         // Area util horizontal
      height: 170,        // Area util vertical
      fill: 'transparent',
      stroke: 'red',      // Color solicitado
      strokeWidth: 3,
      strokeDashArray: [5, 5], // Linea punteada
      selectable: false,  
      evented: false,     
      opacity: 1
    });

    fabricCanvas.current.add(safetyFrame);
    // --------------------------------------------------

    const updateStore = () => {
      if (!fabricCanvas.current) return;
      
      // Antes de exportar la imagen para el 3D,
      // ocultamos el marco rojo para que no salga en la taza previa.
      safetyFrame.set('visible', false);
      fabricCanvas.current.renderAll();

      const dataURL = fabricCanvas.current.toDataURL({
        format: 'webp',
        quality: 0.8,
        multiplier: 1,
      });

      // Volvemos a mostrar el marco para el usuario en el editor
      safetyFrame.set('visible', true);
      fabricCanvas.current.renderAll();

      setDesignImage(dataURL);
    };

    fabricCanvas.current.on('object:modified', updateStore);
    fabricCanvas.current.on('object:added', updateStore);
    fabricCanvas.current.on('object:removed', updateStore);

    return () => {
      fabricCanvas.current?.dispose();
    };
  }, [setDesignImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(100);
        fabricCanvas.current?.add(img);
        fabricCanvas.current?.centerObject(img);
        fabricCanvas.current?.setActiveObject(img);
        fabricCanvas.current?.renderAll();
      }, { crossOrigin: 'anonymous' });
    };
    reader.readAsDataURL(file);
  };

  const handleClearCanvas = () => {
    if (!fabricCanvas.current) return;
    const objects = fabricCanvas.current.getObjects();
    objects.forEach((obj) => {
      if (obj.stroke !== 'red') {
        fabricCanvas.current?.remove(obj);
      }
    });
    fabricCanvas.current.renderAll();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-slate-900 rounded-2xl border border-slate-700">
      <div className="text-center">
        <h2 className="text-xl font-bold text-blue-500 uppercase">Editor de Seguridad</h2>
        <p className="text-[20px] text-yellow-400 font-mono italic">
          Las líneas rojas indican los límites de impresión
        </p>
      </div>
      
      <div className="border-4 border-slate-800 rounded-lg bg-white overflow-hidden shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]">
        <canvas ref={canvasRef} />
      </div>

      <div className="flex gap-4">
        <label className="cursor-pointer bg-blue-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95">
          SUBIR LOGO
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <button 
          onClick={handleClearCanvas}
          className="bg-slate-700 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95">
          LIMPIAR
        </button>
      </div>
    </div>
  );
});

export default CanvasEditor;