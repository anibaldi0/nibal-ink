// frontend_nibal-ink/src/services/api_service.ts
import axios from 'axios';

const api = axios.create({
  // Limpiamos espacios o slashes accidentales del .env
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, ""), 
  headers: {
    'Content-Type': 'application/json',
  }
});

export const designService = {
  upload: async (imageBase64: string) => {
    try {
      const response = await api.post('/designs/upload', {
        image_data: imageBase64
      });
      return response.data;
    } catch (error) {
      console.error("Error en el upload:", error);
      throw error;
    }
  },

  // CORRECCIÓN: Agregamos parámetros opcionales para el scroll infinito
  getHistory: async (skip: number = 0, limit: number = 10): Promise<string[]> => {
    try {
      // Usamos params de axios para que la URL quede: /designs/list?skip=0&limit=10
      const response = await api.get('/designs/list', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo historial:", error);
      return [];
    }
  },
  
  getFileUrl: (fileId: string) => {
    return `${api.defaults.baseURL}/designs/file/${fileId}`;
  },

  deleteDesign: async (fileId: string) => {
    try {
      const response = await api.delete(`/designs/file/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar:", error);
      throw error;
    }
  }
};