# PJ Essence — API Specification

Base URL:
```text
/api
```

All protected endpoints require an `Authorization: Bearer <token>` header, verified against Firebase Auth / JWT.

---

## 1. Public Endpoints

### 1.1 Products

#### List Products
`GET /api/products`

Query Parameters:
- `type` (optional): `PERFUME` | `CAR_PERFUME` | `ROOM_FRESHENER`
- `season` (optional): `WINTER` | `SPRING` | `SUMMER` | `AUTUMN` | `ALL_SEASON`
- `search` (optional): string
- `sort` (optional): `featured` | `price_asc` | `price_desc` | `newest`
- `page` (default: 1): integer
- `limit` (default: 20): integer

Response `200 OK`:
```json
{
  "products": [
    {
      "id": "prod_velvet_oud",
      "type": "PERFUME",
      "name": "Velvet Oud & Smoked Amber",
      "slug": "velvet-oud-smoked-amber",
      "description": "An opulent evening composition featuring rich Cambodian agarwood, charred amber resin, and Madagascar bourbon vanilla.",
      "price": 185,
      "currency": "USD",
      "active": true,
      "inventory": 42,
      "images": ["/images/products/velvet-oud.jpg"],
      "seasonTags": ["WINTER", "AUTUMN"],
      "intensity": 8,
      "warmth": 9,
      "freshness": 2,
      "sweetness": 6,
      "notes": {
        "top": ["Cardamom", "Pink Pepper", "Bergamot"],
        "heart": ["Damascena Rose", "Smoked Amber", "Cacao"],
        "base": ["Cambodian Oud", "Bourbon Vanilla", "Atlas Cedarwood"]
      }
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### Get Product by ID or Slug
`GET /api/products/:identifier`

Response `200 OK`: Product object.

---

### 1.2 Fragrance Quiz & Recommendations

#### Get Quiz Questions
`GET /api/quiz`

Returns active natural-language questionnaire with dynamic conditional next-step rules.

#### Compute Recommendations
`POST /api/quiz/recommendations`

Request Body:
```json
{
  "season": "WINTER",
  "occasion": "EVENING",
  "intensity": 8,
  "warmth": 9,
  "freshness": 3,
  "sweetness": 6,
  "preferredNotes": ["oud", "vanilla"]
}
```

Response `200 OK`:
```json
{
  "profile": {
    "title": "The Nocturnal Alchemist",
    "description": "Drawn to deep resiny depths, smoldering woods, and decadent spiced warmth.",
    "intensity": 8,
    "warmth": 9,
    "freshness": 3,
    "sweetness": 6,
    "dominantFamily": "Woody Oriental"
  },
  "recommendations": [
    {
      "product": { "id": "prod_velvet_oud", "name": "Velvet Oud & Smoked Amber" },
      "score": 96,
      "matchReason": "Flawless alignment with your nocturnal winter warmth index (9/10) and oud affinity."
    }
  ]
}
```

---

## 2. Order Endpoints

### 2.1 Create Order
`POST /api/orders`

Request Body:
```json
{
  "items": [
    {
      "productId": "prod_velvet_oud",
      "quantity": 1,
      "unitPrice": 185,
      "isCustom": false
    }
  ],
  "shippingAddress": {
    "fullName": "Elena Rostova",
    "street": "742 Evergreen Terrace",
    "city": "Beverly Hills",
    "state": "CA",
    "zip": "90210",
    "country": "US"
  },
  "giftWrapping": true
}
```

Response `201 Created`:
```json
{
  "orderId": "ord_8849201",
  "orderStatus": "PENDING_PAYMENT",
  "paymentStatus": "UNPAID",
  "total": 195.00,
  "currency": "USD"
}
```

---

## 3. Payment Endpoints

### 3.1 Create Payment Session
`POST /api/payment/create-session`

### 3.2 Authoritative Webhook
`POST /api/payment/webhook`

Validates cryptographic signature and transitions order state to `PAID`. Client transitions are strictly forbidden.

---

## 4. Admin Endpoints

- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status` (Subject to Finite State Machine validation)
- `POST /api/admin/quiz/questions`
- `PATCH /api/admin/quiz/questions/:id`
