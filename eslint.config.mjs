import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.mjs',
      'src/database.types.ts',
      'commitlint.config.mjs',
      'vitest.config.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
]);
