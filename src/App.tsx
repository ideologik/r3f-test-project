import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import FlameShader from "./components/FlameShader";
import FireballShader from "./components/FireballShader";

const App = () => {
  return (
    <div>
      <Canvas>
        <ambientLight intensity={0.5} />
        <FlameShader />
        <FireballShader />
        <Stats />
      </Canvas>
    </div>
  );
};

export default App;
