import { TextureLoader, BackSide } from "three";
import { Sphere } from "@react-three/drei";

export default function Environment360() {
  const texture = new TextureLoader().load("/oficina360.jpg");

  return (
    <mesh>
      <Sphere>
        <meshBasicMaterial attach="material" map={texture} side={BackSide} />
      </Sphere>
    </mesh>
  );
}
