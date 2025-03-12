/// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', 
    setupFiles: './src/setupTests.ts', 
    exclude: [...configDefaults.exclude, 'e2e/**'], // Exclude end-to-end tests if using Playwright or Cypress
  },
});
