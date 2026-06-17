import { test, expect } from '@playwright/test';

test.describe('HU-REGISTRO-01 — Crear cuenta', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/registro');
  });

  test('CF1 - Registrar con datos válidos', async ({ page }) => {
    // Paso 1: Llenar Nombre
    await page.getByLabel('Nombre').fill('Ana García');

    // Paso 2: Llenar Email
    await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');

    // Paso 3: Llenar Contraseña
    await page.getByLabel('Contraseña').fill('Segura2026!');

    // Paso 4: Llenar Edad
    await page.getByLabel('Edad').fill('30');

    // Paso 5: Click en "Crear cuenta"
    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    // Verificación: aparece mensaje de éxito
    await expect(page.getByText('Cuenta creada correctamente')).toBeVisible();
  });

  test('N1 - Enviar formulario con campo nombre vacío', async ({ page }) => {
    // Paso 1: Llenar Email
    await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');

    // Paso 2: Llenar Contraseña
    await page.getByLabel('Contraseña').fill('Segura2026!');

    // Paso 3: Llenar Edad
    await page.getByLabel('Edad').fill('30');

    // Paso 4: Click en "Crear cuenta"
    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    // Verificación: aparece mensaje de error
    await expect(page.getByText('El nombre es obligatorio')).toBeVisible();
  });

});
