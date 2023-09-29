import { forwardRef } from "react";
import { Mesh, Vector3 } from "three";

type FireEffectProps = {
  position: Vector3;
};

const FireEffectMesh = forwardRef<Mesh, FireEffectProps>((props, ref) => {
  console.log("rendering fire effect");
  const position = props.position;
  // Este componente representaría tu efecto de fuego y humo.
  // Deberías integrar el shader aquí.

  // Para este ejemplo, vamos a usar un simple mesh como marcador.
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
});

export default FireEffectMesh;
