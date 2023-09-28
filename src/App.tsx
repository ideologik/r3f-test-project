import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import FlameShader from "./components/FlameShader";
import FireballShader from "./components/FireballShader";
import ExtintorShader from "./components/ExtintorShader";
import Scene360 from "./components/Scene360";

const App = () => {
  return (
    <>
      <Scene360 />
    </>
  );
};

export default App;
