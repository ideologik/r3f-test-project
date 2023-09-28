import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

export default function Hands() {
  const meshRef = useRef<Mesh | null>(null);
  const texture = new TextureLoader().load("/pov.png");

  // Actualiza la posición de las manos según el movimiento del mouse
  useFrame(({ mouse }) => {
    if (meshRef.current) {
      meshRef.current.position.x = mouse.x * 10; // Multiplicamos para amplificar el movimiento
      meshRef.current.position.y = mouse.y * 10;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]} scale={[1, 1, 1]}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
}
