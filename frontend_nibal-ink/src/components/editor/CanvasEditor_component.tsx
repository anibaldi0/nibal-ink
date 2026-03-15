// src/components/editor/CanvasEditor_component.tsx

import { designService } from '../../services/api_service';
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric'; 
import { useDesignStore } from '../../store/useDesignStore';

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const { designImage, setDesignImage } = useDesignStore(); // Traemos designImage para enviarlo

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 225,
      backgroundColor: '#ffffff',
    });

    const safetyFrame = new fabric.Rect({
      left: 50,
      top: 25,
      width: 400,
      height: 170,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 3,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      opacity: 1
    });

    fabricCanvas.current.add(safetyFrame);

    const updateStore = () => {
      if (!fabricCanvas.current) return;
      
      const objects = fabricCanvas.current.getObjects();
      const sFrame = objects.find(obj => obj.stroke === 'red'); 
      
      if (sFrame) sFrame.set('visible', false);
      fabricCanvas.current.renderAll();

      const croppedDataURL = fabricCanvas.current.toDataURL({
        format: 'webp',
        quality: 0.9,
        multiplier: 2,
        left: 50,
        top: 25,
        width: 400,
        height: 170,
      });

      if (sFrame) sFrame.set('visible', true);
      fabricCanvas.current.renderAll();

      setDesignImage(croppedDataURL);
    };

    fabricCanvas.current.on('object:modified', updateStore);
    fabricCanvas.current.on('object:added', updateStore);
    fabricCanvas.current.on('object:removed', updateStore);

    return () => {
      fabricCanvas.current?.dispose();
    };
  }, [setDesignImage]);

  // --- FUNCION PARA ENVIAR A LA BEELINK ---
  const handleConfirmarPedido = async () => {
    if (!designImage) {
      alert("No hay diseño para enviar");
      return;
    }
    try {
      const res = await designService.upload(designImage);
      alert(`Exito: ${res.message}`);
    } catch (err) {
      alert("Error al conectar con FastAPI en la Beelink");
    }
  };

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

      <div className="flex gap-4">
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95">
          SUBIR LOGO
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        {/* BOTON DE ENVIO REAL */}
        <button 
          onClick={handleConfirmarPedido}
          className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95"
        >
          CONFIRMAR PEDIDO
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;