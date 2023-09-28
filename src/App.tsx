import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import FlameShader from "./components/FlameShader";
import FireballShader from "./components/FireballShader";
import ExtintorShader from "./components/ExtintorShader";

const App = () => {
  return (
    <div>
      <Canvas camera={{ position: [0, 0, 50] }} style={{ background: "gray" }}>
        <ambientLight intensity={0.5} />
        {/* <FlameShader />
        <FireballShader /> */}
        <ExtintorShader />
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
};

export default App;
