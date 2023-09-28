import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Plane, useTexture } from "@react-three/drei";
import { Mesh } from "three";

export default function HandsHUD() {
  const { camera } = useThree(); // Accedemos a la cámara principal
  const handsTexture = useTexture("/pov.png");
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    if (ref.current && camera) {
      camera.add(ref.current); // Agregamos el plano como hijo de la cámara
    }
    return () => {
      if (ref.current && camera) {
        camera.remove(ref.current); // Nos aseguramos de limpiar en unhook
      }
    };
  }, [camera]);

  // No es necesario actualizar la rotación ya que el plano ahora es hijo de la cámara

  return (
    <Plane args={[1, 1]} position={[0, 0, -0.3]} ref={ref}>
      <meshBasicMaterial map={handsTexture} transparent={true} />
    </Plane>
  );
}
