# PJ Essence — Deployment Guide

## 1. Vercel SPA & API Deployment

PJ Essence is optimized for deployment on Vercel with zero-configuration routing for both the React client SPA and serverless API endpoints.

### 1.1 Requirements
- Node.js 18+ (tested with v20 / v26)
- Vercel CLI (`npm i -g vercel`) or GitHub Vercel integration

### 1.2 Routing Architecture (`vercel.json`)
The application defines a strict split:
- Requests matching `/api/*` are directed to the `/api` serverless handler directory.
- All non-API requests route to `/index.html` to allow React Router client-side deep linking without 404 errors upon browser reload.

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/|.*\\..*).*)", "destination": "/index.html" }
  ]
}
```

---

## 2. Environment Variables Configuration

Set these variables in the **Vercel Project Settings > Environment Variables**:

| Variable Name | Environment | Purpose |
|---------------|-------------|---------|
| `VITE_USE_MOCK_DATA` | Preview / Staging | Set `false` for live Firestore, `true` for offline/mock demo |
| `VITE_FIREBASE_API_KEY` | Production | Firebase Web Client API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Production | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Production | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET`| Production | Cloud Storage Bucket URL |
| `VITE_STRIPE_PUBLIC_KEY` | Production | Stripe Publishable Key |
| `STRIPE_SECRET_KEY` | Production (Secret) | Serverless payment fulfillment |
| `STRIPE_WEBHOOK_SECRET` | Production (Secret) | Cryptographic signature verification |
| `FIREBASE_ADMIN_PRIVATE_KEY`| Production (Secret) | Admin SDK credentials for serverless `/api` |

---

## 3. Build & Verification Commands

```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Preview build locally
npm run preview
```

The output bundle is emitted into `dist/`.
