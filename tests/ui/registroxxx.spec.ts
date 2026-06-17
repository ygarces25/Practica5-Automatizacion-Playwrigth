import { test, expect } from '@playwright/test';

test.describe('HU-REGISTRO-01 — Crear cuenta', () => {

  test.beforeEach(async ({ page }) => {
    page.goto('/registro');
  });

  test('CF1 - Registrar con datos válidos', async ({ page }) => {
    // Paso 1: Llenar Nombre
    page.getByLabel('Nombre').fill('Ana García');

    // Generar un email único para que el test no falle si se corre varias veces
    const emailUnico = `ana.garcia+${Date.now()}@ejemplo.com`;

    // Paso 2: Llenar Email
    page.getByLabel('Email').fill(emailUnico);

    // Paso 3: Llenar Contraseña
    page.getByLabel('Contraseña').fill('Segura2026!');

    // Paso 4: Llenar Edad
    page.getByLabel('Edad').fill('30');

    // Paso 5: Click en "Crear cuenta"
    page.getByRole('button', { name: 'Crear cuenta' }).click();

    // Verificación: aparece mensaje de éxito
    expect(page.getByText('¡Registro exitoso! Tu cuenta ha sido creada.')).toBeVisible();
  });

  test('N1 - Enviar formulario con campo nombre vacío', async ({ page }) => {
    // Paso 1: Llenar Email
    page.getByLabel('Email').fill('ana.garcia@ejemplo.com');

    // Paso 2: Llenar Contraseña
    page.getByLabel('Contraseña').fill('Segura2026!');

    // Paso 3: Llenar Edad
    page.getByLabel('Edad').fill('30');

    // Paso 4: Click en "Crear cuenta"
    page.getByRole('button', { name: 'Crear cuenta' }).click();

    // Verificación: aparece mensaje de error
    expect(page.getByText('El nombre es obligatorio')).toBeVisible();
  });

});
