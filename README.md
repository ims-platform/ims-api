# ims-api

Backend API for IMS Platform  
(Express, TypeScript, Supabase Client, Supabase CLI)

---

## ⚠️ Status

This repository contains the initial DevOps setup.  
The backend application has **not been fully initialized yet**.

The Backend Team is responsible for implementing the application logic.

---

## 🧱 Tech Stack

- Express.js
- TypeScript
- Supabase Client
- Supabase CLI
- Zod (validation)
- Brevo (emails)
- Vitest (testing)

---

## 🚀 Getting Started

### Install dependencies

pnpm install

### Run in development

pnpm dev

### Build project

pnpm build

### Start production server

pnpm start

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=
BREVO_API_KEY=
PORT=3000
NODE_ENV=development

---

## 🌍 Environments

| Environment | Description |
|------------|------------|
| development | Local environment |
| staging | Connected to Supabase staging |
| production | Connected to Supabase production |

⚠️ Never mix environments or credentials.

---

## 📁 Project Structure

src/
 ├── controllers/     # Request handling
 ├── routes/          # API routes
 ├── services/        # Business logic
 ├── modules/         # Domain modules
 ├── middlewares/     # Express middlewares
 ├── utils/           # Helpers
 ├── app.ts           # Express app configuration
 └── server.ts        # Server entry point

---

## 🔗 API

Base URL:

/api/v1

Example endpoint (required):

GET /api/v1/health

Response:

{ "status": "ok" }

---

## 🧪 Testing

Run tests:

pnpm test

---

## 🛡️ Development Rules

- Validate all inputs using **Zod**
- Use **Supabase Client** for all data operations
- Do NOT connect directly to PostgreSQL
- Keep controllers thin, move logic to services
- Follow modular architecture

---

## 🗄️ Database & Supabase

This project uses **Supabase Client** instead of direct database access.

- All database operations go through Supabase API
- No direct PostgreSQL connections are used
- Supabase CLI is used for migrations and local development

---

## ⚙️ Supabase CLI

Initialize project (if needed):

npx supabase init

Run locally:

npx supabase start

Apply migrations:

npx supabase db push

---

## ✅ Definition of Done (Backend)

A Pull Request will be approved only if:

- Project builds successfully
- No runtime errors
- No hardcoded credentials
- Environment variables are used
- Health endpoint `/api/v1/health` exists
- CI checks pass

---

## 🔄 CI/CD

- Pull Requests trigger GitHub Actions
- Build must pass before merge
- Tests (if present) must pass

---

## 👥 Responsibilities

| Role | Responsibility |
|-----|----------------|
| Backend | API implementation |
| DevOps | Infrastructure & CI/CD |
| QA | Testing & validation |

---

## 📌 Notes

- This is the core backend for IMS Platform
- Designed for scalability and future integrations
- Avoid breaking changes without coordination

---

## 🚧 Backend Initialization (To be done by Backend Team)

Suggested setup:

pnpm init
pnpm add express @supabase/supabase-js
pnpm add -D typescript ts-node-dev @types/node @types/express

npx tsc --init

---

## 🚀 Workflow

develop → staging → main

- develop: development
- staging: QA/testing
- main: production
