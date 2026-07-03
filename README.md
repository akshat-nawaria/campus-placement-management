# CampusHire — University Placement Pipeline & Offer Management

**CampusHire** is a highly robust, full-stack application that serves as the core placement engine for universities. Engineered to streamline the entire recruitment lifecycle, it automates eligibility verification, prevents multi-offer hoarding, and accelerates the hiring process.

The application is structured as a modern Monorepo, containing a secure Node.js backend API and a premium React/Vite frontend interface.

## Key Features & Architecture

### Backend & Eligibility Engine
The backend doesn't just manage data; it dynamically enforces recruitment policies to ensure fairness and efficiency.

- **Automated Eligibility Engine:** Middleware dynamically filters students based on complex Job Schema requirements (Batch, Branch, minimum CGPA, active backlogs). Students who don't meet the strict criteria are preemptively blocked from applying.
- **Single-Offer Policy:** To ensure fair distribution of opportunities, upon `PUT /api/offers/:id/accept`, the backend updates the student profile flag `hasAcceptedOffer=true`. This locks out all further `POST /api/applications/:jobId/apply` routes globally for that student.
- **Bulk Offer Issuance:** TPOs can effortlessly bulk issue offers to multiple students simultaneously, significantly reducing administrative overhead during mass recruitment drives.
- **Role-Based Access Control (RBAC):** A strict hierarchical authorization matrix.
  - `Student`: Read jobs, post applications, manage profiles, accept offers.
  - `TPO / SPC`: Create jobs, manage applications, issue offers (single/bulk).
  - `Admin`: Full TPO access with Dual-Role capabilities for student portal testing.

### Premium Frontend Interface
A sleek, responsive, and highly interactive user interface designed to feel like a modern, enterprise-grade talent acquisition platform.

- **Dual Dashboards:** Distinctly designed dashboard experiences tailored specifically for the Student portal and the TPO management console.
- **React Context Auth:** Global state management utilizing `AuthContext` to seamlessly protect private routes and manage JWT tokens.
- **Axios Interceptors:** Automatic injection of Authorization headers and global error handling for network requests.

### Automated Notification System
A non-blocking background email service powered by Nodemailer and Gmail OAuth2/App Passwords. Users receive instant email updates for:

- **Registration:** Welcome emails upon creating a student profile.
- **Job Postings:** Alerts when a new job matching their profile is opened.
- **Offer Issuance:** Immediate notifications when a student receives a placement offer.

## Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM, Axios, Tailwind CSS v4, React Query |
| **Backend** | Node.js, Express.js, Cors, Multer |
| **Database** | MongoDB, Mongoose ORM |
| **Security** | JSON Web Tokens (JWT), Google OAuth 2.0 |
| **Services** | Nodemailer (SMTP Emailing) |

## Installation & Local Setup

### Prerequisites
- Node.js installed (v18+)
- A MongoDB cluster (Local or Atlas)
- Google Cloud Console Project (for OAuth Client ID)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd campus-placement-management
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/placement_db
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth Setup
GOOGLE_CLIENT_ID=your_google_client_id

# Email Configuration (Use Gmail App Passwords)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```
The frontend will start instantly at `http://localhost:5173`.

## API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /google` - Authenticate via Google OAuth 2.0 and issue a stateless JWT.
- `GET /me` - Retrieve current authenticated user profile.
- `POST /logout` - Invalidate the current session from the client side.

### Jobs (`/api/jobs`)
- `POST /` - Create a new job posting (TPO only, triggers notification).
- `GET /` - Retrieve all available jobs (Filtered for students based on eligibility).
- `GET /:id` - Retrieve job details.

### Applications (`/api/applications`)
- `POST /:jobId/apply` - Apply for a specific job (Student only, blocked if already placed).
- `GET /job/:jobId` - Retrieve all applications for a specific job (TPO only).

### Offers (`/api/offers`)
- `POST /` - Issue a new placement offer to a student (TPO only).
- `POST /bulk` - Bulk issue multiple offers simultaneously.
- `PUT /:id/accept` - Accept an offer (Student only, triggers Single-Offer Policy lockout).

## Security Flow: Stateless JWT & Middleware
All private routes are protected using a stateless JWT mechanism passed via HTTP Headers. The `authMiddleware` intercepts all requests, verifies the JWT, and dynamically attaches the user role. Crucial administrative endpoints further enforce a secondary RBAC check to ensure Students cannot access TPO functionalities.

---
*Built with precision to bridge the gap between education and employment.*
