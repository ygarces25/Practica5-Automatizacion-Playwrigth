import { test, expect } from '@playwright/test';

test.describe('HU-LOGIN-01 — Inicio de sesión', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('E01 - Login exitoso con credenciales válidas', async ({ page }) => {
    // Paso 1: Llenar email
    await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');

    // Paso 2: Llenar contraseña
    await page.getByLabel('Contraseña').fill('Segura2026!');

    // Paso 3: Click en "Iniciar sesión"
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verificación: aparece mensaje de éxito
    await expect(page.getByText('Has iniciado sesión correctamente.')).toBeVisible();
  });

  test('E02 - Login con email válido y contraseña incorrecta', async ({ page }) => {
    // Paso 1: Llenar email válido
    await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');

    // Paso 2: Llenar contraseña incorrecta
    await page.getByLabel('Contraseña').fill('Incorrecta123!');

    // Paso 3: Click en "Iniciar sesión"
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verificación 1: aparece mensaje de error
    await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible();

    // Verificación 2: el usuario NO accedió (sigue en /login)
    await expect(page).toHaveURL(/.*\/login/);
  });

});
