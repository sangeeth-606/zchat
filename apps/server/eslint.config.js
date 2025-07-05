import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: [
      "dist/**",
      "src/generated/**",
      "node_modules/**"
    ]
  }
];
