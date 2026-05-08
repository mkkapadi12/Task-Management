# TaskFlow

Full-stack task management app.

**Stack:** Node.js · Express · Prisma 7 · MySQL · React · Vite · Redux Toolkit · shadcn/ui

---

## Setup

### 1. Clone

git clone <repo-url>
cd taskflow

### 2. Backend

cd server
npm install
cp .env.example .env # fill in your values
npx prisma migrate dev
npx prisma generate
npm run dev

### 3. Frontend

cd client
npm install
cp .env.example .env.local # fill in your values
npm run dev

---

## Project structure

taskflow/
├── server/ → Express + Prisma backend
└── client/ → Vite + React frontend
