import { forwardRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Vector3,
  TextureLoader,
  PointsMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  Color,
  Points,
  AdditiveBlending,
} from "three";

type FireEffectProps = {
  position: Vector3;
};

const FireEffectPoints = forwardRef<Points, FireEffectProps>((props, ref) => {
  const { position } = props;
  const pointRef = ref as React.MutableRefObject<Points>;

  const texture = useMemo(
    () => new TextureLoader().load("/images/shaders/channel0.png"),
    []
  );

  const particleMaterial = new PointsMaterial({
    color: new Color("#ff9800"),
    size: 0.05,
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const [particleGeometry] = useState(() => {
    const geo = new BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 0.1;
      const y = Math.random() * 0.1;
      const z = (Math.random() - 0.5) * 0.1;

      vertices.push(x, y, z);
    }

    geo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    return geo;
  });

  useFrame((state) => {
    if (pointRef.current) {
      const positions = pointRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 1; i < positions.length; i += 3) {
        // Ajustar la posición y de cada partícula
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.0008;
      }

      pointRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points
      ref={ref}
      position={position}
      geometry={particleGeometry}
      material={particleMaterial}
    />
  );
});

export default FireEffectPoints;
