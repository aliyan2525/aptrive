// Vitest stub for the `server-only` package.
//
// `server-only` is a Next.js-specific import whose real module body just
// throws if it's ever bundled into client code — Next's own bundler is what
// enforces that boundary by resolving it specially. Vitest doesn't know
// about that convention and can't resolve the real package at all (it's not
// meant to be imported outside a Next build), so every `lib/**/*.ts` file
// that starts with `import "server-only"` fails to load in tests unless
// something stands in for it. This is that stand-in: an empty module with
// no side effects, aliased in vitest.config.ts.
export {};
