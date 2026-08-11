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
    // Capacitor and Gradle copy generated JavaScript into Android build
    // intermediates. It is not application source and must not affect the
    // web application's lint result.
    "android/**",
    // Local Android dependency caches are protected build inputs, not source.
    // Ignoring them keeps lint deterministic for a checkout with a retained
    // signing/build cache and matches the clean CI workspace.
    ".launchlift/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
