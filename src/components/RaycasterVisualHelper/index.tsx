import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Raycaster, Vector3, ArrowHelper } from "three";

type RaycasterVisualHelperProps = {
  raycaster: Raycaster;
};

const RaycasterVisualHelper: React.FC<RaycasterVisualHelperProps> = ({
  raycaster,
}) => {
  const { scene } = useThree();
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);

  useEffect(() => {
    const dir = new Vector3().copy(raycaster.ray.direction).multiplyScalar(5); // Ajusta el 5 para controlar la longitud del helper
    const arrow = new ArrowHelper(
      raycaster.ray.direction,
      raycaster.ray.origin,
      dir.length()
    );
    arrowRef.current = arrow;
    scene.add(arrowRef.current);

    return () => {
      if (arrowRef.current) {
        scene.remove(arrowRef.current);
      }
    };
  }, [raycaster, scene]);

  useFrame(() => {
    if (arrowRef.current) {
      arrowRef.current.setDirection(raycaster.ray.direction);
      arrowRef.current.position.copy(raycaster.ray.origin);
    }
  });

  return null;
};

export default RaycasterVisualHelper;
