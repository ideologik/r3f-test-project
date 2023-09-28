import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial } from "three";
import * as THREE from "three";
import { Vector2 } from "three";

const FlameShader = () => {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { size } = useThree();

  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `

  precision highp float;
  
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  
  #define fragColor gl_FragColor
  
  mat2 rotate2D(float r) {
      return mat2(cos(r), sin(r), -sin(r), cos(r));
  }
  
  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
      vec3 col = vec3(0);
      float t = iTime * 0.00001;

      // Agregando la variación basada en la posición del mouse
      float angle = iMouse.x * 3.14; 
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 uvRotated = uv * rot;
      
      vec2 n = vec2(0);
      vec2 q = vec2(0.0);
      vec2 p = uvRotated;
      float d = dot(p, p);
      float S = 12.0;
      float a = 0.0;
      mat2 m = rotate2D(5.);
      
      for (float j = 0.; j < 20.0; j++) {
          p *= m;
          n *= m;
          q = p * S + t * 5. + sin(t * 60. - d * 4.) * 1. + j + n;
          a += dot(cos(q) / S, vec2(0.2));
          n -= sin(q + iTime);
          S *= 1.2;
      }


  
      col = vec3(4, 2, 1) * (a + 0.2) + a + a - d;
      fragColor = vec4(col, 1.0);
  }
  
  
  `;
  const fragmentShader3d = `

  precision highp float;
  
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  
  #define fragColor gl_FragColor
  
  mat2 rotate2D(float r) {
      return mat2(cos(r), sin(r), -sin(r), cos(r));
  }
  
  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

      vec3 ro = vec3(0, 0, 0); 
      vec3 rd = normalize(vec3(uv, 1.0)); 

      vec3 col = vec3(0);
      float t = iTime * 0.00001;

      float angle = iMouse.x * 3.14; 
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 uvRotated = uv * rot;
      
      vec2 n = vec2(0);
      vec2 q = vec2(0.0);
      vec2 p = uvRotated * rd.xy;  // Aquí usamos la dirección del rayo en el cálculo.
      float d = dot(p, p);
      float S = 12.0;
      float a = 0.0;
      mat2 m = rotate2D(5.);
      
      for (float j = 0.; j < 20.0; j++) {
          p *= m;
          n *= m;
          q = p * S + t * 5. + sin(t * 60. - d * 4.) * 1. + j + n;
          a += dot(cos(q) / S, vec2(0.2));
          n -= sin(q + iTime);
          S *= 1.2;
      }

      col = vec3(4, 2, 1) * (a + 0.2) + a + a - d;
      fragColor = vec4(col, 1.0);
  }
  
  `;

  const mouseRef = useRef(new Vector2(0.5, 0.5));

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.iResolution.value.set(
        size.width,
        size.height,
        1
      );
      materialRef.current.uniforms.iMouse.value = mouseRef.current;
    }
  });

  return (
    <mesh position={[-35, 0, -40]}>
      <sphereGeometry args={[10, 32, 32]} />
      <shaderMaterial
        attach="material"
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          iTime: { value: 0 },
          iResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
        transparent={true}
      />
    </mesh>
  );
};

export default FlameShader;
