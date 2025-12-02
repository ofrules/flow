// @ts-check

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Common rules from all packages
      "quotes": ["error", "double"],
      "max-len": [
        "error",
        {
          code: 120,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],

      // TypeScript specific rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // Import rules (will be handled by typescript-eslint)
      "import/no-unresolved": "off",

      // Console warnings for debugging
      "no-console": "warn",

      // Disable some overly strict rules
      "require-jsdoc": "off",
      "new-cap": "off",
      "camelcase": "off",

      // Disable formatting rules that conflict with Prettier
      "indent": "off", // Let prettier handle this
      "object-curly-spacing": "off", // Let prettier handle this
      "linebreak-style": "off", // Let prettier handle this
    },
  },
  {
    ignores: [
      "**/lib/**/*",
      "**/node_modules/**/*",
      "**/eslint.config.js",
      "**/dist/**/*"
    ],
  }
);
