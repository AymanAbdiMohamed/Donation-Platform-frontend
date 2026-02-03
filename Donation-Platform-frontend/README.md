# Donation Platform - Frontend

Barebones React frontend with Context API (no Redux).

## Structure

```
frontend/
├── src/
│   ├── api.js                    # Axios instance + JWT interceptor
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Route guard
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── DonorDashboard.jsx
│   │   ├── CharityDashboard.jsx
│   │   └── AdminDashboard.jsx
│   └── routes/
│       └── AppRoutes.jsx         # Route config
├── index.html
├── vite.config.js
└── package.json
```

## Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

App runs at `http://localhost:5173`

## Dependencies

- React 18
- React Router DOM 6
- Axios
- Vite

## Pages

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/donor/dashboard` | DonorDashboard | Donor only |
| `/charity/dashboard` | CharityDashboard | Charity only |
| `/admin/dashboard` | AdminDashboard | Admin only |

## Auth Context

Use the `useAuth` hook:

```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { 
    user,           // Current user object
    isAuthenticated,// Boolean
    loading,        // Boolean
    error,          // Error message
    login,          // (email, password) => Promise
    register,       // (email, password, role) => Promise
    logout,         // () => void
    clearError      // () => void
  } = useAuth()
}
```
