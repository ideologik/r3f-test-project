import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Extend will make OrbitControls available as a JSX element called orbitControls for use in the react-three-fiber scene below.
//extend({ OrbitControls });

const Controls = () => {
  const { camera, gl } = useThree();
  return (
    <OrbitControls
      args={[camera, gl.domElement]}
      enableZoom={false}
      enablePan={false}
    />
  );
};

export default Controls;
