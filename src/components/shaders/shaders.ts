import { ShaderMaterial } from "three";

export const shaderRed = new ShaderMaterial({
  vertexShader: `
    precision highp float;

    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    varying vec2 vUv;

    uniform vec3 color;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
