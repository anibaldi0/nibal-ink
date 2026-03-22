// src/pages/LoginPage_page.tsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, UserCircle } from 'lucide-react'; 
import { useAuthStore } from '../store/useAuthStore'; 
import { authService } from '../services/api_service'; 

const InputField = ({ label, type, value, onChange, placeholder, icon: Icon, showPasswordToggle, onTogglePassword, isRegister, required = true }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold font-mono text-slate-200 ml-1 uppercase flex items-center gap-2">
      {Icon && <Icon size={12} className={isRegister ? "text-emerald-500" : "text-sky-500"} />}
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-slate-950 border-2 rounded-xl px-4 py-4 text-white text-base focus:outline-none transition-all placeholder:text-slate-600 ${
          isRegister ? "border-emerald-900/30 focus:border-emerald-500" : "border-slate-800 focus:border-sky-500"
        }`}
        placeholder={placeholder}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
            isRegister ? "text-emerald-700 hover:text-emerald-400" : "text-slate-500 hover:text-sky-400"
          }`}
        >
          {type === "password" ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setLogin } = useAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isRegister) {
        await authService.register(email, password, fullName);
        setMessage({ 
          type: 'success', 
          text: 'Registro exitoso. Revisa tu email para activar tu cuenta antes de imprimir.' 
        });
      } else {
        const data = await authService.login(email, password);
        setLogin(data.access_token, email); 
        
        // --- LÓGICA DE REDIRECCIÓN NINJA ---
        // Buscamos si existe el parámetro 'redirect' (ej: /login?redirect=editor)
        const redirectTo = searchParams.get('redirect');
        
        if (redirectTo === 'editor') {
          navigate('/editor');
        } else if (redirectTo === 'admin') {
          navigate('/admin');
        } else {
          navigate('/'); // Default al Home
        }
      }
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || "Error de conexión con el nodo Beelink.";
      setMessage({ type: 'error', text: `ERROR: ${errorDetail}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className={`w-full max-w-md space-y-8 p-10 rounded-[32px] border-2 backdrop-blur-2xl shadow-2xl transition-all duration-500 ${
        isRegister 
          ? "bg-emerald-950/20 border-emerald-500/30 shadow-emerald-500/10" 
          : "bg-slate-900/90 border-slate-700 shadow-sky-500/10"
      }`}>
        
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className={`p-3 bg-slate-950 rounded-2xl border shadow-inner transition-colors duration-500 ${
              isRegister ? "border-emerald-800" : "border-slate-800"
            }`}>
              {isRegister 
                ? <UserPlus className="text-emerald-400 animate-pulse" size={32} /> 
                : <LogIn className="text-sky-400" size={32} />
              }
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase">
              {isRegister ? 'Crear Nodo' : 'Acceso'}
            </h2>
            <p className={`text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors ${
              isRegister ? "text-emerald-400" : "text-sky-400"
            }`}>
              {isRegister ? 'Registro de nuevo operador' : 'Identificación requerida'}
            </p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-mono border-2 animate-in fade-in zoom-in duration-300 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            <span className="font-bold">[{message.type.toUpperCase()}]:</span> {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {isRegister && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <InputField
                  label="Nombre o Nick (Opcional)"
                  type="text"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Tu alias en el sistema"
                  icon={UserCircle}
                  isRegister={isRegister}
                  required={false}
                />
              </div>
            )}

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="operador@nibal.ink"
              icon={Mail}
              isRegister={isRegister}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon={Lock}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
              isRegister={isRegister}
            />
          </div>

          <button
            disabled={isLoading}
            className={`w-full py-5 text-white font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl uppercase tracking-widest text-sm ${
              isRegister 
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20" 
                : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-900/20"
            }`}
          >
            {isLoading ? 'Sincronizando...' : isRegister ? 'Confirmar Registro' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage(null);
            }}
            className={`text-[11px] font-bold font-mono transition-colors uppercase tracking-widest underline-offset-8 hover:underline ${
              isRegister ? "text-emerald-500 hover:text-emerald-300" : "text-slate-400 hover:text-white"
            }`}
          >
            {isRegister ? '¿Ya sos operador? Logueate' : '¿No tenés cuenta? Solicitá acceso'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;