import { useEffect, useRef, useState } from "react";
import { Texture, TextureLoader, AdditiveBlending, BackSide } from "three";
import { Sphere } from "@react-three/drei"

interface Props {
  lowResImg?: string;
  highResImg: string;
  blendingOn?: boolean;
}

export default function Environment360({
  lowResImg,
  highResImg,
  blendingOn = false,
}: Props) {
  const textureRef = useRef<Texture | null>(null);
  const [, forceUpdate] = useState({}); // Este estado es solo para forzar la actualización

  useEffect(() => {
    if (lowResImg) {
      new TextureLoader().load(lowResImg, (lowResTexture) => {
        console.log("lowResTexture");
        textureRef.current = lowResTexture;
        forceUpdate({}); // Forzar re-render

        new TextureLoader().load(highResImg, (highResTexture) => {
          console.log("highResTexture");
          textureRef.current = highResTexture;
          forceUpdate({}); // Forzar re-render
        });
      });
    } else {
      new TextureLoader().load(highResImg, (highResTexture) => {
        textureRef.current = highResTexture;
        forceUpdate({}); // Forzar re-render
      });
    }
  }, [lowResImg, highResImg]);

  if (!textureRef.current) {
    return null; // No renderices nada hasta que la textura esté disponible
  }

  return (
    <mesh scale={[-1, 1, 1]}>
      <Sphere args={[0.9, 25, 25]}>
        <meshBasicMaterial
          blending={blendingOn ? AdditiveBlending : undefined}
          attach="material"
          map={textureRef.current}
          side={BackSide}
          
        />
      </Sphere>
    </mesh>
  );
}
