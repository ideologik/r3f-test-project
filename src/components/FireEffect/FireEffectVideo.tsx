import { forwardRef, useRef, useEffect, useState } from "react";
import {
  Mesh,
  VideoTexture,
  AdditiveBlending,
  Vector3,
  MeshBasicMaterial,
  DoubleSide,
  Euler,
} from "three";
import { useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";

type FireEffectVideoProps = {
  videoUrl: string;
  width: number;
  height: number;
  position: Vector3;
  rotation?: Euler;
  doubleSide?: boolean;
};

const FireEffectVideo = forwardRef<Mesh, FireEffectVideoProps>((props, ref) => {
  const { videoUrl, width, height, position, rotation, doubleSide } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (videoRef.current && userInteracted) {
      videoRef.current.play();
    }
  }, [userInteracted]);
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      // Eliminar el evento después de que ha sido disparado una vez
      window.removeEventListener("click", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);
  useEffect(() => {
    // Crear el elemento video
    const videoElem = document.createElement("video");
    videoElem.loop = true;
    videoElem.autoplay = true;
    videoElem.playsInline = true;
    videoElem.muted = true;
    videoElem.crossOrigin = "anonymous";
    videoElem.style.display = "none";

    const sourceElem = document.createElement("source");
    sourceElem.src = videoUrl;
    sourceElem.type = "video/mp4";

    videoElem.appendChild(sourceElem);

    document.body.appendChild(videoElem);

    // Set the videoRef to the created video element
    videoRef.current = videoElem;

    // Play the video
    videoElem.addEventListener("canplay", () => {
      videoElem.play();
    });
    videoElem.addEventListener("error", (e) => {
      console.error("Video error:", e);
    });

    videoElem.addEventListener("pause", () => {
      console.warn("Video was paused");
      videoElem.play();
    });

    videoElem.addEventListener("abort", () => {
      console.warn("Video playback was aborted");
    });

    return () => {
      // Clean up on component unmount
      document.body.removeChild(videoElem);
    };
  }, [videoUrl]);

  useFrame(() => {
    if (
      ref &&
      typeof ref !== "function" &&
      ref.current &&
      ref.current.material instanceof MeshBasicMaterial
    ) {
      (ref.current.material as MeshBasicMaterial).needsUpdate = true;
    }
  });

  return (
    <>
      <Plane
        ref={ref}
        args={[width, height]}
        position={position}
        rotation={rotation}
      >
        <meshBasicMaterial
          attach="material"
          //transparent
          blending={AdditiveBlending}
          side={doubleSide ? DoubleSide : undefined}
          map={
            videoRef.current ? new VideoTexture(videoRef.current) : undefined
          }
        />
      </Plane>
    </>
  );
});

export default FireEffectVideo;
