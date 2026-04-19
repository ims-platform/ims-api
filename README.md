# ims-api
Backend API for IMS Platform (Express, TypeScript, Prisma, PostgreSQL, Supabase) 
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
SUPABASE_KEY=
BREVO_API_KEY=
PORT=3000
```

---

## 📁 Project Structure

```
src/
 ├── controllers/
 ├── routes/
 ├── services/
 ├── modules/
 ├── middlewares/
 ├── utils/
 ├── app.ts
 └── server.ts
```

---

## 🔗 API

Base URL:

```
/api/v1
```

Example endpoint:

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

* All inputs must be validated with **Zod**
* Use **Prisma** for all database access
* Keep controllers thin, logic in services
* Follow modular architecture

---

## 🔄 CI/CD

* Pull Requests trigger automated checks (GitHub Actions)
* Build and tests must pass before merging (when branch protection is enforced)

---

## 📌 Notes

* This repository is the core backend of IMS Platform
* Designed for scalability and future integrations (real-time, AI, analytics)

