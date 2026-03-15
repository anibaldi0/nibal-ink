// src/components/editor/CanvasEditor_component.tsx
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric'; 
import { useDesignStore } from '../../store/useDesignStore';

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const { setDesignImage } = useDesignStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Inicializamos el Canvas con tus medidas base
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 225,
      backgroundColor: '#ffffff',
    });

    // --- CREACION DEL MARCO DE SEGURIDAD (RED FRAME) ---
    // Calculamos el ancho y alto interno restando los margenes
    // Ancho: 500 - 50 (left) - 25 (right) = 425
    // Alto: 225 - 25 (top) - 50 (bottom) = 150
    const safetyFrame = new fabric.Rect({
      left: 50,           // Margen Left: 20mm
      top: 25,            // Margen Top: 10mm
      width: 400,         // Area util horizontal
      height: 170,        // Area util vertical
      fill: 'transparent',
      stroke: 'red',      // Color solicitado
      strokeWidth: 3,
      strokeDashArray: [5, 5], // Linea punteada para que no sea invasiva
      selectable: false,  // El usuario no puede moverlo
      evented: false,     // El usuario no puede interactuar con el
      opacity: 1
    });

    fabricCanvas.current.add(safetyFrame);
    // --------------------------------------------------

    const updateStore = () => {
      if (!fabricCanvas.current) return;
      
      // Antes de exportar la imagen para el 3D o el pedido,
      // ocultamos el marco rojo para que no salga impreso en la taza.
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

      <label className="cursor-pointer bg-blue-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95">
        SUBIR LOGO
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>
    </div>
  );
};

export default CanvasEditor;