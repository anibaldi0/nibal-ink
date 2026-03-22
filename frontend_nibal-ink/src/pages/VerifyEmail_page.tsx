// src/pages/VerifyEmail_page.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu credencial en el nodo...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('No se encontró un token de seguridad.');
        return;
      }

      try {
        // LLAMADA REAL A LA BEELINK
        const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
        const response = await axios.get(`${apiUrl}/users/verify-email`, {
          params: { token }
        });

        if (response.data.status === 'success') {
          setStatus('success');
          setMessage(response.data.message);
          // Redirigir al login después de 3 segundos
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Error al validar el link.');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className={`p-10 rounded-3xl border-2 text-center space-y-4 max-w-md ${
        status === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
        status === 'error' ? 'bg-red-500/10 border-red-500 text-red-400' :
        'bg-sky-500/10 border-sky-500 text-sky-400'
      }`}>
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          {status === 'loading' ? 'Sincronizando...' : status === 'success' ? 'Nodo Verificado' : 'Fallo de Enlace'}
        </h2>
        <p className="font-mono text-sm">{message}</p>
        {status === 'success' && <p className="text-[10px] animate-pulse">Redirigiendo al Portal...</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
