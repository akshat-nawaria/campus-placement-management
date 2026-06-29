# Campus Placement Management System

A full-stack monorepo application for managing university placement pipelines. Features role-based access control (RBAC), an automated eligibility engine, and strict policy enforcement for job offers.

## System Architecture

**Stack:** React 18, Node.js, Express, MongoDB
**Auth:** Google OAuth 2.0 + Stateless JWT (HTTP Headers)
**Storage:** Local file system (Multer) for PDF resumes

### Core Technical Features

- **Eligibility Engine:** Middleware that dynamically filters students based on Job Schema requirements (Batch, Branch, min CGPA, active backlogs).
- **Single-Offer Policy:** Upon `PUT /api/offers/:id/accept`, the backend updates the student profile flag `hasAcceptedOffer=true`, locking out all `POST /api/applications/:jobId/apply` routes globally.
- **Background Mailer:** Asynchronous job notification dispatching via Nodemailer (SMTP) triggered on job creation.
- **RBAC Matrix:**
  - `Student`: Read jobs, post applications, accept offers.
  - `Admin`: Full TPO access + Student portal testing (Dual-Role).
  - `TPO` / `SPC`: Create jobs, manage applications, issue offers.

---

## Local Development Setup

The project is structured into two isolated directories: `/backend` and `/frontend`.

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection string (Local or Atlas)
- Google Cloud Console Project (OAuth Client ID)

### 2. Environment Variables

Create a `.env` file in **both** directories:

**`backend/.env`**
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/placement_db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run the Servers

Open two terminal windows from the root of the project:

**Terminal 1 (API Server):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Client Server):**
```bash
cd frontend
npm install
npm run dev
```

---

## Directory Structure
```text
campus-placement-management/
├── backend/                  
│   ├── src/                  
│   │   ├── controllers/      # Business logic (Auth, Jobs, Students)
│   │   ├── middlewares/      # auth.middleware.js, multer.middleware.js
│   │   ├── models/           # Mongoose schemas (User, Student, Job, App, Offer)
│   │   ├── routes/           # Express router endpoints
│   │   └── utils/            # eligibility.js
│   └── uploads/              # Multer destination for PDF uploads
│
└── frontend/                 
    ├── src/
    │   ├── api/              # Axios interceptors and endpoints
    │   ├── components/       # Layouts, UI, and Shared components
    │   ├── context/          # AuthContext.jsx
    │   ├── pages/            # Role-specific views (tpo/ & student/)
    │   └── index.css         # Tailwind v4 theme configuration
    └── postcss.config.js     # @tailwindcss/postcss plugin
```
