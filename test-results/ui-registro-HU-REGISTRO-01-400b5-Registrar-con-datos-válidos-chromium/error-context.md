# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\registro.spec.ts >> HU-REGISTRO-01 — Crear cuenta >> CF1 - Registrar con datos válidos
- Location: tests\ui\registro.spec.ts:9:7

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://playground.calidadsinhumo.com/registro", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('HU-REGISTRO-01 — Crear cuenta', () => {
  4  | 
  5  |   test.beforeEach(async ({ page }) => {
> 6  |     page.goto('/registro');
     |          ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  7  |   });
  8  | 
  9  |   test('CF1 - Registrar con datos válidos', async ({ page }) => {
  10 |     // Paso 1: Llenar Nombre
  11 |     page.getByLabel('Nombre').fill('Ana García');
  12 | 
  13 |     // Generar un email único para que el test no falle si se corre varias veces
  14 |     const emailUnico = `ana.garcia+${Date.now()}@ejemplo.com`;
  15 | 
  16 |     // Paso 2: Llenar Email
  17 |     page.getByLabel('Email').fill(emailUnico);
  18 | 
  19 |     // Paso 3: Llenar Contraseña
  20 |     page.getByLabel('Contraseña').fill('Segura2026!');
  21 | 
  22 |     // Paso 4: Llenar Edad
  23 |     page.getByLabel('Edad').fill('30');
  24 | 
  25 |     // Paso 5: Click en "Crear cuenta"
  26 |     page.getByRole('button', { name: 'Crear cuenta' }).click();
  27 | 
  28 |     // Verificación: aparece mensaje de éxito
  29 |     expect(page.getByText('¡Registro exitoso! Tu cuenta ha sido creada.')).toBeVisible();
  30 |   });
  31 | 
  32 |   test('N1 - Enviar formulario con campo nombre vacío', async ({ page }) => {
  33 |     // Paso 1: Llenar Email
  34 |     page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
  35 | 
  36 |     // Paso 2: Llenar Contraseña
  37 |     page.getByLabel('Contraseña').fill('Segura2026!');
  38 | 
  39 |     // Paso 3: Llenar Edad
  40 |     page.getByLabel('Edad').fill('30');
  41 | 
  42 |     // Paso 4: Click en "Crear cuenta"
  43 |     page.getByRole('button', { name: 'Crear cuenta' }).click();
  44 | 
  45 |     // Verificación: aparece mensaje de error
  46 |     expect(page.getByText('El nombre es obligatorio')).toBeVisible();
  47 |   });
  48 | 
  49 | });
  50 | 
```