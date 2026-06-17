import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directorio raíz de tests */
  testDir: './tests',

  /* Ejecutar tests en paralelo */
  fullyParallel: true,

  /* Fallar el build en CI si dejaste test.only en el código */
  forbidOnly: !!process.env.CI,

  /* Reintentos: 0 en local, 2 en CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers: limitar en CI para estabilidad */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter HTML para visualizar resultados */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Configuración compartida para todos los tests */
  use: {
    /* URL base de la aplicación bajo prueba */
    baseURL: process.env.BASE_URL || 'https://playground.calidadsinhumo.com',

    /* Capturar screenshot solo cuando falla */
    screenshot: 'only-on-failure',

    /* Capturar video solo en el primer reintento */
    video: 'on-first-retry',

    /* Capturar trace solo en el primer reintento */
    trace: 'on-first-retry',

    /* Timeout para acciones individuales (click, fill, etc.): 10s */
    actionTimeout: 10_000,

    /* Timeout para navegación (goto, reload, etc.): 15s */
    navigationTimeout: 15_000,
  },

  /* Timeout global por test: 30s */
  timeout: 30_000,

  /* Timeout para expect/assertions: 5s */
  expect: {
    timeout: 5_000,
  },

  /* Proyectos / navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomentar para agregar más navegadores:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
