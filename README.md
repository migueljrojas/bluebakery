# Blue Bakery

Sitio de Blue Bakery (Next.js 15, App Router, Tailwind v4) con un recetario protegido en `/recetario`.

## Desarrollo

Requiere Node 22 (ver `.nvmrc`).

```bash
nvm use
npm install
cp .env.example .env.local   # completar valores
npm run dev
```

## Recetario protegido

- `/recetario/acceso`: inicio de sesión con Firebase Auth (enlace mágico por email o Google).
- `/recetario/pago`: paywall de acceso lifetime (Pago Móvil para Venezuela, PayPal para el resto del mundo).
- `/recetario` y `/recetario/[slug]`: recetario, solo con sesión iniciada y pago verificado.
- `/admin`: panel para aprobar o rechazar pagos (solo correos de `ADMIN_EMAILS`, que además tienen acceso al recetario sin pagar).

### Flujo de pagos (verificación manual)

1. El cliente paga con PayPal (se captura el cobro) o registra los datos de su Pago Móvil.
2. El pago se guarda en Firestore con estado `pendiente`. El cliente ve un botón para enviar el comprobante por WhatsApp con los datos del pago ya escritos.
3. Los admins ven el número de pagos pendientes en el menú; verifican el pago en el banco o en PayPal y lo aprueban o rechazan en `/admin`.
4. Al aprobar se crea el acceso lifetime: si el cliente tiene la página abierta entra solo al recetario (se consulta el estado cada 30 segundos), o entra directo la próxima vez. Al rechazar, ve el motivo en la página de pago y puede registrarlo de nuevo.

Las recetas viven en `src/data/recetas.js` (solo servidor). El PDF original está en `content/recetario.pdf`, fuera de `public/` para que no se pueda descargar sin pagar.

### Firestore

- `accesos/{email}`: acceso lifetime otorgado (`uid`, `email`, `metodo`, `pagoId`, `otorgadoEn`).
- `pagos/{id}`: registro de cada pago (PayPal o Pago Móvil) con `estado` `pendiente`, `aprobado` o `rechazado`. Los de Pago Móvil usan el id `pagomovil_{banco}_{referencia}` para impedir que una referencia se reutilice.

Para otorgar un acceso de cortesía, crea en Firestore el documento `accesos/{email-en-minusculas}` con `{ email, metodo: "manual" }`.

## Configuración paso a paso

### 1. Firebase

1. Entra a [Firebase Console](https://console.firebase.google.com) y crea un proyecto.
2. En **Project settings > General > Your apps**, agrega una app **Web**. Copia `apiKey`, `authDomain`, `projectId` y `appId` en las variables `NEXT_PUBLIC_FIREBASE_*`.
3. En **Authentication > Sign-in method**:
   - Activa **Email/Password** y marca **Email link (passwordless sign-in)**.
   - Activa **Google** (elige el email de soporte).
4. En **Authentication > Settings > Authorized domains**, agrega `localhost` (en proyectos creados después del 28 de abril de 2025 ya no viene por defecto), el dominio `*.vercel.app` del proyecto y el dominio propio. Sin esto, el envío del enlace falla con `auth/unauthorized-continue-uri`.
5. En **Firestore Database**, crea la base de datos en modo producción y publica las reglas de `firestore.rules` (todo denegado; solo el servidor accede).
6. En **Project settings > Service accounts**, genera una nueva clave privada. Del JSON descargado, copia `project_id`, `client_email` y `private_key` en `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY`.

El correo del enlace se envía en español (`auth.languageCode = "es"`) con la plantilla predeterminada de Firebase. En **Authentication > Templates** puedes cambiar el nombre del remitente y configurar un dominio propio para los correos.

### 2. PayPal

1. Entra a [developer.paypal.com](https://developer.paypal.com) > **Apps & Credentials**.
2. Crea una app en **Sandbox** para pruebas y copia el Client ID y el Secret en `NEXT_PUBLIC_PAYPAL_CLIENT_ID` y `PAYPAL_CLIENT_SECRET`, con `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`.
3. Para producción, crea la app en **Live** y usa `PAYPAL_API_BASE=https://api-m.paypal.com`.

### 3. Pago Móvil

- `PAGO_MOVIL_*`: datos del beneficiario que se muestran en el paywall.
- El monto en Bs se calcula como `RECETARIO_PRECIO_USD × tasa Euro BCV` usando [DolarAPI](https://ve.dolarapi.com/v1/euros/oficial).

### 4. Administradores

- `ADMIN_EMAILS`: correos (separados por coma) que pueden entrar a `/admin`.
- El número de WhatsApp que recibe los comprobantes está en `src/lib/contacto.js`.

### 5. Vercel

Carga todas las variables de `.env.example` en **Project Settings > Environment Variables** y asegúrate de que la versión de Node sea 22.x.
