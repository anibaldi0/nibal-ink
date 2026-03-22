// frontend_nibal-ink/src/services/api_service.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, ""), 
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email); 
    formData.append('password', password);

    const response = await api.post('login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  
  register: async (email: string, password: string, fullName?: string) => {
      let finalName = fullName?.trim();
      if (!finalName) {
          const alias = email.split('@')[0];
          finalName = alias.length >= 3 ? alias : `Op-${alias}`;
      }
      
      // ENVIAMOS user_name PARA COINCIDIR CON EL BACKEND NORMALIZADO
      const response = await api.post('users/register', {
          email: email.trim(),
          password: password,
          user_name: finalName 
      });
      return response.data;
  }
};

export const designService = {
  upload: async (imageBase64: string) => {
    try {
      const response = await api.post('designs/upload', {
        image_data: imageBase64
      });
      return response.data;
    } catch (error: any) {
      // Capturamos el escudo de la Beelink (403) y lanzamos un error legible para el UX
      if (error.response?.status === 403) {
        throw new Error("DEBE_VERIFICAR_EMAIL");
      }
      throw error;
    }
  },
  getHistory: async (skip: number = 0, limit: number = 10): Promise<string[]> => {
    try {
      const response = await api.get('designs/list', {
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
      const response = await api.delete(`designs/file/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar:", error);
      throw error;
    }
  }
};