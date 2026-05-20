# SaaS Starter – React + Node + Mongo + Razorpay

A full-stack SaaS starter kit with modern UI and billing, built for founders and freelancers.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Routing:** React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Payments:** Razorpay (Test/Live)
- **UI:** Dark SaaS dashboard with stats, pricing, profile

## Features

- Email/password authentication (signup, login, protected routes)
- JWT-based API auth with middleware protection
- Dashboard with:
  - MRR, Active Customers, Churn, Response Time KPI cards
  - Revenue trend mini-chart (last 6 months, dummy data)
  - Recent activity feed (payments, churn, invites)
  - Recent clients list with name, domain, MRR, joined time
- Pricing page:
  - 3 plans (Starter, Growth, Enterprise)
  - Razorpay Checkout integration
  - Signature verification on backend
  - User subscription stored in Mongo (plan + status)
  - “Current plan” highlighting, disabled button for current plan
  - Toast notification on successful payment
- Profile page:
  - Avatar + header
  - Subscription summary
  - Form to update name and email
- Responsive layout:
  - Sidebar + navbar
  - Mobile sidebar overlay

## Getting Started (Local)

### 1. Backend

```bash
cd server
npm install
```

Create `.env` from `.env.example`:

```env
PORT=4000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=1d
RAZORPAY_KEY_ID=rzp_test_yourKeyId
RAZORPAY_KEY_SECRET=your_test_secret
```

Then start dev server:

```bash
npm run dev
```

Backend runs at `http://localhost:4000`.

### 2. Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Run dev:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Building for Production

### Frontend

```bash
cd client
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, etc.).

### Backend

- Use `npm start` in `server` (runs `node src/server.js`).
- Set env vars in your host’s dashboard (no `.env` committed).
- Set `CLIENT_URL` and `VITE_API_URL` to your deployed frontend URL.
- Switch Razorpay keys from test to live when ready.

## Deployment Notes

- **Environment variables:** keep secrets in host config (Railway, Render, etc.), not in source. [Matches `.env.example` keys]
- **NODE_ENV:** ensure production builds and `NODE_ENV=production` for best Express performance.
- **Monitoring:** add logs or an APM tool (optional) when going to real users.

## License

MIT (adjust if you prefer a different license)