
# India Geo API — Capstone Project Documentation

## Student: Muhammed Fahim
## Submission Date: April 29, 2026

---

## 1. Project Overview

India Geo API is a production-grade Software-as-a-Service (SaaS) platform that provides a comprehensive REST API for India's complete village-level geographical data. The platform serves as backend infrastructure for B2B clients who need reliable, standardized address data for drop-down menus and form autocomplete functionality.

**Live URL:** https://geo-api-blond.vercel.app  
**GitHub:** https://github.com/muhammedfahim438-ctrl/geo-api

---

## 2. Technology Stack

| Component | Technology | Justification |
|---|---|---|
| Frontend Framework | Next.js 16 | API routes + UI in one project |
| Database | NeonDB (PostgreSQL) | Serverless PostgreSQL, auto-scaling |
| Caching Layer | Redis (Upstash) | Sub-100ms response times |
| Authentication | JWT + API Keys | Stateless, secure, scalable |
| Hosting Platform | Vercel | Edge network, auto deployments |
| Payment Gateway | Razorpay | Indian payment processing |
| Charts | Recharts | React-native data visualization |
| Data Processing | Python (pandas) | ETL for Census XLS files |

---

## 3. Database Design

### Tables
- **states** — 30 Indian states
- **districts** — 586 districts
- **sub_districts** — 5,764 sub-districts
- **villages** — 619,246 villages
- **api_users** — B2B client accounts
- **api_keys** — API credentials
- **payments** — Payment records

### Hierarchy

Country (India)
  └── State (30)
      └── District (586)
          └── Sub-District (5,764)
              └── Village (619,246)


---

## 4. Data Import (ETL)

**Source:** Census 2011 MDDS Village Directory (30 XLS files)

**Process:**
1. Python script reads XLS files using pandas
2. Cleans and normalizes data
3. Inserts into NeonDB PostgreSQL in batches of 500
4. Handles duplicate records with ON CONFLICT DO NOTHING

**Result:** 619,246 villages across 30 states imported successfully

---

## 5. API Endpoints

**Base URL:** `https://geo-api-blond.vercel.app`

**Authentication:** All requests require `x-api-key` header

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/states | List all 30 states |
| GET | /api/districts?state_code= | Districts by state |
| GET | /api/subdistricts?district_code=&state_code= | Sub-districts by district |
| GET | /api/villages?sub_district_code=&district_code=&state_code= | Villages by sub-district |
| GET | /api/search?q= | Search villages by name |
| GET | /api/autocomplete?q= | Typeahead with full hierarchy |
| POST | /api/auth/register | B2B client registration |
| POST | /api/auth/login | B2B client login |
| GET | /api/keys | List API keys |
| POST | /api/keys | Create new API key |
| POST | /api/payment/create-order | Create Razorpay order |
| POST | /api/payment/verify | Verify payment |

### Standard Response Format
json
{
  "success": true,
  "count": 25,
  "data": [...],
  "meta": {
    "requestId": "req_xxx",
    "rateLimit": {
      "remaining": 4850,
      "limit": 5000,
      "reset": "2026-04-29T00:00:00Z"
    }
  }
}


### Error Codes
| Code | Description |
|---|---|
| INVALID_API_KEY | API key missing or invalid |
| RATE_LIMITED | Daily quota exceeded |
| INVALID_QUERY | Query too short or invalid |
| NOT_FOUND | Resource not found |
| INTERNAL_ERROR | Server-side error |

---

## 6. Rate Limiting

| Plan | Daily Requests | Price |
|---|---|---|
| Free | 5,000 | ₹0 |
| Premium | 50,000 | ₹99/month |
| Pro | 300,000 | ₹299/month |
| Unlimited | 1,000,000 | ₹999/month |

---

## 7. Implemented Features

### Landing Page
- Professional homepage with hero section
- Live statistics (619,246 villages, 30 states)
- Pricing plans
- Links to Demo, Portal, Docs

### Demo Client
- **Guided Mode:** State → District → Sub-District → Village (filtered dropdown)
- **Search Mode:** Type village name → auto-fills full address hierarchy
- Shows real API calls being made

