import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import { Raycaster, Mesh, Vector3 } from "three";
import Controls from "../Controls";
import Environment360 from "../Environment360";
import FireEffect from "../FireEffect";
import RaycasterHandler from "../RaycasterHandler";
import RaycasterVisualHelper from "../RaycasterVisualHelper";
import "./Scene360.css";

export default function Scene360() {
  console.log("rendering");
  const raycaster = useRef(new Raycaster()); // Define raycaster aquí

  const numberOfFires = 5;
  const fireMeshRefs = useRef<React.RefObject<Mesh>[]>(
    Array(numberOfFires)
      .fill(null)
      .map(() => React.createRef<Mesh>())
  );

  const generateRandomPosition = () => {
    const randomPosition = new Vector3(
      Math.random() * 1 - 0.2,
      Math.random() * 0.6 - 0.3,
      Math.random() * 1.3 - 0.5
    );
    console.log(randomPosition);
    return randomPosition;
  };

  return (
    <div className="container">
      <Canvas camera={{ position: [0, 0, 0.1], near: 0.1, far: 1000 }}>
        <ambientLight />
        <Environment360 />
        {Array.from({ length: numberOfFires }).map((_, index) => (
          <FireEffect
            ref={fireMeshRefs.current[index]}
            position={generateRandomPosition()}
            key={index}
          />
        ))}
        <Controls />
        <RaycasterHandler
          fireMeshRefs={fireMeshRefs.current}
          raycaster={raycaster.current}
        />
        <RaycasterVisualHelper raycaster={raycaster.current} />
        {/* Pasa raycaster aquí */}
      </Canvas>
      <img
        src="/pov.png"
        alt="Hands"
        className="handsOverlay"
        draggable="false"
      />
    </div>
  );
}
