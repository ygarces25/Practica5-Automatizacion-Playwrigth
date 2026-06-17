# A.T.E.R.R.I.Z.A. — HU-LOGIN-01: Inicio de sesión

---

## CAPA A — MAPA FUNCIONAL

### 1. Objetivo
Permitir que un usuario registrado se autentique en la plataforma mediante email y contraseña para acceder a su cuenta.

### 2. Actor/es
- **Usuario registrado** de la plataforma.
- **POR CONFIRMAR:** roles específicos, niveles de permisos, o si existe diferenciación de perfiles (admin, cliente, etc.).

### 3. Flujo principal (camino feliz)
1. El usuario accede al formulario de inicio de sesión.
2. Ingresa su email en el campo correspondiente.
3. Ingresa su contraseña en el campo correspondiente.
4. Presiona el botón **"Iniciar sesión"**.
5. El sistema autentica las credenciales.
6. El sistema muestra el mensaje **"Has iniciado sesión correctamente."**
7. El usuario accede a su cuenta.

**POR CONFIRMAR:** ¿A qué pantalla/sección se redirige tras el login exitoso?

### 4. Sistemas involucrados

| Sistema | Evidencia |
|---|---|
| **Front-end** | Formulario con campos email, contraseña y botón "Iniciar sesión". Mensajes de éxito y error. |
| **Back-end** | Autenticación de credenciales (se infiere del criterio 1: "el sistema autentica"). |
| **Base de datos** | Almacenamiento de usuarios y credenciales (se infiere: debe validar contra datos almacenados). |
| **APIs externas** | **POR CONFIRMAR** — no se mencionan. |
| **Servicios externos** | **POR CONFIRMAR** — no se mencionan (ej: OAuth, CAPTCHA, etc.). |

### 5. Datos de entrada

| Dato | Obligatorio | Ejemplo proporcionado |
|---|---|---|
| Email | Sí (criterio 3) | `ana.garcia@ejemplo.com` |
| Contraseña | Sí (criterio 3) | `Segura2026!` |

**POR CONFIRMAR:** restricciones de formato del email y reglas de complejidad de la contraseña (largo mínimo, caracteres especiales, etc.).

### 6. Datos de salida

| Resultado | Detalle |
|---|---|
| **Éxito** | Mensaje: **"Has iniciado sesión correctamente."** + acceso a la cuenta. |
| **Error — credenciales inválidas** | Mensaje de error. **POR CONFIRMAR:** texto exacto del mensaje de error no especificado en los criterios. |
| **Error — campos vacíos** | El formulario no se envía (validación client-side implícita). **POR CONFIRMAR:** ¿se muestra algún mensaje específico por campo vacío? |

---

## CAPA R — MATRIZ DE RIESGOS

| # | Descripción | Categoría | Impacto | Nivel | Justificación (si ALTO) |
|---|---|---|---|---|---|
| R1 | El sistema autentica y permite acceso con credenciales inválidas (fallo en lógica de validación) | Funcional | Acceso no autorizado a cuentas ajenas | **ALTO** | Es la función core; si falla, la seguridad entera se anula. |
| R2 | Sin protección contra fuerza bruta (no se menciona bloqueo de cuenta, rate limiting ni CAPTCHA) | Seguridad | Un atacante prueba combinaciones hasta acceder a una cuenta | **ALTO** | Login es el vector de ataque #1 y no se especifica ninguna mitigación. |
| R3 | Inyección maliciosa en campos email/contraseña (SQL injection, XSS) | Seguridad | Compromiso de base de datos, robo masivo de credenciales | **ALTO** | Campos de texto libre contra BD; sin sanitización confirmada, el riesgo es crítico. |
| R4 | Transmisión de credenciales sin cifrado (no se especifica HTTPS) | Seguridad | Intercepción de credenciales en tránsito (man-in-the-middle) | **ALTO** | Credenciales en texto plano en red = compromiso inmediato de cuentas. |
| R5 | Almacenamiento de contraseñas sin hashing | Datos | Un breach de BD expone todas las contraseñas en texto plano | **ALTO** | No se especifica mecanismo de hashing; si no existe, el daño de una filtración es masivo. |
| R6 | Gestión de sesión insegura post-login (no se menciona token, expiración, invalidación) | Seguridad | Session hijacking, acceso persistente no autorizado | **ALTO** | La HU no describe qué pasa después del mensaje de éxito; sin sesión segura, el login es inútil. |
| R7 | Bypass de validación de campos vacíos enviando requests directos al backend | Seguridad | Se envían peticiones sin email/contraseña al servidor, saltando la validación del formulario | **MEDIO** | Criterio 3 implica validación client-side; si no hay validación server-side, es explotable. |
| R8 | Mensaje de error revela si el email existe o no en el sistema (enumeración de usuarios) | Seguridad | Atacante identifica cuentas válidas para ataques dirigidos | **MEDIO** | **POR CONFIRMAR:** texto exacto del mensaje de error no especificado. |
| R9 | Fallo de comunicación front→back o back→BD durante autenticación | Integración | Usuario legítimo no puede acceder; no se define comportamiento ante fallo del servidor | **MEDIO** | **POR CONFIRMAR:** manejo de errores de infraestructura no descrito en la HU. |
| R10 | Credenciales válidas rechazadas (falso negativo en autenticación) | Funcional | Usuario legítimo bloqueado, pérdida de confianza | **MEDIO** | Impacto alto en UX pero probabilidad menor si la lógica es estándar. |
| R11 | No se define comportamiento ante timeout o latencia alta | Técnico | Usuario queda sin feedback, posibles reenvíos múltiples del formulario | **BAJO** | Afecta UX pero no compromete datos ni seguridad directamente. |
| R12 | Mensajes de éxito/error no se renderizan correctamente | UX | Usuario no sabe si se autenticó o no | **BAJO** | Impacto limitado a la experiencia visual. |

