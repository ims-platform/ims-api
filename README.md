# ims-api

Backend API for IMS Platform
(Express, TypeScript, Prisma, PostgreSQL, Supabase)

---

## ⚠️ Status

This repository contains the initial DevOps setup.
The backend application has **not been initialized yet**.

The Backend Team is responsible for implementing the application logic.

---

## 🧱 Tech Stack

* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL (Supabase)
* Zod (validation)
* Brevo (emails)
* Vitest (testing)

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build project

```bash
npm run build
```

### Start production server

```bash
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
BREVO_API_KEY=
PORT=3000
NODE_ENV=development
```

---

## 🌍 Environments

| Environment | Description                      |
| ----------- | -------------------------------- |
| development | Local environment                |
| staging     | Connected to Supabase staging    |
| production  | Connected to Supabase production |

⚠️ Never mix environments or credentials.

---

## 📁 Project Structure

```
src/
 ├── controllers/     # Request handling
 ├── routes/          # API routes
 ├── services/        # Business logic
 ├── modules/         # Domain modules
 ├── middlewares/     # Express middlewares
 ├── utils/           # Helpers
 ├── app.ts           # Express app configuration
 └── server.ts        # Server entry point
```

---

## 🔗 API

Base URL:

```
/api/v1
```

Example endpoint (required):

```
GET /api/v1/health
```

Response:

```json
{ "status": "ok" }
```

---

## 🧪 Testing

Run tests:

```bash
npm run test
```

---

## 🛡️ Development Rules

* Validate all inputs using **Zod**
* Use **Prisma** for database access
* Do not access DB directly unless justified
* Keep controllers thin, move logic to services
* Follow modular architecture

---

## ✅ Definition of Done (Backend)

A Pull Request will be approved only if:

* Project builds successfully
* No runtime errors
* No hardcoded credentials
* Environment variables are used
* Health endpoint `/api/v1/health` exists
* CI checks pass

---

## 🔄 CI/CD

* Pull Requests trigger GitHub Actions
* Build must pass before merge
* Tests (if present) must pass

---

## 👥 Responsibilities

| Role    | Responsibility         |
| ------- | ---------------------- |
| Backend | API implementation     |
| DevOps  | Infrastructure & CI/CD |
| QA      | Testing & validation   |

---

## 📌 Notes

* This is the core backend for IMS Platform
* Designed for scalability and future integrations
* Avoid breaking changes without coordination

---

## 🚧 Backend Initialization (To be done by Backend Team)

Suggested setup:

```bash
npm init -y
npm install express
npm install -D typescript ts-node-dev @types/node @types/express

npx tsc --init
npx prisma init
```

---

## 🚀 Workflow

```
develop → staging → main
```

* `develop`: development
* `staging`: QA/testing
* `main`: production
