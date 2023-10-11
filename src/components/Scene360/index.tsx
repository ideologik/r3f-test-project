import { Canvas } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Raycaster, Vector3, Mesh, Euler } from "three";
import Controls from "../Controls";
import Environment360 from "../Environment360";
import RaycasterHandler from "../RaycasterHandler";
import "./Scene360.css";
import FireEffectVideo from "../FireEffect/FireEffectVideo";
import { Dome360Fire } from "../Environment360/Dome360Fire";

export default function Scene360() {

  const [hasStarted, setHasStarted] = useState(false);
  const raycaster = useRef(new Raycaster()); // Define raycaster aquí

  const numberOfFires = 2;
  const positions = [new Vector3(2, -0.3, -2.9), new Vector3(-2, -0.3, 3.1)];
  const rotations = [new Euler(0, 0, 0), new Euler(0, Math.PI, 0)];

  const fireMeshRefs = useRef<React.RefObject<Mesh>[]>(
    Array(numberOfFires)
      .fill(null)
      .map(() => React.createRef<Mesh>())
  );

  // const generateRandomPosition = () => {
  //   const randomPosition = new Vector3(
  //     Math.random() * 1 - 0.2,
  //     Math.random() * 0.6 - 0.3,
  //     Math.random() * 1.3 - 0.5
  //   );
  //   console.log(randomPosition);
  //   return randomPosition;
  // };

  return (
    <>
      {!hasStarted && (
        <div className="startButtonContainer">
          <button onClick={() => setHasStarted(true)} className="startButton">
            Comenzar
          </button>
        </div>
      )}

      <div className="container">
        <Canvas camera={{ position: [0, 0, 0.1], near: 0.1, far: 1000 }}>
          <ambientLight />
          <Dome360Fire
            videos={[
              "https://smartraining-streaming.s3.sa-east-1.amazonaws.com/test/test/v2_Oficina_360_04_IncendioNivel1_FuegoSolo.mp4",
              "https://smartraining-streaming.s3.sa-east-1.amazonaws.com/test/test/v2_Oficina_360_04_IncendioNivel2_FuegoSolo.mp4",
              "https://smartraining-streaming.s3.sa-east-1.amazonaws.com/test/test/v2_Oficina_360_04_IncendioNivel3_FuegoSolo.mp4",
              "https://smartraining-streaming.s3.sa-east-1.amazonaws.com/test/test/v1_Oficina_360_04_IncendioNivel3_FuegoSolo.mp4",
              "https://smartraining-streaming.s3.sa-east-1.amazonaws.com/test/test/v1_Oficina_360_04_IncendioNivel3_FuegoSolo.mp4"
            ]}
            tiempoLimite={10000}
          />
          <Environment360
            highResImg="/images/360/Oficina_360_04_IncendioNivel0.jpeg"
            lowResImg="/images/360/Oficina_360_01_Entrada_lr.jpeg"
          />

          {/* 
          <Environment360
            highResImg="/images/360/Oficina_360_01_EntradaGlow.jpeg"
            blendingOn={true}
          />
          {true &&
            Array.from({ length: numberOfFires }).map((_, index) => (
              <FireEffectVideo
                key={index}
                position={positions[index]}
                rotation={rotations[index]}
                ref={fireMeshRefs.current[index]}
                videoUrl="/video/fuego2.webm"
                width={18 / 9}
                height={18 / 16}
              />
            ))}
            <RaycasterHandler
            fireObject3DRefs={fireMeshRefs.current}
            raycaster={raycaster.current}
          /> */}
          <Controls />
        </Canvas>
        <img
          src="/images/pov.png"
          alt="Hands"
          className="handsOverlay"
          draggable="false"
        />
      </div>
    </>
  );
}
