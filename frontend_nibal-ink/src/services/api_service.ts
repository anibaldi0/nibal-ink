// frontend_nibal-ink/src/services/api_service.ts
import axios from 'axios';

// Usamos la IP de la Beelink o localhost si estas programando adentro de ella
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  }
});

export const designService = {
  upload: async (imageBase64: string) => {
    try {
      // Pegamos al endpoint que creamos en el backend
      const response = await api.post('/designs/upload', {
        image_data: imageBase64
      });
      return response.data;
    } catch (error) {
      console.error("Error en el upload:", error);
      throw error;
    }
  }
};