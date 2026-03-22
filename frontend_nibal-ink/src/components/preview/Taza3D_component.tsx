 // src/components/preview/Taza3D_component.tsx

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDesignStore } from '../../store/useDesignStore';


const TazaMesh = () => {
const meshRef = useRef<THREE.Mesh>(null);
const { designImage } = useDesignStore();

// Material para el cuerpo (lateral) de la taza
const sideMaterial = useMemo(() => new THREE.MeshStandardMaterial({
color: 'white',
roughness: 0.1,
metalness: 0.1,
}), []);


// Material para las tapas (siempre blanco)
const topBottomMaterial = useMemo(() => new THREE.MeshStandardMaterial({
color: 'white',
}), []);


useFrame(() => {
if (meshRef.current) meshRef.current.rotation.y += 0.002;
});


useEffect(() => {
if (!designImage) return;


const loader = new THREE.TextureLoader();
loader.load(designImage, (texture) => {

// Correccion de color para que no se vea apagado
texture.colorSpace = THREE.SRGBColorSpace;


// 1. Evitamos que la imagen se repita en los bordes
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;


// 2. MATEMATICA DE MARGENES:
// Queremos que el 100% de tu canvas (200x90mm virtuales)
// ocupe el espacio proporcional dentro de la taza real (220x100mm).
// Escala: Area Imprimible / Area Total
texture.repeat.set(0.909, 0.9);


// Offset: Margen / Area Total (para centrar)
// Horizontal: 10mm de margen / 220mm total = 0.0454
// Vertical: 5mm de margen / 100mm total = 0.05
texture.offset.set(0.0454, 0.05);


sideMaterial.map = texture;
sideMaterial.needsUpdate = true;
});
}, [designImage, sideMaterial]);

return (
<mesh
ref={meshRef}

// El cilindro de Three.js usa: [lado, tapa_superior, tapa_inferior]
material={[sideMaterial, topBottomMaterial, topBottomMaterial]}

>

{/* Geometria: radioTop, radioBottom, altura, segmentos */}
{/* Mantenemos la proporcion 2.2 de altura para que coincida con los 100mm */}
<cylinderGeometry args={[1, 1, 2.2, 64]} />
</mesh>
);
};


export default TazaMesh;