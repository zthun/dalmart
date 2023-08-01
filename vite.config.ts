import { defineConfig } from 'vite';
import tsConfigPaths from 'vitest-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environment: 'jsdom',
    testTimeout: 30000,
    coverage: {
      provider: 'istanbul'
    }
  }
});
