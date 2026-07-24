import * as THREE from "three";

/**
 * Fresnel-based "atmosphere" shell: brighter at grazing angles, near-
 * transparent face-on. This is what reads as a glowing planetary
 * atmosphere without needing an environment map or postprocessing —
 * it works even on the "medium" tier where bloom is disabled.
 *
 * Built as a plain THREE.ShaderMaterial (not drei's `shaderMaterial` +
 * `extend`) so it doesn't depend on JSX intrinsic-element type
 * augmentation, which shifts between @react-three/fiber major
 * versions. `new AtmosphereMaterial()` just works anywhere.
 */
export function createAtmosphereMaterial(coreColor: THREE.ColorRepresentation, rimColor: THREE.ColorRepresentation) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uCoreColor: { value: new THREE.Color(coreColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-viewPosition.xyz);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uCoreColor;
      uniform vec3 uRimColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        // Fresnel term: 0 facing the camera, 1 at the silhouette edge.
        float fresnel = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
        fresnel = pow(fresnel, 2.2);

        // Slow pulse so the shell reads as "alive" rather than static,
        // kept subtle per the brief ("very subtle breathing").
        float pulse = 0.9 + 0.1 * sin(uTime * 0.6);

        vec3 color = mix(uCoreColor, uRimColor, fresnel) * pulse;
        float alpha = fresnel * 0.85;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

export type AtmosphereMaterial = ReturnType<typeof createAtmosphereMaterial>;
