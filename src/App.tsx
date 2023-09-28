import { Canvas } from "@react-three/fiber";
import shader from "./components/FoxShader";
const App = () => {
  return (
    <div>
      <Canvas>
        <mesh material={shader} />
      </Canvas>
    </div>
  );
};

export default App;
