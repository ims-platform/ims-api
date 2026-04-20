# ims-api
API Backend para la Plataforma IMS (Express, TypeScript, Supabase Client, Supabase CLI)

## ⚠️ Estado
Este repositorio contiene la configuración inicial de DevOps. La aplicación backend aún no ha sido completamente inicializada.
El Equipo de Backend es responsable de implementar la lógica de la aplicación.

## 🧱 Stack Tecnológico
- Express.js
- TypeScript
- Supabase Client
- Supabase CLI
- Zod (validación)
- Brevo (emails)
- Vitest (testing)

## 🚀 Inicio Rápido

### Instalar dependencias
pnpm install

### Ejecutar en desarrollo
pnpm dev

### Compilar el proyecto
pnpm build

### Iniciar servidor en producción
pnpm start

## ⚙️ Variables de Entorno
Crear un archivo `.env` basado en `.env.example`:
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
BREVO_API_KEY=
PORT=3000
NODE_ENV=development

## 🌍 Entornos
| Entorno | Descripción |
|---------|-------------|
| development | Entorno local |
| staging | Conectado a Supabase staging |
| production | Conectado a Supabase producción |

⚠️ Nunca mezclar entornos ni credenciales.

## 📁 Estructura del Proyecto
src/
├── controllers/ # Manejo de requests

├── routes/ # Rutas de la API

├── services/ # Lógica de negocio

├── modules/ # Módulos de dominio

├── middlewares/ # Middlewares de Express

├── utils/ # Helpers

├── app.ts # Configuración de Express

└── server.ts # Punto de entrada del servidor

## 🔗 API
URL Base:
/api/v1

Endpoint requerido:
GET /api/v1/health

Respuesta:
{ "status": "ok" }

## 🧪 Testing
Ejecutar tests:
pnpm test

## 🛡️ Reglas de Desarrollo
- Validar todos los inputs usando Zod
- Usar Supabase Client para todas las operaciones de datos
- NO conectarse directamente a PostgreSQL
- Mantener los controllers ligeros, mover la lógica a services
- Seguir arquitectura modular

## 🗄️ Base de Datos & Supabase
Este proyecto usa Supabase Client en lugar de acceso directo a la base de datos.
- Todas las operaciones de base de datos van a través de la API de Supabase
- No se usan conexiones directas a PostgreSQL
- Supabase CLI se usa para migraciones y desarrollo local

## ⚙️ Supabase CLI

### Inicializar proyecto (si es necesario)
npx supabase init

### Ejecutar localmente
npx supabase start

### Aplicar migraciones
npx supabase db push

## ✅ Definición de Done (Backend)
Un Pull Request será aprobado únicamente si:
- El proyecto compila correctamente
- No hay errores en tiempo de ejecución
- No hay credenciales hardcodeadas
- Se usan variables de entorno
- Existe el endpoint `/api/v1/health`
- Los checks de CI pasan
- Los checks de Lint pasan

## 🔄 CI/CD
- Los Pull Requests activan GitHub Actions
- Lint, build y tests son validados en el CI
- El build debe pasar antes de hacer merge
- Los tests (si existen) deben pasar

## 🔒 Reglas de Protección de Ramas
Se encuentran configuradas reglas de protección para `main`, `staging` y `develop`.

### Reglas configuradas
- No se permite push directo a ninguna de las tres ramas
- Todo cambio debe ingresar mediante Pull Request
- Los siguientes checks del CI deben pasar antes de hacer merge:
  - Lint
  - Build
  - Test


## 👥 Responsabilidades
| Rol | Responsabilidad |
|-----|----------------|
| Backend | Implementación de la API |
| DevOps | Infraestructura & CI/CD |
| QA | Testing & validación |

## 📌 Notas
- Este es el backend principal de la Plataforma IMS
- Diseñado para escalabilidad e integraciones futuras
- Evitar cambios que rompan funcionalidad sin coordinación previa

## 🚧 Inicialización del Backend (A cargo del Equipo de Backend)
Setup inicial sugerido:
pnpm init
pnpm add express @supabase/supabase-js
pnpm add -D typescript ts-node-dev @types/node @types/express
npx tsc --init

## 🧪 Scripts Esperados
El proyecto backend debe proveer al menos estos scripts:
- pnpm lint
- pnpm build
- pnpm test
- pnpm dev

## 🚀 Flujo de Trabajo
develop → staging → main

- develop: desarrollo
- staging: QA/testing
- main: producción
