# Web Agency HRM - Backend

The REST API backend for the Web Agency HRM System. Built with Node.js and Express to handle data persistence, authentication, and real-time events.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Auth:** JSON Web Tokens (JWT) & Bcrypt
- **I/O Validation:** Zod & Express-validator
- **Real-time:** Socket.io
- **Uploads:** Multer

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or cloud instance)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd "HRM backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root of the `HRM backend` directory with the following variables:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrm_db  # or your Atlas URI
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000              # For CORS configuration
```

### Running Locally

Start the development server with hot-reload:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## 🗄️ Database Seeding

To verify the database connection and populate initial data:

```bash
npm run seed
```

## 📡 API Endpoints Overview

- **Auth**: `/api/auth` (Login, Register, Me)
- **Users**: `/api/users` (CRUD, Profile)
- **Tasks**: `/api/tasks` (CRUD, Status updates)
- **Projects**: `/api/projects` (Management)

## 📂 Project Structure

- `/src/server.ts`: Entry point.
- `/src/routes`: API Route definitions.
- `/src/controllers`: Request handlers and logic.
- `/src/models`: Mongoose schemas.
- `/src/middleware`: Auth and error handling middleware.
- `/src/scripts`: Utility scripts (seeding, etc.).
