import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        // Enables requestAnimationFrame, which Burner's System.loop needs.
        pretendToBeVisual: true
      }
    },
    include: ['test/**/*.test.js']
  }
});
