# CAPA R — ESCENARIOS DE PRUEBA

## HU-REGISTRO-01 — Crear cuenta

---

### 1. SEGURIDAD (cubre R1, R3, R4)

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| S1 | Registrar cuenta y verificar que la contraseña no se transmite en texto plano en la petición de red | En las herramientas de desarrollo (pestaña Network), el body de la request viaja por HTTPS. POR CONFIRMAR: si además se espera cifrado del campo antes de enviar |
| S2 | Registrar cuenta y verificar que la contraseña no se almacena en texto plano en la base de datos | Consultar el registro en BD: el campo contraseña contiene un hash (ej. bcrypt), no el texto original |
| S3 | Ingresar `<script>alert('XSS')</script>` en el campo nombre y crear la cuenta | No se ejecuta el script en ninguna vista que muestre el nombre. El texto se muestra escapado o se rechaza |
| S4 | Ingresar `' OR 1=1 --` en el campo email y enviar el formulario | El sistema rechaza el email por formato inválido. No se produce error de BD ni comportamiento inesperado |
| S5 | Enviar 50 solicitudes de registro consecutivas en menos de 1 minuto desde la misma IP | POR CONFIRMAR: se espera rate limiting o captcha que bloquee registros masivos. Verificar si existe protección |

---

### 2. DATOS — UNICIDAD (cubre R2)

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| D1 | Registrar una cuenta con email `ana.garcia@ejemplo.com`, luego intentar registrar otra cuenta con el mismo email | El segundo intento falla. Se muestra mensaje de error indicando que el email ya está registrado. POR CONFIRMAR: texto exacto del mensaje |
| D2 | Registrar con email `Ana.Garcia@Ejemplo.com` cuando ya existe `ana.garcia@ejemplo.com` | POR CONFIRMAR: se debe definir si la comparación de unicidad es case-insensitive. Verificar si se crea o se rechaza |

---

### 3. CAMINO FELIZ

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| CF1 | Registrar con datos válidos: Ana García / ana.garcia@ejemplo.com / Segura2026! / 30 | El sistema muestra mensaje de confirmación visible en pantalla. La cuenta existe en el sistema (verificable intentando login posterior) |

---

### 4. NEGATIVOS — ENTRADAS INVÁLIDAS

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| N1 | Enviar formulario con campo nombre vacío (email, contraseña y edad válidos) | El formulario no se envía. Se indica que el campo nombre es obligatorio |
| N2 | Enviar formulario con campo email vacío | El formulario no se envía. Se indica que el campo email es obligatorio |
| N3 | Enviar formulario con campo contraseña vacío | El formulario no se envía. Se indica que el campo contraseña es obligatorio |
| N4 | Enviar formulario con campo edad vacío | El formulario no se envía. Se indica que el campo edad es obligatorio |
| N5 | Enviar formulario con todos los campos vacíos | El formulario no se envía. Se indican los campos obligatorios faltantes |
| N6 | Ingresar email sin @: `anagarcia.ejemplo.com` | Se muestra mensaje de error de formato de email |
| N7 | Ingresar contraseña de 7 caracteres: `Corta1!` | Se muestra mensaje de error indicando que la contraseña debe tener mínimo 8 caracteres |
| N8 | Ingresar edad 0 | Se muestra mensaje de error indicando que la edad debe estar entre 1 y 150 |
| N9 | Ingresar edad 151 | Se muestra mensaje de error indicando que la edad debe estar entre 1 y 150 |
| N10 | Ingresar edad negativa: -5 | Se muestra mensaje de error indicando que la edad debe estar entre 1 y 150 |
| N11 | Ingresar texto no numérico en edad: `treinta` | Se muestra mensaje de error o el campo no acepta la entrada. POR CONFIRMAR: comportamiento esperado (bloqueo de input vs. mensaje de error) |

---

### 5. BORDE / LÍMITES

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| B1 | Contraseña de exactamente 8 caracteres: `Abcdef1!` | La cuenta se crea exitosamente. Se muestra confirmación |
| B2 | Contraseña de exactamente 7 caracteres: `Abcde1!` | Se muestra mensaje de error de longitud mínima |
| B3 | Edad = 1 (límite inferior válido) | La cuenta se crea exitosamente |
| B4 | Edad = 150 (límite superior válido) | La cuenta se crea exitosamente |
| B5 | Edad = 1.5 (decimal dentro del rango) | POR CONFIRMAR: si se acepta, se rechaza o se trunca. Verificar comportamiento |
| B6 | Nombre de un solo carácter: `A` | POR CONFIRMAR: se espera aceptación o rechazo (no hay longitud mínima definida) |
| B7 | Email con @ pero estructura mínima: `a@b` | POR CONFIRMAR: si la validación "con @" acepta esto como válido o exige dominio completo |

---

### 6. ROLES Y PERMISOS

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| RP1 | Un usuario ya autenticado intenta acceder al formulario de registro | POR CONFIRMAR: no se define comportamiento. Verificar si se permite, se redirige o se bloquea |

---

### 7. ESTADOS / TRANSICIONES

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| E1 | Después de ver el mensaje de confirmación, el usuario intenta iniciar sesión con las credenciales recién creadas | Login exitoso: el sistema reconoce email + contraseña y permite el acceso |
| E2 | El usuario presiona "Crear cuenta" dos veces rápidamente (doble submit) | Se crea una sola cuenta. No hay duplicados en BD. POR CONFIRMAR: si el botón se deshabilita tras el primer clic |