### B2B Portal
- Self-registration with company name
- Login with JWT authentication
- API key generation and management
- Usage monitoring (today/total requests)
- Plan upgrade with Razorpay payment

### Admin Dashboard
- Total users, requests, villages stats
- Line chart: API requests last 7 days
- Pie chart: Users by plan distribution
- Bar chart: Top users by request count
- User management with plan upgrade
- Data statistics tab

### API Documentation Page
- Complete endpoint reference
- Request/response examples
- Rate limit information
- Authentication guide

### Security
- JWT authentication for portal users
- API key authentication for API access
- bcrypt password hashing
- Rate limiting per plan
- Redis-based caching

### Caching (Redis/Upstash)
- States cached for 24 hours
- Districts cached for 24 hours
- Sub-districts cached for 1 hour
- Villages cached for 1 hour
- Search results cached for 5 minutes

### Payments (Razorpay)
- Test mode integration
- Order creation and verification
- Automatic plan upgrade on payment

### Daily Reset (Cron Job)
- Vercel cron job resets daily request counters at midnight

---

## 8. Code Architecture


geo-api/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── demo/page.tsx         ← Demo client
│   ├── portal/page.tsx       ← B2B portal
│   ├── admin/page.tsx        ← Admin dashboard
│   ├── docs/page.tsx         ← API documentation
│   └── api/
│       ├── states/           ← States endpoint
│       ├── districts/        ← Districts endpoint
│       ├── subdistricts/     ← Sub-districts endpoint
│       ├── villages/         ← Villages endpoint
│       ├── search/           ← Search endpoint
│       ├── autocomplete/     ← Autocomplete endpoint
│       ├── auth/             ← Login/Register
│       ├── keys/             ← API key management
│       ├── payment/          ← Razorpay integration
│       ├── admin/            ← Admin endpoints
│       └── cron/             ← Daily reset job
├── lib/
│   ├── db.ts                 ← PostgreSQL connection
│   ├── auth.ts               ← API key validation
│   ├── cache.ts              ← Redis caching
│   └── response.ts           ← Standard response format
├── etl/
│   ├── parse_and_push.py     ← Main ETL script
│   └── fix_up.py             ← Uttar Pradesh ETL
└── vercel.json               ← Cron job configuration


---

## 9. Deployment

- **Platform:** Vercel (free tier)
- **Database:** NeonDB Singapore region
- **Cache:** Upstash Redis Singapore region
- **CI/CD:** Auto-deploy on push to main branch
- **Domain:** geo-api-blond.vercel.app

---

## 10. Success Criteria Met

| Criteria | Status |
|---|---|
| Import all states/districts/villages | ✅ 619,246 villages |
| Sub-100ms API response time | ✅ Redis caching |
| Support 1M+ daily requests | ✅ Upstash + Vercel edge |
| Admin dashboard | ✅ With charts |
| B2B client portal | ✅ Self-registration |

---

## 11. Pending Work / Future Improvements

1. **Real analytics** — Store actual request logs in database for real charts
2. **Email notifications** — Welcome email on registration, usage alerts at 80%
3. **Custom domain** — Purchase indiageoapi.com
4. **Missing states** — Add Delhi, Uttarakhand, Jammu & Kashmir, Manipur
5. **API Secret** — Add second factor for API authentication
6. **Swagger UI** — Interactive API documentation
7. **Usage alerts** — Email when 80% and 95% of daily limit reached
8. **State access control** — Restrict free users to specific states
9. **Export functionality** — Download usage data as CSV
10. **Multi-language support** — Village names in regional languages

---

## 12. How to Run Locally

bash
## Clone repository
git clone https://github.com/muhammedfahim438-ctrl/geo-api.git
cd geo-api

## Install dependencies
npm install

## Set environment variables
cp .env.example .env.local
### Add your DATABASE_URL, JWT_SECRET, RAZORPAY keys, UPSTASH keys

## Run development server
npm run dev

### Open http://localhost:3000


---

*Documentation prepared for Capstone Project Submission — April 2026*
```