---

## CAPA R — ESCENARIOS DE PRUEBA

Grupos ordenados por cobertura de riesgos ALTOS primero.

---

### 1. Camino feliz *(cubre R1)*

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E01 | Login exitoso con credenciales válidas | Se muestra el mensaje **"Has iniciado sesión correctamente."** y el usuario accede a su cuenta. |

---

### 2. Negativos *(cubre R1, R2, R3, R7, R8)*

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E02 | Login con email válido y contraseña incorrecta | No permite acceso. Se muestra mensaje de error. **POR CONFIRMAR:** texto exacto del error. |
| E03 | Login con email no registrado | No permite acceso. Se muestra mensaje de error. |
| E04 | Login con campo email vacío | El formulario no se envía. |
| E05 | Login con campo contraseña vacío | El formulario no se envía. |
| E06 | Login con ambos campos vacíos | El formulario no se envía. |
| E07 | Inyección SQL en campo email (`' OR 1=1 --`) | No autentica. No se compromete la BD. Respuesta controlada. |
| E08 | Inyección SQL en campo contraseña | Mismo comportamiento que E07. |
| E09 | Script XSS en campo email (`<script>alert(1)</script>`) | El script no se ejecuta en el navegador. |
| E10 | Múltiples intentos fallidos consecutivos (5+) | **POR CONFIRMAR:** bloqueo, CAPTCHA o delay. Se verifica que exista alguna mitigación. |
| E11 | Bypass de validación front: request directo al backend con campos vacíos | El backend rechaza la petición. No autentica. |

---

### 3. Borde / límites *(cubre R3, R7)*

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E12 | Email con formato inválido (sin `@`, sin dominio) | Formulario no se envía o muestra error de formato. |
| E13 | Email con espacios al inicio/final | **POR CONFIRMAR:** ¿se aplica trim? Si sí → autentica. Si no → error. |
| E14 | Contraseña de 1 carácter | **POR CONFIRMAR:** reglas de longitud mínima. Se verifica que el sistema acepte o rechace según regla definida. |
| E15 | Email o contraseña con longitud extrema (1000+ caracteres) | Sistema responde sin error 500. Muestra error controlado. |
| E16 | Contraseña compuesta solo de espacios | **POR CONFIRMAR:** ¿se trata como vacío o se envía? |

---

### 4. Estados *(cubre R6)*

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E17 | Usuario ya autenticado accede a pantalla de login | **POR CONFIRMAR:** ¿se redirige automáticamente o se muestra el formulario? |
| E18 | Verificar que se genera sesión tras login exitoso | Existe token/cookie de sesión en el navegador tras E01. **POR CONFIRMAR:** mecanismo (JWT, cookie, etc.). |
| E19 | Sesión expira tras inactividad | **POR CONFIRMAR:** tiempo de expiración. Tras expirar, el sistema exige re-autenticación. |

---

### 5. Integración *(cubre R9)*

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E20 | Backend no disponible al enviar login | El usuario ve un mensaje de error genérico, no un stack trace ni error técnico. **POR CONFIRMAR:** texto del mensaje. |
| E21 | Base de datos no disponible durante autenticación | Mismo criterio que E20: error controlado visible al usuario. |

---

### 6. Datos *(cubre R10)*

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E22 | Email con mayúsculas (`ANA.GARCIA@EJEMPLO.COM`) | **POR CONFIRMAR:** ¿case-insensitive? Si sí → autentica. Si no → error. |
| E23 | Contraseña con mayúsculas alteradas (`segura2026!` en vez de `Segura2026!`) | No autentica (contraseña es case-sensitive). |
| E24 | Email con caracteres especiales válidos (`ana+test@ejemplo.com`) | **POR CONFIRMAR:** ¿se acepta el formato? |

---

### 7. Roles y permisos

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E25 | Login con distintos roles de usuario | **POR CONFIRMAR:** la HU solo define "usuario registrado". No se especifican roles ni permisos diferenciados. Si existen, verificar redirección y acceso según rol. |

---

### 8. Regresión

| ID | Título | Resultado esperado verificable |
|---|---|---|
| E26 | Login con contraseña anterior tras cambio de contraseña | La contraseña anterior no autentica; solo la nueva funciona. |
| E27 | Login con email anterior tras actualización de email | El email anterior no autentica; solo el actualizado funciona. |

---

**Resumen:** 27 escenarios. 11 con puntos **POR CONFIRMAR** que dependen de definiciones no presentes en la HU.
