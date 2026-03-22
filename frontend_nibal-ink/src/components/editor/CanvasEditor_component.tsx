// src/components/editor/CanvasEditor_component.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric'; 
import { useDesignStore } from '../../store/useDesignStore';

const CanvasEditor = forwardRef((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const { setDesignImage } = useDesignStore();

  // Función interna de limpieza
  const internalClear = () => {
    if (!fabricCanvas.current) return;
    const objects = fabricCanvas.current.getObjects();
    objects.forEach((obj) => {
      // Borramos todo EXCEPTO el marco de seguridad rojo
      if (obj.stroke !== 'red') {
        fabricCanvas.current?.remove(obj);
      }
    });
    fabricCanvas.current.renderAll();
    
    // Actualizamos el store para que la taza 3D también se limpie
    const dataURL = fabricCanvas.current.toDataURL({
      format: 'webp',
      quality: 0.1, // Baja calidad para el reset
      multiplier: 1,
    });
    setDesignImage(dataURL);
  };

  // EXPOSICIÓN DE COMANDOS AL PADRE
  useImperativeHandle(ref, () => ({
    // 1. Verificar si hay diseño real
    hasContent: () => {
      if (!fabricCanvas.current) return false;
      return fabricCanvas.current.getObjects().filter(obj => obj.stroke !== 'red').length > 0;
    },
    // 2. Limpiar el canvas desde afuera (Editor_page)
    clear: () => {
      internalClear();
    },
    // 3. Generar el WebP para la Beelink
    getRecorteParaProduccion: () => {
      if (!fabricCanvas.current) return null;
      const objects = fabricCanvas.current.getObjects();
      const safetyFrame = objects.find(obj => obj.stroke === 'red');
      
      if (safetyFrame) safetyFrame.set('visible', false);
      fabricCanvas.current.renderAll();

      const croppedData = fabricCanvas.current.toDataURL({
        format: 'webp',
        quality: 1,
        multiplier: 4,
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

    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 225,
      backgroundColor: '#ffffff',
    });

    const safetyFrame = new fabric.Rect({
      left: 50, top: 25, width: 400, height: 170,
      fill: 'transparent', stroke: 'red', strokeWidth: 3,
      strokeDashArray: [5, 5], selectable: false, evented: false, opacity: 1
    });

    fabricCanvas.current.add(safetyFrame);

    const updateStore = () => {
      if (!fabricCanvas.current) return;
      safetyFrame.set('visible', false);
      fabricCanvas.current.renderAll();
      const dataURL = fabricCanvas.current.toDataURL({
        format: 'webp', quality: 0.8, multiplier: 1,
      });
      safetyFrame.set('visible', true);
      fabricCanvas.current.renderAll();
      setDesignImage(dataURL);
    };

    fabricCanvas.current.on('object:modified', updateStore);
    fabricCanvas.current.on('object:added', updateStore);
    fabricCanvas.current.on('object:removed', updateStore);

    return () => { fabricCanvas.current?.dispose(); };
  }, [setDesignImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(150);
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
      <div className="border-4 border-slate-800 rounded-lg bg-white overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex gap-4">
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all uppercase text-xs tracking-widest">
          Subir Logo
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
        <button onClick={internalClear} className="bg-slate-700 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all uppercase text-xs tracking-widest">
          Limpiar
        </button>
      </div>
    </div>
  );
});

export default CanvasEditor;