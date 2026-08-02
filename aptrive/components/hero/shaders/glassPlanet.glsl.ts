import * as THREE from "three";

/**
 * Shared 3D simplex noise (Ashima/webgl-noise, public-domain reference
 * implementation) — inlined into each shader string below since a
 * vertex and a fragment shader are compiled as separate programs and
 * can't share a GLSL function across stages.
 */
const SNOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

/**
 * The planet's solid core: a dark, slowly-swirling nebula surface
 * (fbm noise blended between navy/indigo/icy-blue bands) scattered
 * with sparse twinkling "city light" specks, a soft top-left studio
 * specular hotspot, and a Fresnel-lit rim — the closest real-time
 * approximation of the reference's frosted glass marble without a
 * full raymarched refraction pass (impractical at 60fps on a decorative
 * hero element). Self-lit by design: it doesn't read THREE lights, so
 * it looks identical regardless of what else is in the scene.
 */
export function createGlassPlanetCoreMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color("#d8ecff") },
      uMidColor: { value: new THREE.Color("#78aef5") },
      uLightColor: { value: new THREE.Color("#ffffff") },
      uSparkColor: { value: new THREE.Color("#ffffff") },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      ${SNOISE_GLSL}

      void main() {
        // Very small breathing displacement — same "never completely
        // static" principle as the rest of the hero, kept subtle
        // enough that the sphere still reads as a solid glass object.
        float n = snoise(position * 1.6 + uTime * 0.05);
        vec3 displaced = position + normal * n * 0.018;

        vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;

        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-viewPosition.xyz);
        vWorldPos = worldPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uMidColor;
      uniform vec3 uLightColor;
      uniform vec3 uSparkColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      ${SNOISE_GLSL}

      float fbm(vec3 p) {
        float value = 0.0;
        float amp = 0.55;
        for (int i = 0; i < 4; i++) {
          value += amp * snoise(p);
          p *= 2.02;
          amp *= 0.55;
        }
        return value;
      }

      float hash(vec3 p) {
        p = fract(p * vec3(443.897, 441.423, 437.195));
        p += dot(p, p.yzx + 19.19);
        return fract((p.x + p.y) * p.z);
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewDir);

        // Two noise fields at different frequencies/drift rates,
        // blended, so the swirl reads as marbled bands rather than a
        // single uniform cloud.
        float swirl = fbm(vWorldPos * 1.1 + vec3(0.0, uTime * 0.03, 0.0));
        float bands = fbm(vWorldPos * 2.3 - vec3(uTime * 0.015, 0.0, 0.0));
        float mixVal = clamp(swirl * 0.6 + bands * 0.4, -1.0, 1.0);

        vec3 base = mix(uDeepColor, uMidColor, smoothstep(-0.55, 0.34, mixVal));
        base = mix(base, uLightColor, smoothstep(0.18, 0.86, mixVal));

        // Sparse twinkling specks — "city lights suspended in glass".
        float cell = hash(floor(vWorldPos * 34.0));
        float twinkle = 0.5 + 0.5 * sin(uTime * (1.5 + cell * 3.0) + cell * 40.0);
        float sparkle = smoothstep(0.965, 1.0, cell) * twinkle;

        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4);

        // Fixed key light, upper-left — a soft studio specular hotspot
        // rather than physically simulated refraction.
        vec3 lightDir = normalize(vec3(-0.72, 0.82, 0.42));
        vec3 reflectDir = reflect(-lightDir, normal);
        float specular = pow(max(dot(reflectDir, viewDir), 0.0), 46.0);

        vec3 color = base;
        color += uSparkColor * sparkle * 1.65;
        color += vec3(0.62, 0.82, 1.0) * fresnel * 0.82;
        color += vec3(1.0) * specular * 1.15;
        color = mix(color, vec3(1.0), 0.18);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * Thin glassy rim shell, slightly larger than the core — a crisp
 * Fresnel-lit edge so the silhouette reads as glass rather than a
 * flat-shaded sphere cutout. Additive + transparent, no displacement
 * (the core's breathing is enough motion for the pair).
 */
export function createGlassPlanetRimMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uRimColor: { value: new THREE.Color("#eaf3ff") },
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
      uniform vec3 uRimColor;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        float fresnel = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
        fresnel = pow(fresnel, 3.4);
        gl_FragColor = vec4(uRimColor, fresnel * 0.9);
      }
    `,
  });
}

export type GlassPlanetCoreMaterial = ReturnType<typeof createGlassPlanetCoreMaterial>;
export type GlassPlanetRimMaterial = ReturnType<typeof createGlassPlanetRimMaterial>;
