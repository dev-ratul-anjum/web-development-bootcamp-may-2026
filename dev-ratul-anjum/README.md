# Dialog - Real-Time Chat Application

## 1. Project Overview
**Dialog** is a modern, full-stack real-time chat application designed to provide seamless and instant communication between users. Built with a robust architecture, it supports features like direct messaging, real-time presence, social authentication, file attachments, and user management (blocking/reporting).

## 2. Tech Stack

### Frontend
- **Framework:** Next.js (App Router), React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management & Data Fetching:** React Query (TanStack Query)
- **Real-Time Communication:** `socket.io-client`
- **Validation:** Zod
- **Icons:** Lucide React

### Backend
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-Time Communication:** `socket.io`
- **Authentication:** Passport.js (Google, Twitter, GitHub, Facebook), JWT (`jsonwebtoken`), `express-session`
- **Password Hashing:** `bcryptjs`
- **Validation:** Zod
- **File Uploads:** Multer, Cloudinary

---

## 3. Features
- **Authentication:** Email/Password registration, Social Logins (Google, Twitter, GitHub, Facebook), JWT-based auth, secure cookies.
- **Real-Time Messaging:** Instant message delivery, online presence.
- **Conversations:** Private one-on-one chats.
- **Message Management:** Text messages, file attachments (via Cloudinary), and "Mark as Star" functionality.
- **User Management:** Profile updates, bio, profile pictures.
- **User Moderation:** Block and report users.
- **Validation & Error Handling:** Strict schema validation with Zod and global error handling middlewares.

---

## 4. Architecture / Folder Structure

### Backend (`/backend`)
```text
backend/
├── src/
│   ├── configs/       # Configuration files (e.g., Cloudinary)
│   ├── middlewares/   # Express middlewares (auth, error handler, validation)
│   ├── modules/       # Feature-based modules (auth, user, conversation, message)
│   ├── prisma/        # Prisma schema and configuration files
│   ├── services/      # Reusable business logic
│   ├── socket/        # Socket.io initialization and event handlers
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions (env, corsOptions)
```

### Frontend (`/frontend`)
```text
frontend/
├── src/
│   ├── actions/       # Server actions or API calls
│   ├── app/           # Next.js App Router pages (login, sign-up, rooms, profile, etc.)
│   ├── components/    # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library configurations (e.g., React Query)
│   ├── providers/     # Global state providers (QueryClient, SocketProvider)
│   ├── schema/        # Zod validation schemas
│   └── utils/         # Helper utilities
```

---

## 5. Environment Variables

Create a `.env` file in the respective directories based on the templates below.

### Backend (`backend/.env.example`)
```env
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dialog

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Authentication Secrets
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
SESSION_SECRET=your_session_secret
ACCESS_TOKEN_NAME=access_token
ACCESS_TOKEN_EXPIRES_IN=1d

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

TWITTER_CONSUMER_KEY=your_twitter_key
TWITTER_CONSUMER_SECRET=your_twitter_secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback

FACEBOOK_APP_ID=your_facebook_id
FACEBOOK_APP_SECRET=your_facebook_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Frontend Redirects
FRONTEND_OAUTH_SUCCESS_REDIRECT_URL=http://localhost:3000/rooms
FRONTEND_LOGIN_URL=http://localhost:3000/login
```

> Note: The frontend uses proxy routes or generic environment configurations not explicitly committed to an `.env.example`, but typically requires API base URLs (e.g., `NEXT_PUBLIC_API_URL`).

---

## 6. Installation & Setup

### Prerequisites
- Node.js (v18+)
- Yarn package manager
- PostgreSQL Database

### Backend Setup
1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in the required values.
4. **Push database schema & generate Prisma Client:**
   ```bash
   yarn prisma:push
   yarn prisma:generate
   ```
5. **Run the development server:**
   ```bash
   yarn dev
   ```

### Frontend Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Run the development server:**
   ```bash
   yarn dev
   ```
The frontend will be available at `http://localhost:3000`.

---

## 7. Prisma Usage
This project uses Prisma as an ORM to interact with a PostgreSQL database. The schemas are split modularly inside `backend/src/prisma/schema/` (e.g., `user.prisma`, `message.prisma`).

**Useful Commands:**
- `yarn prisma:generate` - Generates the Prisma Client based on the schema.
- `yarn prisma:push` - Syncs the database schema without creating a migration file (good for prototyping).
- `yarn prisma:migrate` - Applies migrations for production stability.
- `yarn prisma:studio` - Opens a visual database browser.

---

## 8. API Routes Overview
The API is structured modularly. Base path: `/api`

- **`/api/auth`**: Authentication endpoints (login, signup, OAuth callbacks, logout).
- **`/api/user`**: User profile management, updating avatars/bio, user blocking, and reporting.
- **`/api/conversation`**: Creating and fetching conversations/chat rooms between users.
- **`/api/message`**: Sending messages, fetching message history, handling attachments.

---

## 9. Frontend Overview
- **Architecture:** Built with Next.js App Router for server-side rendering and streamlined routing.
- **Routing Structure:** Private/protected pages (`/rooms`, `/profile`, `/settings`) and public pages (`/login`, `/sign-up`).
- **State & Data Fetching:** Utilizes **React Query** (`@tanstack/react-query`) wrapped in a global `QueryClientProvider`. It manages caching, background refetching, and API synchronization.
- **Real-Time Integration:** A global `SocketProvider` wraps the application to maintain a persistent WebSocket connection to the Express server for live events.

---

## 10. Security Features
- **JWT & Session Auth:** Secures private endpoints via Bearer tokens and short-lived HTTP-only sessions for OAuth.
- **Password Hashing:** Uses `bcryptjs` for secure credential storage.
- **CORS Configuration:** Strictly configured to allow designated frontend origins.
- **Validation:** All incoming requests are validated against Zod schemas.
- **Secure Cookies:** Cookies are marked `httpOnly`, with `secure` and `sameSite` policies adjusting based on the production environment.
- **Error Handling:** Centralized global error and 404 handler middleware prevent stack trace leaks.

---

## 11. Scripts

### Backend (`backend/package.json`)
- `yarn dev`: Starts the development server using `tsx watch`.
- `yarn build`: Compiles TypeScript to JavaScript into the `dist` folder.
- `yarn start`: Runs the compiled production server.
- `yarn lint` / `yarn format`: Runs ESLint and Prettier.

### Frontend (`frontend/package.json`)
- `yarn dev`: Starts Next.js development server.
- `yarn build`: Builds the Next.js app for production.
- `yarn start`: Starts Next.js production server.
- `yarn lint`: Runs ESLint.

---

## 12. Deployment / Production Notes
- **Trust Proxy:** The Express backend is configured with `app.set("trust proxy", 1)` to handle secure cookies properly behind reverse proxies (like Nginx, Render, or Railway).
- **Build Process:** The backend must be built using `yarn build` before deploying, generating the Prisma client first (`prebuild` script).
- **Frontend Hosting:** The Next.js frontend is fully compatible with Vercel or standard Node.js Docker containers.
