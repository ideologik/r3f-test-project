// SimpleShader.ts
export const vertexShader = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0); // Un color magenta simple
  }
`;
