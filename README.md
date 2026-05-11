# PostAgent

> Turn your daily code into LinkedIn posts that get you hired.

PostAgent is an AI-powered LinkedIn post generator built for developers running a daily coding streak. Connect your GitHub and LeetCode profiles, write a short daily story, and PostAgent uses Claude AI to generate an authentic, engaging LinkedIn post in seconds. Track your streak, review past posts, and build your personal brand while you code your way to a job.

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS v3              |
| Backend    | Node.js 20 + Express 5                         |
| Database   | PostgreSQL 16 + Prisma ORM                     |
| AI         | Anthropic Claude API (claude-sonnet-4-20250514)         |
| Deployment | Render (Web Service + Static Site + Managed DB) |

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 16 running locally
- An Anthropic API key

### Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your local PostgreSQL connection string, add your `ANTHROPIC_API_KEY`, and set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to any random strings.

Push the database schema:

```bash
npm run db:push
```

Start the dev server:

```bash
npm run dev
```

### Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Environment Variables

### Backend

| Key                | Description                          | Example                                        |
|--------------------|--------------------------------------|-------------------------------------------------|
| `DATABASE_URL`     | PostgreSQL connection string         | `postgresql://user:pass@localhost:5432/postagent`|
| `JWT_ACCESS_SECRET`| Secret for signing access tokens     | `my-access-secret-123`                          |
| `JWT_REFRESH_SECRET`| Secret for signing refresh tokens   | `my-refresh-secret-456`                         |
| `ANTHROPIC_API_KEY`| Anthropic API key for Claude         | `sk-ant-...`                                    |
| `CLIENT_ORIGIN`    | Frontend URL for CORS                | `http://localhost:5173`                          |
| `NODE_ENV`         | Environment mode                     | `development` or `production`                   |
| `PORT`             | Server port                          | `4000`                                          |

### Frontend

| Key            | Description              | Example                        |
|----------------|--------------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL     | `http://localhost:4000/api`    |

## Deploying to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates all 3 services automatically
5. Go to **postagent-backend** service → Environment → manually add `ANTHROPIC_API_KEY`
6. Go to **postagent-frontend** service → Environment → set `VITE_API_URL` to your backend URL (e.g., `https://postagent-backend.onrender.com/api`)
7. After frontend deploys, copy its URL and add it as `CLIENT_ORIGIN` in the backend service
8. Redeploy backend

## API Endpoints

| Method | Route                | Auth     | Description                        |
|--------|----------------------|----------|------------------------------------|
| POST   | `/api/auth/register` | Public   | Create a new user account          |
| POST   | `/api/auth/login`    | Public   | Log in with email and password     |
| POST   | `/api/auth/refresh`  | Cookie   | Refresh access token               |
| POST   | `/api/auth/logout`   | Cookie   | Log out and clear refresh token    |
| GET    | `/api/user/profile`  | Bearer   | Get current user profile           |
| PATCH  | `/api/user/profile`  | Bearer   | Update profile (name, usernames)   |
| POST   | `/api/generate`      | Bearer   | Generate a LinkedIn post           |
| GET    | `/api/posts`         | Bearer   | Get paginated post history         |
| DELETE | `/api/posts/:id`     | Bearer   | Delete a post                      |
| GET    | `/health`            | Public   | Health check                       |

## License

MIT
