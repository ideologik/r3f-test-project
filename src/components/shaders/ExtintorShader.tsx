import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { ShaderMaterial, TextureLoader, Vector2 } from "three";

const ExtintorShader = () => {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const meshRef = useRef<any | null>(null);

  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `

        uniform vec2 iResolution;
        uniform float iTime;
        uniform sampler2D iChannel0;
        uniform sampler2D iChannel1;
        
        #define PI 3.14159265358979323844
        
        mat2 GetRotationMatrix(float angle)
        {
            mat2 m;
            m[0][0] = cos(angle); m[0][1] = -sin(angle);
            m[1][0] = sin(angle); m[1][1] = cos(angle);
        
            return m;
        }
        
        float GetTexture(vec2 uv)
        {
            float n = texture2D(iChannel0, uv).r;
            // Additional sampling can be uncommented here
            return n;
        }
        
        float GetNoise(vec2 uv)
        {
            return texture2D(iChannel1, uv).r;
        }
        
        void main()
        {
            vec2 fragCoord = gl_FragCoord.xy;
            vec2 uv = fragCoord.xy / iResolution.xy;
            uv -= vec2(0.5);
            uv.y /= (iResolution.x / iResolution.y);
            
            float paramTime = iTime;
                
            ////////////////////////////////////////

            #define SpraySpeed 0.03
            float sprayTime = paramTime * SpraySpeed;

            
            
            //
            // Rotate based on noise sampled via polar coordinates of uv
            //
            
            // (r, a) (r=[0.0, 1.0], a=[0.0, 1.0 CCW from W])
            vec2 angleNoiseRa = vec2(
                length(uv) / sqrt(0.5), 
                (atan(uv.y, uv.x) / (2.0 * PI) + 0.5));
            
            #define AngleNoiseResolution 0.1
            float angle = GetNoise(
                angleNoiseRa * vec2(AngleNoiseResolution, AngleNoiseResolution) 
                + vec2(-0.5*sprayTime, 0.2*sprayTime));
                
            // Magnify rotation amount based on distance from center of screen
            angle *= 1.54 * smoothstep(0.0, 0.6, angleNoiseRa.x);
            
            // Rotate!
            uv += GetRotationMatrix(angle) * uv;
            
            
            
            //
            // Transform to polar coordinates
            //
            
            // (r, a) (r=[0.0, 1.0], a=[0.0, 1.0 CCW from W])
                
            vec2 ra = vec2(
                length(uv) / sqrt(0.5), 
                (atan(uv.y, uv.x) / (2.0 * PI) + 0.5));
                
            // Scale radius to better fit in quad
            ra.x *= 1.7;                   

            
            //
            // Randomize radius based on noise and radius
            //
            
            #define VariationRNoiseResolution 0.2
            float variationR = GetNoise(
                ra * vec2(VariationRNoiseResolution / 4.0, VariationRNoiseResolution / 1.0) 
                + vec2(-sprayTime, 0.0));
            
            variationR -= 0.5;

            // Straighten the spray at the center and make full turbulence outside,
            // scaling it at the same time
            variationR *= 0.35 * smoothstep(-0.40, 0.4, ra.x);
            
            // Randomize!
            vec2 ra2 = vec2(ra.x + variationR, ra.y);
        
            
            //
            // Render
            //
            
            // Focus (compress dynamics)
            float alpha = 1.0 - smoothstep(0.2, 1.4, ra2.x);
            
            // Apply texture
            #define TextureResolution 0.4
            float mappedR = pow(ra.x, 1.46);  
            alpha *= GetTexture(vec2(mappedR, ra.y) * vec2(TextureResolution / 1.0, TextureResolution * 3.0) + vec2(-sprayTime * 7.1, 0.0));
            
            gl_FragColor = vec4(vec3(alpha).xyz, 1.0);
        }

  
  `;

  useFrame(({ clock, mouse }) => {
    // const time = clock.getElapsedTime();
    // meshRef.current.rotation.y = time / 2;

    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = clock.getElapsedTime();

      // Aquí puedes ajustar cómo se mueve el extintor con el mouse.
      // Por simplicidad, estamos usando la posición del mouse directamente.
      materialRef.current.uniforms.iMouse.value = new Vector2(mouse.x, mouse.y);
    }
  });

  // Carga las texturas.
  const texture1 = useLoader(TextureLoader, "/images/shaders/channel0.png");
  const texture2 = useLoader(TextureLoader, "/images/shaders/channel1.png");

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial
        attach="material"
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          iTime: { value: 0 },
          iMouse: { value: new Vector2(0, 0) },
          // Asegúrate de proporcionar las texturas para iChannel0 y iChannel1.
          iChannel0: { value: texture1 },
          iChannel1: { value: texture2 },
          iResolution: {
            value: new Vector2(window.innerWidth, window.innerHeight),
          },
        }}
      />
    </mesh>
  );
};

export default ExtintorShader;
