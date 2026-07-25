import * as THREE from "three";

/**
 * Particle field rendered as a single `THREE.Points` draw call. Drift
 * and pointer-reactivity are computed per-vertex on the GPU (via
 * uTime/uPointer uniforms) rather than updating a JS-side position
 * array every frame — the difference between "fine on desktop, chokes
 * a mid-range phone" and not, once the count gets into the thousands.
 */
export function createParticleMaterial(color: THREE.ColorRepresentation) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 22.0 },
      uColor: { value: new THREE.Color(color) },
      // 0→1, driven from the Hero's scroll-out progress (see
      // KnowledgeParticles' releaseRef). At 0 the field just idles in
      // its resting shell; at 1 every particle has been pushed out
      // along its own radial direction and down toward the next
      // section, and faded — the "released knowledge particles"
      // phase of the crack-open exit.
      uRelease: { value: 0 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uSize;
      uniform float uRelease;

      // 'seed' is packed per-particle in the position buffer's unused
      // precision headroom via a separate attribute, so each particle
      // drifts out of phase with its neighbors instead of breathing
      // in lockstep.
      attribute float aSeed;

      varying float vAlpha;

      void main() {
        vec3 pos = position;

        // Cheap per-particle drift: three offset sine waves rather than
        // a full 3D noise function — visually indistinguishable at
        // this particle size, far less ALU cost per vertex.
        float t = uTime * 0.15 + aSeed * 6.2831;
        pos.x += sin(t) * 0.12;
        pos.y += cos(t * 1.3) * 0.12;
        pos.z += sin(t * 0.7) * 0.12;

        // Gentle parallax: the whole field leans away from the pointer.
        pos.x += uPointer.x * 0.35;
        pos.y += uPointer.y * 0.35;

        // Release: push each particle further out along its own
        // resting direction from the core (radial, per-particle —
        // reuses the original position attribute before drift/
        // parallax so the push is stable per-particle rather than
        // recomputed from the drifted value) and down, so the field
        // disperses downward toward the section below rather than
        // uniformly outward.
        vec3 outward = normalize(position) * uRelease * 3.2;
        pos += outward;
        pos.y -= uRelease * 2.4;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        // Size attenuation so distant particles don't dominate — same
        // falloff PointsMaterial(sizeAttenuation) uses internally.
        // Particles also shrink slightly as they disperse, so the
        // field reads as thinning out rather than just spreading.
        gl_PointSize = uSize * (1.0 / -mvPosition.z) * (1.0 - uRelease * 0.4);
        gl_Position = projectionMatrix * mvPosition;

        vAlpha = (0.35 + 0.35 * sin(t * 2.0)) * (1.0 - uRelease * 0.7);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;

      void main() {
        // Soft circular sprite: fade to transparent at the point's edge
        // instead of a hard square, no texture lookup needed.
        vec2 centered = gl_PointCoord - vec2(0.5);
        float dist = length(centered);
        if (dist > 0.5) discard;
        float edge = smoothstep(0.5, 0.1, dist);
        gl_FragColor = vec4(uColor, edge * vAlpha);
      }
    `,
  });
}

export type ParticleMaterial = ReturnType<typeof createParticleMaterial>;
