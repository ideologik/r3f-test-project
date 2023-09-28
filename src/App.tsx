import { Canvas } from "@react-three/fiber";
import FlameShader from "./components/FlameShader";
import FireballShader from "./components/FireballShader";

const App = () => {
  return (
    <div>
      <Canvas>
        <ambientLight intensity={0.5} />
        <FlameShader />
        <FireballShader />
      </Canvas>
    </div>
  );
};

export default App;