---

### 8. INTEGRACIÓN (cubre R5, R8)

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| I1 | Enviar request directamente al endpoint de registro (sin pasar por el formulario) con datos inválidos (email sin @, contraseña de 3 caracteres) | El back-end rechaza la solicitud con errores de validación. No se crea la cuenta en BD |
| I2 | Simular caída del servicio de base de datos y enviar un registro válido desde el formulario | El sistema muestra un mensaje de error genérico al usuario. No queda la cuenta en estado parcial/corrupto. POR CONFIRMAR: mensaje esperado |

---

### 9. DATOS — COMBINACIONES (cubre R6, R7, R11)

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| DC1 | Nombre con caracteres especiales y números: `María José O'Brien 3ra` | POR CONFIRMAR: se acepta o se rechaza. No hay restricciones definidas |
| DC2 | Email técnicamente válido con caracteres poco comunes: `user+tag@sub.ejemplo.com` | POR CONFIRMAR: si la validación "con @" lo acepta y si el sistema lo maneja correctamente |
| DC3 | Contraseña de exactamente 8 caracteres sin complejidad: `aaaaaaaa` | La cuenta se crea exitosamente (la HU solo exige longitud ≥ 8). POR CONFIRMAR: si se desea rechazar por debilidad |

---

### 10. REGRESIÓN

| # | Escenario | Resultado esperado verificable |
|---|---|---|
| RG1 | Tras un registro exitoso, verificar que el formulario de login sigue funcionando con cuentas preexistentes | Login con cuenta previa al cambio funciona sin problemas |
| RG2 | Verificar que otros formularios de la plataforma (si existen) no se ven afectados por cambios en validaciones del registro | POR CONFIRMAR: identificar formularios existentes que compartan componentes o lógica de validación |

---

## Cobertura de riesgos

| Riesgo | Escenarios que lo cubren |
|---|---|
| R1 (contraseña texto plano) | S1, S2 |
| R2 (email duplicado) | D1, D2 |
| R3 (bots/spam) | S5 |
| R4 (inyección) | S3, S4 |
| R5 (validación solo front) | I1 |
| R6 (edad no entera) | B5 |
| R7 (email solo @) | B7, DC2 |
| R8 (fallo back-end) | I2 |
| R9 (contraseña débil) | DC3 |
| R10 (feedback) | N1–N11 |
| R11 (nombre sin restricción) | B6, DC1 |
| R12 (confirmación poco clara) | E1 |

---

## Resumen

- **Total de escenarios:** 33
- **Escenarios con puntos POR CONFIRMAR:** 15

### Puntos POR CONFIRMAR

| # | Punto | Escenarios afectados | Por qué la HU no lo resuelve |
|---|---|---|---|
| PC1 | **Unicidad del email**: ¿se valida que no exista otra cuenta con el mismo email? | D1, D2 | La HU no menciona validación de duplicados |
| PC2 | **Comparación case-insensitive del email**: ¿`ANA@X.COM` y `ana@x.com` son el mismo? | D2 | No se define criterio de comparación |
| PC3 | **Profundidad de validación del email**: ¿basta con que tenga `@` o se exige dominio válido? | B7, DC2 | La HU solo dice "con @" |
| PC4 | **Tipo de dato de edad**: ¿solo enteros o acepta decimales? | B5 | La HU dice "número entre 1 y 150" sin precisar tipo |
| PC5 | **Restricciones del campo nombre**: longitud mínima/máxima, caracteres permitidos | B6, DC1 | La HU solo dice que es obligatorio |
| PC6 | **Complejidad de contraseña**: ¿se exigen mayúsculas, números o caracteres especiales? | DC3 | La HU solo exige mínimo 8 caracteres |
| PC7 | **Textos exactos de mensajes de error** (email, contraseña, edad, campo vacío) | N1–N11, N6–N9 | La HU dice "muestra error" pero no define el texto |
| PC8 | **Comportamiento post-registro**: ¿hay redirección, envío de email o solo el mensaje? | CF1, E1 | La HU dice "muestra confirmación" sin más detalle |
| PC9 | **Protección anti-bots**: captcha, rate limiting u otra medida | S5 | No se menciona ninguna protección |
| PC10 | **Validación server-side**: ¿existe validación en back-end además del front? | I1 | No se especifica dónde ocurren las validaciones |
| PC11 | **Manejo de errores del servidor**: ¿qué ve el usuario si el back-end o la BD fallan? | I2 | No se describe escenario de fallo técnico |
| PC12 | **Acceso al formulario estando autenticado**: ¿se permite, se redirige o se bloquea? | RP1 | No se define comportamiento para usuario ya logueado |
| PC13 | **Prevención de doble submit**: ¿se deshabilita el botón tras el primer clic? | E2 | No se menciona |
| PC14 | **Comportamiento del campo edad con texto no numérico**: ¿bloquea input o muestra error? | N11 | No se especifica el tipo de control del campo |
| PC15 | **Hashing de contraseña**: algoritmo y método de almacenamiento seguro | S1, S2 | No se menciona seguridad de almacenamiento |
