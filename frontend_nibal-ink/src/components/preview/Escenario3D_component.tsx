// src/components/preview/Escenario3D_component.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';
import TazaMesh from './Taza3D_component';

const Escenario3D = () => {
  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800">
      <Canvas shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={50} />
        
        {/* Luces basicas */}
        <ambientLight intensity={0.7} /> 
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        {/* VENTAJA DE ENVIRONMENT: 
          Esto genera reflejos realistas en el material 'sideMaterial' de tu taza.
          preset="apartment" o "studio" dan reflejos blancos muy limpios que hacen
          que la taza parezca de ceramica real.
        */}
        <Environment preset="forest" blur={0.8} />

        <Stage adjustCamera={false} intensity={0.6}>
          <TazaMesh />
        </Stage>
        
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={10} 
          makeDefault 
        />
      </Canvas>
    </div>
  );
};

export default Escenario3D;