import { useThree, useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { Raycaster, Mesh, Vector2 } from "three";

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

export default RaycasterHandler;
