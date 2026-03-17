// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header_component';
import Footer from './components/layout/Footer_component';
import LandingPage from './pages/LandingPage_page';
import AdminDashboard from './pages/AdminDashboard_page';
import LoginPage from './pages/LoginPage_page';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col selection:bg-sky-500/30">
        
        {/* Glow de Fondo (Global) */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-900/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
        </div>

        <Header />

        {/* El contenido principal ocupa el espacio restante */}
        <div className="flex-grow container mx-auto p-4 lg:p-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;