// src/pages/LoginPage_page.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isRegister) {
        // Lógica de registro: Llamada al backend para crear usuario y enviar email
        console.log("Registrando usuario:", email);
        setMessage({ type: 'success', text: 'Registro iniciado. Revisá tu email para confirmar tu cuenta.' });
      } else {
        // Lógica de login: Obtención de JWT
        console.log("Iniciando sesión:", email);
        // Aquí iría: await authService.login(email, password);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocurrió un error. Verificá tus credenciales.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-slate-900/40 p-10 rounded-[32px] border border-slate-800 backdrop-blur-md shadow-2xl">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tighter text-white">
            {isRegister ? 'CREAR CUENTA' : 'ACCESO NIBAL.INK'}
          </h2>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
            {isRegister ? 'Unite al nodo de producción' : 'Identificación de Operador'}
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-mono border ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 ml-1 uppercase">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="admin@nibal.ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 ml-1 uppercase">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-sky-400 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'PROCESANDO...' : isRegister ? 'REGISTRARME' : 'ENTRAR AL SISTEMA'}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[10px] font-mono text-slate-500 hover:text-sky-400 transition-colors uppercase tracking-widest"
          >
            {isRegister ? '¿Ya tenés cuenta? Logueate' : '¿No tenés cuenta? Registrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
