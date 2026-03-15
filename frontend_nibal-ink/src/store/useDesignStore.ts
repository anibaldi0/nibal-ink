// src/store/useDesignStore.ts
import { create } from 'zustand';

interface DesignState {
  // La imagen del diseño en formato base64 (DataURL)
  designImage: string | null;
  // Función para actualizar la imagen desde el Canvas
  setDesignImage: (image: string | null) => void;
  // Estado para controlar si estamos enviando el pedido al backend
  isProcessing: boolean;
  setIsProcessing: (status: boolean) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  designImage: null,
  
  setDesignImage: (image) => {
    // Aquí podrías agregar lógica ninja de validación si quisieras
    set({ designImage: image });
  },

  isProcessing: false,
  
  setIsProcessing: (status) => {
    set({ isProcessing: status });
  },
}));