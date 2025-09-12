import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/types.ts',
        '**/index.ts',
        '**/layout.tsx',
        '**/page.tsx',
        '**/loading.tsx',
        '**/error.tsx',
        '**/not-found.tsx'
      ]
    }
  }
})
