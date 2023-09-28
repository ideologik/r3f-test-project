import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import Environment360 from "./Environment360";
import { OrbitControls } from "@react-three/drei";
import { Vector3, Raycaster, Vector2, Mesh } from "three";
import "./Scene360.css";
import { forwardRef, useEffect, useRef, useState } from "react";
import React from "react";
import RaycasterVisualHelper from "./RaycasterHelper";

// Extend will make OrbitControls available as a JSX element called orbitControls for use in the react-three-fiber scene below.
extend({ OrbitControls });

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

type FireEffectProps = {
  position: Vector3;
};

const FireEffect = forwardRef<Mesh, FireEffectProps>((props, ref) => {
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

type RaycasterHandlerProps = {
  fireMeshRefs: React.RefObject<Mesh>[];
  raycaster: Raycaster;
};

const RaycasterHandler: React.FC<RaycasterHandlerProps> = ({
  fireMeshRefs,
  raycaster,
}) => {
  console.log("rendering raycaster handler");
  const { camera, gl } = useThree();
  const [fireHit, setFireHit] = useState<number | null>(null);

  const handleMouseClick = (event: MouseEvent) => {
    console.log(fireHit);
    if (event.button === 2 && fireHit !== null) {
      const fireMesh = fireMeshRefs[fireHit].current;
      if (fireMesh) {
        fireMesh.visible = false;
      }
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener("mousedown", handleMouseClick);
    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseClick);
    };
  }, [gl, fireHit]);

  useFrame(() => {
    let hitDetected: number | null = null;

    raycaster.setFromCamera(new Vector2(0, 0), camera);
    fireMeshRefs.forEach((ref, index) => {
      const fireMesh = ref.current;
      if (fireMesh) {
        const intersects = raycaster.intersectObject(fireMesh);
        if (intersects.length > 0) {
          hitDetected = index;
        }
      }
    });

    setFireHit(hitDetected);
  });

  return null;
};

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
