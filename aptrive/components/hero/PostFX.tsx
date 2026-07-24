"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Kept deliberately small: Bloom (so the emissive core/ring/nodes
 * actually glow instead of just being bright-colored flat meshes) and
 * a soft Vignette (focuses attention on the cluster instead of the
 * card edges). No DepthOfField — on a UI element this small (420–520px
 * tall) a blurred background reads as a bug, not cinematography, and
 * it's one of the more expensive passes for the least payoff here.
 */
export default function PostFX() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.6} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
