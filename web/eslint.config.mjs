import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "public/**"]),
  {
    rules: {
      // Static export has no image optimizer, and next/image adds inline
      // style attributes that the site's strict CSP blocks, so plain <img> is used.
      "@next/next/no-img-element": "off",
    },
  },
]);
