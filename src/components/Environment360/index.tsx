import { TextureLoader, BackSide } from "three";
import { Sphere } from "@react-three/drei";

export default function Environment360() {
  const texture = new TextureLoader().load("/images/360/oficina360.jpg");

  return (
    <mesh>
      <Sphere args={[5, 25, 25]}>
        <meshBasicMaterial attach="material" map={texture} side={BackSide} />
      </Sphere>
    </mesh>
  );
}
