# SheNeeds — Donation Platform Frontend

React/Vite frontend for the SheNeeds Donation Platform.

## Tech Stack

- **React 18** + Vite 5
- **React Router DOM 6** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **Lucide React** — icons
- **Recharts** — analytics charts (admin dashboard)

## Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance — JWT header injection, 401/429 handling
│   ├── auth.js           # login, register, getMe
│   ├── donor.js          # M-Pesa initiation, donation history, receipts
│   ├── charity.js        # Application submission, profile
│   ├── admin.js          # Stats, analytics, application approve/reject
│   ├── beneficiaries.js
│   └── stories.js
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/
│   │   └── DashboardLayout.jsx   # Shared sidebar/nav for all dashboards
│   ├── admin/
│   │   └── AnalyticsCharts.jsx   # Recharts area + bar charts
│   ├── charity/
│   │   └── ApprovedDashboard.jsx # Charity dashboard after approval
│   ├── CharityCard.jsx
│   ├── DonationModal.jsx  # M-Pesa STK Push + manual pay flow
│   ├── Carousel.jsx
│   └── ErrorBoundary.jsx
├── constants/index.js    # ROUTES, ROLES, API_ENDPOINTS, STORAGE_KEYS
├── context/
│   └── AuthContext.jsx   # Auth state — user, login, logout, token validation
├── lib/
│   ├── currency.js       # formatCurrency(), formatCurrencyCompact()
│   └── utils.js          # cn() class merging
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Charities.jsx          # Public charity listing
│   ├── CharityProfile.jsx
│   ├── NotFound.jsx
│   ├── donor/
│   │   ├── Dashboard.jsx      # Stats + donation history + receipts
│   │   ├── BrowseCharities.jsx # Search/filter + donation modal
│   │   └── DonationSuccess.jsx # Polls status after STK Push
│   ├── charity/
│   │   └── Dashboard.jsx      # Application form or approved dashboard
│   └── admin/
│       └── Dashboard.jsx      # Stats, charts, application management
└── routes/
    └── ProtectedRoute.jsx     # Auth + role guard
```

## Setup

```bash
cd Donation-Platform-frontend

npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

The dev server proxies all API paths (`/auth`, `/api`, `/donor`, `/charity`, `/admin`, `/charities`, `/stories`, `/health`) to `http://localhost:5000` — no CORS issues in development.

## Environment Variables

**Development** (`.env.development` — already configured):
```env
VITE_API_URL=/
```
Leave this as `/` — Vite's proxy handles routing to the backend.

**Production** (create `.env.production` on your server):
```env
VITE_API_URL=https://your-backend-domain.com
```

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/charities` | Charities | Public |
| `/charities/:id` | CharityProfile | Public |
| `/login` | Login | Public (redirects if logged in) |
| `/register` | Register | Public (redirects if logged in) |
| `/donor` | DonorDashboard | Donor only |
| `/browse-charities` | BrowseCharities | Donor only |
| `/donation/success` | DonationSuccess | Donor only |
| `/charity` | CharityDashboard | Charity only |
| `/admin` | AdminDashboard | Admin only |

## Auth Flow

`AuthContext` manages the session:
1. On mount: reads token from `localStorage`, calls `/auth/me` to validate, sets `user` state
2. On login/register: stores token in `localStorage`, sets `user` state
3. On logout: clears `localStorage`, resets `user` to null
4. Axios request interceptor: injects `Authorization: Bearer <token>` on every request
5. Axios response interceptor: on 401 → clears token, redirects to `/login?expired=1`

`ProtectedRoute` blocks unauthenticated users and wrong-role users, redirecting to the correct dashboard.

## Payment Flow (M-Pesa STK Push)

`DonationModal` supports two modes:

**M-Pesa Express (STK Push):**
1. User enters amount + phone → `POST /api/donations/mpesa`
2. Backend sends STK Push to phone, creates PENDING donation
3. `DonationSuccess` page polls `/api/donations/status/:checkout_id`
4. After Safaricom callback (or mock: 5s delay), status → SUCCESS

**Manual Pay (Paybill):**
1. User initiates → `POST /api/donations/manual`
2. Backend returns paybill number + account reference
3. User pays via M-Pesa, enters transaction code → `POST /api/donations/:id/submit-code`

## Key Components

**`DonationModal`** — handles the full payment UX including quick-select amounts, phone validation, error display, and the manual pay instruction steps.

**`AuthContext`** — the single source of truth for auth state. All pages use `useAuth()` to access `user`, `login`, `logout`, etc.

**`axios.js`** — centralizes all HTTP config. If a response returns HTML instead of JSON (wrong API URL), it surfaces a clear error rather than a cryptic parse failure.

**`AnalyticsCharts`** — area chart of donation trends (30 days) and bar chart of top charities by volume, using Recharts.

## Utilities

```jsx
import { formatCurrency, formatCurrencyCompact } from '@/lib/currency'
formatCurrency(50000)        // "KES 500.00"
formatCurrencyCompact(50000) // "KES 500"
```

Path alias `@` maps to `src/` — use `@/components/ui/button` instead of relative paths.

## Troubleshooting

**API returning HTML instead of JSON**
- Check `VITE_API_URL` in your env file
- Ensure backend is running at the expected address

**Auth loop / constant redirects**
- Clear localStorage: `localStorage.clear()` in browser console
- Check that JWT_SECRET_KEY matches between backend restarts

**Build errors**
```bash
rm -rf node_modules/.vite
npm run dev
```

## License

MIT
