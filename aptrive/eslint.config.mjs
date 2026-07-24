import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // react-three-fiber's whole animation model is: read a ref/value
    // returned by useThree()/useMemo() and mutate it every frame inside
    // useFrame's callback. That callback runs on r3f's own render loop,
    // not React's render phase, so mutating `camera`, a shader
    // `material`'s uniforms, or a mesh ref there is the standard,
    // documented r3f pattern (https://docs.pmnd.rs/react-three-fiber/api/hooks#useframe)
    // — not a React render-purity violation. The react-hooks/immutability
    // rule doesn't yet special-case useFrame, so it flags this pattern
    // everywhere it appears. Scoped off here (scene files only) rather
    // than disabled globally, so it still catches genuine mutation bugs
    // in ordinary component render bodies.
    files: ["components/**/scene/**/*.{ts,tsx}", "components/hero/useHeroCameraRig.ts"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
