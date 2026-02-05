# SheNeeds - Donation Platform Frontend

Modern React frontend for the SheNeeds Donation Platform, built with Vite and shadcn/ui.

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library (Radix UI primitives)
- **Lucide React** - Icon library

## Project Structure

```
src/
├── api/                      # API services
│   ├── axios.js              # Axios instance with JWT interceptor
│   ├── auth.js               # Auth API (login, register, me)
│   ├── charity.js            # Charity API (applications, profile)
│   ├── admin.js              # Admin API (applications, users)
│   └── index.js              # Barrel export
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── checkbox.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── dropdown-menu.jsx
│   │   └── index.js
│   ├── layout/
│   │   └── DashboardLayout.jsx
│   ├── charity/
│   │   └── ApplicationFormSections.jsx
│   └── CharityCard.jsx
├── constants/
│   └── index.js              # ROLES, ROUTES, API_ENDPOINTS
├── context/
│   └── AuthContext.jsx       # Auth state management
├── lib/
│   └── utils.js              # cn() utility for class merging
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Charities.jsx
│   ├── donor/
│   │   └── Dashboard.jsx
│   ├── charity/
│   │   └── Dashboard.jsx
│   └── admin/
│       └── Dashboard.jsx
├── routes/
│   └── ProtectedRoute.jsx    # Role-based route guard
├── App.jsx                   # Main app with routes
├── main.jsx                  # Entry point
└── index.css                 # Global styles + CSS variables
```

## Setup

```bash
cd Donation-Platform-frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

App runs at `http://localhost:5173` (or next available port)

## Configuration

The app connects to the backend API at `http://localhost:5000` by default.

To change, update `baseURL` in `src/api/axios.js`.

## Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/charities` | Charities | Public |
| `/donor/dashboard` | DonorDashboard | Donor only |
| `/charity/dashboard` | CharityDashboard | Charity only |
| `/admin/dashboard` | AdminDashboard | Admin only |

## Auth Context

Use the `useAuth` hook for authentication:

```jsx
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { 
    user,            // Current user object { id, email, role }
    isAuthenticated, // Boolean
    loading,         // Boolean - auth state loading
    error,           // Error message string
    login,           // (email, password) => Promise
    register,        // (email, password, role) => Promise
    logout,          // () => void - clears token and redirects
    clearError,      // () => void
    getRedirectPath  // (role) => string - get dashboard path for role
  } = useAuth()
}
```

## UI Components (shadcn/ui)

Import from `@/components/ui`:

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
```

## Path Aliases

The project uses `@` as an alias for `src/`:

```jsx
// Instead of relative paths
import { useAuth } from '../../../context/AuthContext'

// Use the @ alias
import { useAuth } from '@/context/AuthContext'
```

## Theming

CSS variables are defined in `src/index.css`. The primary color is red-600 for the SheNeeds brand.

Key variables:
- `--primary` - Primary brand color
- `--background` - Page background
- `--foreground` - Text color
- `--muted` - Muted backgrounds
- `--destructive` - Error/danger states

## Features

### Donor Dashboard
- View donation history (placeholder)
- Browse approved charities
- Make donations (placeholder)

### Charity Dashboard
- Submit charity application form
- Track application status
- View received donations (placeholder)

### Admin Dashboard
- Review pending applications
- Approve/reject charities
- Platform statistics (placeholder)

## TODO Items

The codebase contains TODO comments for future features:
- `FE1` - Donation history and favorites
- `FE2` - Admin statistics and pagination
- `FE3` - Search and filter functionality
- `FE4` - Donation flow implementation

## License

MIT
