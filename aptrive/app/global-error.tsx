"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: only fires if the root layout itself throws,
 * which is why (unlike every other error.tsx) it has to render its own
 * <html>/<body> — there's no layout left above it to provide one.
 * Deliberately plain/inline-styled: it must not depend on globals.css,
 * Tailwind, or any component that could itself be the thing that broke.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: "0.75rem", color: "#666", maxWidth: "28rem" }}>
          The app hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            background: "#23d5c4",
            color: "#111",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
