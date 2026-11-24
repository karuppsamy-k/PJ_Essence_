# PJ Essence — Low-Level Design (LLD)

## 1. Directory Structure

```text
src/
├── app/                      # App router, providers, layout wrappers
│   ├── App.jsx
│   ├── routes.jsx
│   └── Layout.jsx
├── components/               # Universal design system components
│   ├── ui/                   # Buttons, inputs, modals, badges, cards, sliders
│   ├── layout/               # Header, Footer, AdminSidebar, MobileNav
│   └── shared/               # FragrancePyramid, NotePill, RatingStars
├── features/                 # Domain-driven feature modules
│   ├── auth/                 # AuthContext, LoginModal, ProtectedRoute
│   ├── catalog/              # ProductGrid, ProductCard, ProductDetail, Filters
│   ├── custom-perfume/       # AtelierBuilder, NoteSelector, BottlePreview
│   ├── quiz/                 # QuizFlow, QuestionCard, SessionBranching
│   ├── recommendation/       # RecommendationEngine, strategies/, ProfileSummary
│   ├── cart/                 # CartDrawer, CartItem, OrderSummary
│   ├── checkout/             # CheckoutStepper, AddressForm, PaymentStep
│   └── admin/                # AdminDashboard, ProductManager, OrderManager, QuizManager
├── patterns/                 # Gang of Four & architectural pattern implementations
│   ├── factory/              # ProductFactory (Perfume, CarPerfume, RoomFreshener)
│   ├── strategy/             # RecommendationStrategy registry & implementations
│   ├── state-machine/        # OrderStateMachine transition validation
│   └── adapters/             # Payment, Storage, Notification, Shipping interfaces
├── repositories/             # Data access contracts & implementations
│   ├── contracts/            # TypeScript / JSDoc interface definitions
│   ├── firebase/             # Firestore real adapters
│   ├── mock/                 # In-memory mock repositories with realistic seeds
│   └── index.js              # Repository registry / DI container
├── services/                 # Application business logic layer
│   ├── catalogService.js
│   ├── quizService.js
│   ├── orderService.js
│   └── authService.js
├── hooks/                    # Reusable React hooks
├── lib/                      # Utilities, formatters, constants
└── styles/                   # Luxury theme variables, tailwind base
```

---

## 2. Design Pattern Specifications

### 2.1 Factory Pattern — Polymorphic Product Creation

```javascript
// src/patterns/factory/productFactory.js
export function createProduct(data) {
  const base = {
    id: data.id || `prod_${Date.now()}`,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description,
    price: Number(data.price),
    currency: data.currency || 'USD',
    images: data.images || [],
    inventory: Number(data.inventory ?? 25),
    active: data.active ?? true,
    intensity: Number(data.intensity || 5),
    warmth: Number(data.warmth || 5),
    freshness: Number(data.freshness || 5),
    sweetness: Number(data.sweetness || 5),
    seasonTags: data.seasonTags || ['ALL_SEASON'],
    occasionTags: data.occasionTags || ['DAILY'],
    notes: data.notes || { top: [], heart: [], base: [] },
    createdAt: data.createdAt || new Date().toISOString(),
  };

  switch (data.type) {
    case 'PERFUME':
      return {
        ...base,
        type: 'PERFUME',
        concentration: data.concentration || 'Eau de Parfum (20% concentration)',
        volume: data.volume || '50ml / 1.7 fl.oz',
        bottleType: data.bottleType || 'Luxury Flacon with Heavy Bronze Cap',
        sillage: data.sillage || 'Moderate to Intimate',
      };
    case 'CAR_PERFUME':
      return {
        ...base,
        type: 'CAR_PERFUME',
        mountType: data.mountType || 'Artisanal Walnut Vent Clip',
        diffusionDuration: data.diffusionDuration || '45-60 Days',
        refillable: data.refillable ?? true,
      };
    case 'ROOM_FRESHENER':
      return {
        ...base,
        type: 'ROOM_FRESHENER',
        dispenserType: data.dispenserType || 'Fine Mist Reed Diffuser & Room Spray',
        coverageArea: data.coverageArea || 'Up to 600 sq ft',
        recommendedRooms: data.recommendedRooms || ['Living Room', 'Primary Suite'],
      };
    default:
      throw new Error(`Unsupported product type: ${data.type}`);
  }
}
```

---

### 2.2 Strategy Pattern — Recommendation Engine

```javascript
// src/patterns/strategy/recommendationStrategies.js
export const RuleBasedStrategy = {
  name: 'ruleBased',
  recommend(profile, catalog) {
    return catalog
      .map(product => {
        let score = 50; // baseline
        // Warmth alignment
        score += 15 - Math.abs(product.warmth - profile.warmth) * 3;
        // Intensity alignment
        score += 15 - Math.abs(product.intensity - profile.intensity) * 3;
        // Season match
        if (product.seasonTags.includes(profile.season) || product.seasonTags.includes('ALL_SEASON')) {
          score += 15;
        }
        // Note preferences
        if (profile.preferredNotes?.length) {
          const allNotes = [...product.notes.top, ...product.notes.heart, ...product.notes.base].map(n => n.toLowerCase());
          const matchCount = profile.preferredNotes.filter(pn => allNotes.some(n => n.includes(pn.toLowerCase()))).length;
          score += matchCount * 10;
        }
        return {
          product,
          score: Math.min(99, Math.max(30, Math.round(score))),
          matchReason: `Harmonizes with your ${profile.season.toLowerCase()} preference and warmth index (${profile.warmth}/10).`,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
};
```

---

### 2.3 State Machine — Order Status Enforcement

```javascript
// src/patterns/state-machine/orderStateMachine.js
export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  FORMULA_CONFIRMED: 'FORMULA_CONFIRMED',
  IN_PRODUCTION: 'IN_PRODUCTION',
  QUALITY_CHECK: 'QUALITY_CHECK',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ALLOWED_TRANSITIONS = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['FORMULA_CONFIRMED', 'CANCELLED'],
  FORMULA_CONFIRMED: ['IN_PRODUCTION', 'CANCELLED'],
  IN_PRODUCTION: ['QUALITY_CHECK'],
  QUALITY_CHECK: ['PACKED'],
  PACKED: ['SHIPPED'],
  SHIPPED: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransitionOrder(currentStatus, nextStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}
```

---

### 2.4 Adapter Pattern — External Providers

Interfaces for:
- `PaymentProvider`: `createPaymentSession(order)`, `verifyPayment(sessionId, signature)`
- `StorageProvider`: `uploadAsset(file, path)`, `getAssetUrl(path)`
- `NotificationProvider`: `sendOrderConfirmation(order)`, `sendStatusUpdate(order)`
- `ShippingProvider`: `calculateRates(address, items)`, `generateTracking(orderId)`
