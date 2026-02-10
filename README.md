# SheNeeds - Donation Platform Frontend

Modern React frontend for the SheNeeds Donation Platform - empowering donors to support verified charities focused on menstrual health education and access.

## 📖 About

SheNeeds is a user-friendly donation platform that connects generous donors with verified charitable organizations dedicated to improving menstrual health education and access. The frontend provides an intuitive interface for donors to discover charities, make donations, and track their impact.

### Key Features

- 🎨 **Modern UI** - Clean, responsive design built with shadcn/ui and Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based authentication with protected routes
- 👥 **Role-Based Access** - Tailored dashboards for donors, charities, and administrators
- 🏢 **Charity Applications** - Streamlined application process for charitable organizations
- 💳 **Donation Flow** - Intuitive donation interface with charity profiles
- 📊 **Dashboard Analytics** - Real-time statistics and donation tracking
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds

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

### 👤 Donor Dashboard
- Browse verified active charities
- View detailed charity profiles and impact metrics
- Make secure donations to chosen charities
- Track donation history and receipts
- Save favorite charities for quick access

### 🏢 Charity Dashboard
- Submit comprehensive charity application
- Track application status (pending, approved, rejected)
- Update charity profile and information
- View received donations and donor analytics
- Access dashboard statistics and insights

### 🛡️ Admin Dashboard
- Review pending charity applications
- Approve or reject charity registrations
- Monitor platform statistics and metrics
- Manage user accounts and charity status
- Access comprehensive platform analytics

## TODO Items

The codebase contains TODO comments for future features:
- `FE1` - Donation history and favorites
- `FE2` - Admin statistics and pagination
- `FE3` - Search and filter functionality
- `FE4` - Donation flow implementation

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=https://your-api-domain.com
```

Update API URL in production:
```js
// src/api/axios.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

### Deploy to Netlify/Vercel

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variable: `VITE_API_URL`

### Deploy to Custom Server

```bash
# Build the app
npm run build

# Copy dist/ folder to your web server
# Configure server to serve index.html for all routes (SPA)
```

## Troubleshooting

### Common Issues

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection errors**
- Verify backend is running at `http://localhost:5000`
- Check CORS settings in backend
- Inspect Network tab in browser DevTools

**Authentication issues**
- Clear localStorage: `localStorage.clear()`
- Check token expiration in AuthContext
- Verify JWT_SECRET_KEY matches backend

**Build errors**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Development Tips

### Component Creation

Follow shadcn/ui patterns for new components:
```bash
# Add new shadcn component
npx shadcn-ui@latest add [component-name]
```

### Code Style

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use Tailwind utility classes
- Leverage shadcn/ui components

### Performance

- Lazy load routes with React.lazy()
- Optimize images and assets
- Use React.memo() for expensive components
- Implement proper loading states

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

---

Built with ❤️ for menstrual health advocacy
