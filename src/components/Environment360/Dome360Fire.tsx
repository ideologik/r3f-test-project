import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

interface Props {
  videos: string[];
  tiempoLimite: number;
}

export const Dome360Fire = ({ videos, tiempoLimite }: Props) => {
  const videoRefs = useRef(
    videos.map((src) => {
      const video = document.createElement("video");
      video.src = src;
      video.crossOrigin = "Anonymous";
      video.loop = true;
      return video;
    })
  );

  const videoTextures = videoRefs.current.map(
    (video) => new THREE.VideoTexture(video)
  );

  const [fireLevel, setFireLevel] = useState(0);
  const [videosReady, setVideosReady] = useState(false); // Nuevo estado para rastrear la carga de videos

  useEffect(() => {
    // Función para comprobar si todos los videos están listos
    const allVideosReady = () => {
      return videoRefs.current.every((video) => video.readyState >= 4);
    };

    if (allVideosReady()) {
      setVideosReady(true);
    } else {
      const handleCanPlay = () => {
        if (allVideosReady()) {
          setVideosReady(true);
        }
      };
      videoRefs.current.forEach((video) => {
        video.addEventListener("canplay", handleCanPlay);
      });
      return () => {
        videoRefs.current.forEach((video) => {
          video.removeEventListener("canplay", handleCanPlay);
        });
      };
    }
  }, []);

  useEffect(() => {
    const increaseFire = () => {
      setFireLevel((prev) => Math.min(prev + 1, 4));
    };
    const fireInterval = setInterval(increaseFire, tiempoLimite);
    return () => {
      clearInterval(fireInterval);
    };
  }, [tiempoLimite]);

  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      // Prevenir comportamiento predeterminado para clic derecho
      if (e.button === 2) {
        e.preventDefault();
        setFireLevel((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("contextmenu", handleMouseClick); // Solo detectar clic derecho

    return () => {
      window.removeEventListener("contextmenu", handleMouseClick);
    };
  }, [fireLevel]);

  useFrame(() => {
    if (videosReady && videoTextures[fireLevel].image.readyState === 4) {
      videoTextures[fireLevel].image.play();
    }
  });

  return (
    videosReady && ( // Renderizar solo cuando los videos estén listos
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 100, 40]} />
        <meshBasicMaterial
          attach="material"
          map={videoTextures[fireLevel]}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    )
  );
};
