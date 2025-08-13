import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: [
      '**/generated/**/*',          // Ignore all files in generated directories
      '**/node_modules/**/*',       // Ignore node_modules
      '**/.next/**/*',              // Ignore Next.js build output
      '**/dist/**/*',               // Ignore distribution files
      '**/prisma/**/*'             // Ignore Prisma generated files
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
];

export default eslintConfig;
