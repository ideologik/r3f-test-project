import { Canvas } from "@react-three/fiber";
import Bottle from "./Bottle";
import { OrbitControls, Environment } from "@react-three/drei";

export default function Scene() {
  return (
    <div className={"container-3d"}>
      <Canvas camera={{ fov: 35, position: [0, 2, 10] }}>
        <ambientLight intensity={0.8} color={0xffffff} />
        <Bottle />
        <OrbitControls
          target={[0, 2, 0]}
          enableZoom={false}
          enableRotate={false}
        />
        <Environment files={"/snowy_park_01_1k.hdr"} blur={0.5} />
      </Canvas>
    </div>
  );
}
