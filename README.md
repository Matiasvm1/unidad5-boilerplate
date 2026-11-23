# MedPortal — Frontend (Unidad 5)

SPA en React para la gestión de turnos médicos. Tiene dos portales sobre el mismo backend:

- **Portal del paciente**: el paciente ingresa con email y DNI, reserva turnos según la agenda de cada médico y gestiona sus turnos.
- **Panel de administración**: el administrador gestiona médicos, especialidades y agendas de disponibilidad, y consulta los turnos de los pacientes.

## Stack

| Herramienta                                                | Uso                                                      |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| [React 19](https://react.dev) + [Vite 7](https://vite.dev) | UI y servidor de desarrollo / build                      |
| [React Router 7](https://reactrouter.com)                  | Ruteo y rutas protegidas por rol                         |
| [Axios](https://axios-http.com)                            | Cliente HTTP con interceptores (token y sesión expirada) |
| [React Hook Form](https://react-hook-form.com)             | Formularios y validación                                 |
| [Tailwind CSS 4](https://tailwindcss.com)                  | Estilos                                                  |
| ESLint + Prettier                                          | Lint y formato                                           |

## Requisitos

- Node.js 20.19+ o 22.12+ (requisito de Vite 7) y npm.
- El backend del TFI corriendo y accesible.

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda en <http://localhost:5173>. El puerto es fijo (`strictPort`): el backend solo permite CORS desde ese origen, así que si el 5173 está ocupado Vite falla en vez de cambiar de puerto. Liberá el puerto y volvé a correrlo.

### Variables de entorno

| Variable           | Descripción                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `VITE_BACKEND_URL` | URL base del backend. Todas las llamadas de la API se resuelven contra ella (por ejemplo `api/doctors`). |

- `.env.example` documenta las variables necesarias.
- `.env.development` es el que usa `npm run dev`; cambiá ahí `VITE_BACKEND_URL` según dónde corra tu backend.
- Para overrides personales usá `.env.development.local` (ignorado por Git).

## Scripts

| Comando                | Qué hace                                   |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo en el puerto 5173   |
| `npm run build`        | Build de producción en `dist/`             |
| `npm run preview`      | Sirve localmente el build de `dist/`       |
| `npm run lint`         | Corre ESLint sobre el proyecto             |
| `npm run format`       | Formatea todo con Prettier                 |
| `npm run format:check` | Verifica el formato sin modificar archivos |

## Rutas

| Ruta                              | Acceso          | Pantalla                                         |
| --------------------------------- | --------------- | ------------------------------------------------ |
| `/login`                          | Público         | Login de paciente (email + DNI, nombre opcional) |
| `/admin/login`                    | Público         | Login de administrador (email + contraseña)      |
| `/`                               | `PACIENTE`      | Inicio del paciente: reservar turno              |
| `/appointments`                   | `PACIENTE`      | Mis turnos                                       |
| `/admin/home`                     | `ADMINISTRADOR` | Resumen con totales y directorio de médicos      |
| `/admin/doctors`                  | `ADMINISTRADOR` | Listado de médicos                               |
| `/admin/doctors/new`              | `ADMINISTRADOR` | Alta de médico                                   |
| `/admin/doctors/availability`     | `ADMINISTRADOR` | Agenda de disponibilidad (elegir médico)         |
| `/admin/doctors/:id/availability` | `ADMINISTRADOR` | Agenda de disponibilidad de un médico            |
| `/admin/patients`                 | `ADMINISTRADOR` | Búsqueda de turnos de pacientes                  |
| `/admin/specialties`              | `ADMINISTRADOR` | Listado de especialidades                        |
| `/admin/specialties/new`          | `ADMINISTRADOR` | Alta de especialidad                             |

Cualquier otra ruta redirige a `/`.

## Autenticación y sesión

- El login devuelve `{ token, role }`; el rol (`ADMINISTRADOR` o `PACIENTE`) decide a qué portal se entra.
- La sesión se guarda en `sessionStorage` bajo la clave `medportal.session`: dura lo que la pestaña.
- `ProtectedRoute` deja pasar solo a los roles permitidos; `GuestRoute` manda al inicio de su rol a quien ya tiene sesión y entra a un login.
- El interceptor de Axios agrega `Authorization: Bearer <token>` a cada request.
- Si el backend responde `401` fuera del login, se borra la sesión y se redirige al login que corresponde con el aviso "Tu sesión expiró. Volvé a ingresar" o "Tenés que iniciar sesión". Un `401` en el login se muestra en el formulario (credenciales incorrectas).

## Endpoints consumidos

| Método                    | Endpoint                                   | Uso                          |
| ------------------------- | ------------------------------------------ | ---------------------------- |
| `POST`                    | `api/auth/admin/login`                     | Login de administrador       |
| `POST`                    | `api/auth/patient/login`                   | Login de paciente            |
| `GET` / `POST` / `DELETE` | `api/doctors`, `api/doctors/:id`           | Médicos                      |
| `GET`                     | `api/doctors/:id/slots`                    | Horarios libres de un médico |
| `GET` / `POST` / `DELETE` | `api/specialties`, `api/specialties/:id`   | Especialidades               |
| `GET`                     | `api/doctors/:id/availabilities`           | Agenda mensual de un médico  |
| `POST` / `PUT`            | `api/availabilities`                       | Alta y edición de agendas    |
| `GET` / `POST` / `DELETE` | `api/appointments`, `api/appointments/:id` | Turnos                       |
| `GET`                     | `api/appointments/patient`                 | Turnos del paciente logueado |
| `GET`                     | `api/appointments/search`                  | Búsqueda de turnos (admin)   |

El contrato exacto de cada endpoint lo define el backend; los servicios de cada módulo (`src/modules/*/services`) son el único lugar donde se llama a la API.

## Estructura del proyecto

El código se organiza por dominio (_screaming architecture_): cada carpeta de `src/modules` es una funcionalidad del negocio.

```text
src/
├── main.jsx              # Punto de entrada
├── App.jsx               # AuthProvider + RouterProvider
├── router.jsx            # Definición de rutas
├── index.css, elements.css
└── modules/
    ├── auth/             # Login de admin, AuthProvider, ProtectedRoute, GuestRoute
    ├── patients/         # Portal del paciente: reserva y mis turnos
    ├── dashboard/        # Layout del admin, sidebar y resumen
    ├── doctors/          # ABM de médicos
    ├── specialties/      # ABM de especialidades
    ├── availabilities/   # Agenda semanal de cada médico
    ├── appointments/     # Búsqueda de turnos (admin)
    └── shared/           # Código común
        ├── api/          # Instancia de Axios, errores y sesión
        ├── components/   # Atomic design: atoms, molecules, organisms, templates
        ├── constants/    # Roles, estados de turno y de médico
        ├── hooks/        # Hooks reutilizables (async, paginación, debounce...)
        ├── services/     # Catálogos compartidos
        └── utils/        # Fechas y errores de formulario
```

Dentro de cada módulo se repite la misma convención:

- `pages/`: pantallas conectadas a una ruta.
- `components/`: piezas de UI del módulo.
- `hooks/`: lógica de estado y de carga de datos; las páginas no llaman a la API directamente.
- `services/`: llamadas HTTP al backend.

## Estados de turno

| Valor del backend | Se muestra como |
| ----------------- | --------------- |
| `BOOKED`          | Confirmado      |
| `ATTENDED`        | Completado      |
| `CANCELLED`       | Cancelado       |
| `NO_SHOW`         | Ausente         |

## Problemas comunes

- **`Port 5173 is already in use`**: otro proceso usa el puerto. Cerralo; no cambies el puerto o el backend va a rechazar las requests por CORS.
- **Errores de CORS o `Network Error`**: revisá que el backend esté levantado y que `VITE_BACKEND_URL` apunte a él. Después de cambiar un `.env`, reiniciá `npm run dev`.
- **Te saca al login todo el tiempo**: el token expiró o es inválido; volvé a iniciar sesión.
