# Portafolio — Luis Alfonso Hernández

Portafolio personal **bilingüe (español / inglés)**, instalable como PWA, con un **panel privado** que
edita todo el contenido en vivo y genera el CV en PDF desde esos mismos datos.

**En vivo:** https://portfolio-luisalfonsohernandez.web.app

---

## Por qué existe este repositorio

Es un producto pequeño resuelto como uno grande: arquitectura por capas, el proveedor de datos aislado
tras contratos, validación estricta como puerta de entrega y pruebas en los dos niveles. Sirve tanto de
portafolio como de muestra de cómo trabajo.

## Qué hace

- **Contenido en vivo** — perfil, experiencia, proyectos, certificaciones, estudios, idiomas y stack;
  se editan desde el panel y el sitio se actualiza al instante, sin desplegar.
- **Bilingüe** — todo el sitio en español e inglés, con autotraducción asistida al editar.
- **CV en PDF** — se genera en el navegador desde los mismos datos que muestra el sitio, en ambos
  idiomas. Una sola fuente de verdad: no hay un PDF que se desincronice del sitio.
- **Publicación por elemento** — proyectos y certificaciones se redactan en el panel y sólo aparecen
  cuando se marcan como publicados.
- **Instalable (PWA)** — se añade a la pantalla de inicio y se actualiza sola.
- **Notificaciones de visitas** — avisos de interacción (descarga de CV, clic a GitHub, apertura de un
  proyecto) resueltos en Cloud Functions, con límite de tasa y origen restringido.

## Arquitectura

Cuatro capas por dominio. La estructura de carpetas nombra el negocio, no el framework.

```
src/modules/<dominio>/
├── domain/           Entidades y contratos de repositorio. No depende de nada.
├── application/      Hooks (TanStack Query) y validación (Zod). Orquesta.
├── infrastructure/   Implementa los contratos: Firestore, servicios externos.
└── presentation/     Vistas y componentes. Delega en application.
```

La regla de dependencias apunta siempre hacia adentro:

```
Presentation → Application → Domain
Infrastructure ───────────→ Domain
```

Y no es una convención de palabra: **ESLint la hace cumplir** con `import/no-restricted-paths`, así que
`domain` no puede importar `application`, y `application` no puede importar `infrastructure`.

**Repository pattern.** La interfaz vive en `domain/`, la implementación con Firestore en
`infrastructure/`. Ningún componente conoce Firebase: el flujo es componente → hook → repositorio →
SDK. Cambiar de backend no toca la UI.

**Tiempo real sin fugas.** Las suscripciones `onSnapshot` viven dentro del repositorio y se exponen al
resto como una query normal; ningún componente abre una suscripción por su cuenta.

## Stack

React · TypeScript · Vite · TailwindCSS · TanStack Query · Zustand · Zod · React Hook Form ·
React Router · Firebase (Auth · Firestore · Storage · Cloud Functions) · jsPDF. Gestor **pnpm**.

## Calidad

Ninguna entrega pasa sin los seis en verde, con **cero errores y cero advertencias**:

| Puerta | Comando | Qué exige |
|--------|---------|-----------|
| Lint | `pnpm lint` | ESLint con `--max-warnings 0`, incluida la regla de capas. |
| Tipos | `pnpm typecheck` | `tsc --noEmit`. Sin `any`, sin `@ts-ignore`. |
| Unitarios | `pnpm test` | Vitest + Testing Library, con umbral de cobertura. |
| Build | `pnpm build` | `vite build` sin errores. |
| Dependencias | `pnpm audit --audit-level=high` | Sin vulnerabilidades altas ni críticas. |
| E2E | `pnpm test:e2e` | Playwright en navegador real: carga, cambio de idioma y descarga del CV. |

Las cinco primeras corren en **integración continua** en cada push y cada pull request
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)). Las E2E se quedan fuera del pipeline a
propósito: apuntan a la base de datos real y meter sus credenciales en CI daría más superficie de la
que ganaría cobertura. Corren en local antes de cada despliegue.

Además: sin comentarios de relleno (los nombres explican), sin código muerto, sin valores
hardcodeados, límites de tamaño por archivo y por función aplicados por el linter.

## Seguridad

- **Autorización en el servidor, no en el cliente.** Las reglas de Firestore permiten lectura pública y
  **escritura sólo al administrador** con correo verificado. El guard del cliente es comodidad; la
  autoridad son las reglas.
- **Cabeceras** — CSP acotada, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, HSTS y caché
  inmutable para los assets con hash.
- **Cloud Function endurecida** — origen restringido y límite de tasa por IP.
- **Sin secretos en el repositorio** — toda la configuración entra por variables de entorno
  (`.env.example` documenta cuáles).

## Empezar

```sh
pnpm install
cp .env.example .env.local   # completa tus claves de Firebase
pnpm dev
```

Para las pruebas de extremo a extremo hace falta el navegador de Playwright una sola vez:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

## Despliegue

Las Cloud Functions son un paquete aparte, con su propio `package.json` y su propia compilación a
`functions/lib`. El hook `predeploy` de `firebase.json` las instala y compila, así que basta con:

```sh
pnpm build
firebase deploy --only "hosting,functions"
```

Las comillas alrededor de la lista son necesarias en PowerShell; sin ellas se parte en dos argumentos
y el despliegue no encuentra sus objetivos.

## Licencia

Sin licencia de uso. El código está publicado para su lectura y revisión; todos los derechos
reservados.
