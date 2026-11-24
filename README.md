# PJ Essence — Haute Parfumerie & Bespoke Fragrance Commerce

A production-grade, responsive luxury fragrance-commerce platform built with React, Vite, Tailwind CSS, Framer Motion, and a decoupled architecture (Repository, Service Layer, Factory, Strategy, and Finite State Machine patterns).

---

## 🏛️ Brand Palette & Aesthetic

- **Burgundy**: `#6B1E2B` (Velvet accents, primary call-to-actions, hero highlights)
- **Bronze**: `#B68A4C` (Metallic foil details, badges, gold shimmer)
- **Cream**: `#F8F2EA` (Primary ambient background)
- **Walnut**: `#5C4033` (Wood diffusers, grounding accents)
- **Soft Taupe**: `#B6A89C` (Muted borders, subtle typography)

---

## 🚀 Key Features

### 1. Natural-Language Scent Discovery Quiz
- Customers don't need perfumery jargon or chemistry knowledge.
- Questions focus on mood, atmosphere, and climate.
- **Session-Aware Conditional Branching**:
  - Selecting **Winter** branches to cold-weather warmth textures (resinous agarwood, bourbon vanilla, aged woods).
  - Selecting **Summer** branches to refreshing accords (Tunisian neroli, sea salt spray, crushed fig leaf).

### 2. Extensible Recommendation Engine (Strategy Pattern)
- Decoupled from React components.
- Dynamically switch between:
  - `RuleBasedStrategy`: Multi-dimensional weighted scoring (warmth, intensity, freshness, sweetness, note overlaps).
  - `SeasonalStrategy`: Climate temperature synergy.
  - `HybridStrategy`: Blended behavioral and olfactory scoring.

### 3. Bespoke Perfume Atelier (`/custom-perfume`)
- Formulate custom fragrances by selecting Base (Soul), Heart (Identity), and Top (First Impression) notes.
- Select custom crystal flacon hues and stopper finishes.
- Live preview of personalized diamond-engraved metal plaque cartouche.
- Directly added to cart as a bespoke commission ($260).

### 4. Product Polymorphism (Factory Pattern)
- Normalized handling for:
  - `PERFUME`: Extrait de Parfum concentration, crystal flacon, intimate sillage.
  - `CAR_PERFUME`: Hand-carved solid walnut magnetic vent clip, ceramic core refills.
  - `ROOM_FRESHENER`: Palatial micro-mist diffuser and reed flacons covering up to 900 sq ft.

### 5. Order State Machine
- Strict deterministic state transitions:
  `PENDING_PAYMENT` ➔ `PAID` ➔ `FORMULA_CONFIRMED` ➔ `IN_PRODUCTION` ➔ `QUALITY_CHECK` ➔ `PACKED` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.
- Prevents invalid or out-of-order transitions.
- Client-side payment claims are never trusted; payments are authenticated via serverless webhook verification.

### 6. Master Parfumeur Admin Suite (`/admin`)
- Role-protected routes.
- Executive metrics: Revenue, Commissions, VIP Clients, Inventory Health, Low Stock Alerts.
- Product CRUD with note pyramid and image management.
- Order management with state transition controls.
- Quiz question conditional rule builder.
- Seasonal campaign manager.
- Cloud storage media asset vault.

---

## 🛠️ Technology Stack

- **Framework**: React 18 SPA + Vite 5
- **Styling**: Tailwind CSS with custom luxury theme extensions + CSS variables
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Architecture**:
  - Feature-First Folder Organization
  - Repository Pattern (Cloud Firestore + In-Memory Mock Fallback)
  - Service Layer (`catalogService`, `quizService`, `orderService`, `recommendationService`)
  - Strategy Pattern (`recommendationStrategies.js`)
  - Factory Pattern (`productFactory.js`)
  - Finite State Machine (`orderStateMachine.js`)
  - Adapter Pattern (Payment, Storage, Shipping, Notification)
- **Deployment**: Vercel SPA with rewrite rules (`vercel.json`) and `/api` serverless handlers

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Fast Evaluation Demo Credentials
- Click the user icon in the header to open the authentication modal.
- Click **"Demo Customer"** to log in as Countess Genevieve de Mornay.
- Click **"Master Admin"** to instantly unlock the `/admin` portal.

---

## 📚 Technical Documentation

- [HLD.md](file:///c:/Users/Creat/Downloads/PJ%20Essence/HLD.md) — High-Level Architecture & System Context
- [LLD.md](file:///c:/Users/Creat/Downloads/PJ%20Essence/LLD.md) — Low-Level Component Design & Patterns
- [API.md](file:///c:/Users/Creat/Downloads/PJ%20Essence/API.md) — RESTful API Specification
- [DATA_MODEL.md](file:///c:/Users/Creat/Downloads/PJ%20Essence/DATA_MODEL.md) — Firestore Collections & Entity Relationships
- [DEPLOYMENT.md](file:///c:/Users/Creat/Downloads/PJ%20Essence/DEPLOYMENT.md) — Vercel & Firebase Deployment Guide
# PJ_Essence_
