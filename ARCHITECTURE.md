# 📊 EVA Cosmetics - Project Architecture Diagram

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / VITE                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │          React 18 Application (App.jsx)             │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                           │                      │
│           ▼                           ▼                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   Context Providers (AuthProvider, ThemeProvider)   │   │
│  └─────────────────────────────────────────────────────┘   │
│           │              │              │                   │
│           ▼              ▼              ▼                   │
│    ┌────────────┐ ┌────────────┐ ┌──────────────┐         │
│    │AuthContext │ │ThemeContext│ │i18n Config   │         │
│    └────────────┘ └────────────┘ └──────────────┘         │
│           │              │                                  │
└───────────┼──────────────┼──────────────────────────────────┘
            │              │
    ┌───────▼──────────────▼────────┐
    │   React Router (v6)           │
    │   Route Definitions           │
    └───────┬──────────────────────┬┘
            │                      │
    ┌───────▼───────┐  ┌──────────▼──────┐
    │  Protected    │  │  Public Routes  │
    │   Routes      │  │  (Login only)   │
    └───────┬───────┘  └─────────────────┘
            │
    ┌───────▼─────────────────────────────┐
    │     Layout Component               │
    │  ┌──────────────────────────────┐  │
    │  │       Navbar                 │  │
    │  ├──────────────────────────────┤  │
    │  │  Sidebar  │  Page Content    │  │
    │  │           │                  │  │
    │  │  - Home   │  - Dashboard     │  │
    │  │  - Assets │  - Assets        │  │
    │  │  - Empl.  │  - Employees    │  │
    │  │  - Reports│  - Reports       │  │
    │  │  - Inv.   │  - Inventory     │  │
    │  │  - Chat   │  - Chat          │  │
    │  │  - Notif. │  - Notifications │  │
    │  │  - Profile│  - Profile       │  │
    │  └──────────────────────────────┘  │
    └───────────────────────────────────┘
```

---

## 📱 Page Structure

```
LOGIN PAGE
    ↓
    └─→ Demo User Buttons
        ├─→ User Role
        ├─→ Manager Role
        └─→ Admin Role

DASHBOARD (Role-Based)
    ├─→ User Dashboard
    │   ├─ My Tasks
    │   └─ My Assets
    └─→ Manager/Admin Dashboard
        ├─ Statistics Cards
        ├─ All Tasks
        └─ Recent Activity

ASSET MANAGEMENT
    ├─ View Assets (Search & Filter)
    ├─ Add Asset
    ├─ Edit Asset
    └─ Delete Asset

EMPLOYEE MANAGEMENT
    ├─ View Employees (Search)
    ├─ Add Employee
    ├─ Edit Employee
    └─ Delete Employee

REPORT MANAGEMENT
    ├─ View Reports
    ├─ Add Report
    └─ Delete Report

INVENTORY MANAGEMENT
    ├─ View Products (Search)
    ├─ Add Product
    ├─ Edit Product
    └─ Delete Product

USER MANAGEMENT
    ├─ View Profile
    ├─ Edit Profile
    ├─ View Notifications
    ├─ Chat with Others
    └─ Logout
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────┐
│      User Action                    │
│   (Click, Form Submit, etc.)        │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Event Handler / Form Handler      │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Update Mock Data Function         │
│   (saveAssets, saveReports, etc.)   │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   localStorage                      │
│   (Data Persistence)                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Display Data                   │
│   (Read from localStorage)          │
│   (Fetch & Render)                  │
└─────────────────────────────────────┘
```

---

## 👥 User Role Flow

```
LOGIN
  ↓
AUTHENTICATE
  ↓
DETERMINE ROLE
  │
  ├─→ USER
  │   ├─ Dashboard (My Assets & Tasks)
  │   ├─ My Reports
  │   ├─ My Notifications
  │   └─ Profile
  │
  ├─→ ASSET_MANAGER
  │   ├─ Dashboard (Statistics)
  │   ├─ Assets (CRUD)
  │   ├─ Employees (Read Only)
  │   ├─ Reports (CRUD)
  │   ├─ Inventory (Read Only)
  │   ├─ Notifications
  │   └─ Profile
  │
  └─→ ADMIN
      ├─ Dashboard (Full Statistics)
      ├─ Assets (Full CRUD)
      ├─ Employees (Full CRUD)
      ├─ Reports (Full CRUD)
      ├─ Inventory (Full CRUD)
      ├─ Notifications
      └─ Profile
```

---

## 🗂️ File Organization

```
capston_asset_react/
│
├── 📄 Configuration Files
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── 📁 src/
│   ├── 📄 App.jsx (Routes & Main Component)
│   ├── 📄 main.jsx (Entry Point)
│   ├── 📄 index.css (Global Styles)
│   │
│   ├── 📁 components/
│   │   ├── ProtectedRoute.jsx (Auth Guard)
│   │   ├── 📁 common/
│   │   │   └── index.jsx (Button, Input, Card, Badge, etc.)
│   │   └── 📁 layout/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── Layout.jsx
│   │
│   ├── 📁 features/
│   │   ├── 📁 auth/
│   │   │   └── Login.jsx
│   │   ├── 📁 dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── 📁 assets/
│   │   │   ├── Assets.jsx
│   │   │   └── AddEditAsset.jsx
│   │   ├── 📁 employees/
│   │   │   └── Employees.jsx
│   │   ├── 📁 reports/
│   │   │   └── Reports.jsx
│   │   ├── 📁 inventory/
│   │   │   └── Inventory.jsx
│   │   ├── 📁 profile/
│   │   │   └── Profile.jsx
│   │   ├── 📁 notifications/
│   │   │   └── Notifications.jsx
│   │   └── 📁 chat/
│   │       └── Chat.jsx
│   │
│   ├── 📁 context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── 📁 i18n/
│   │   ├── config.js
│   │   ├── en.json
│   │   └── ar.json
│   │
│   └── 📁 utils/
│       └── mockData.js
│
├── 📄 Documentation Files
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   ├── QUICK_REFERENCE.md
│   ├── COMPLETION_CHECKLIST.md
│   ├── FILE_INDEX.md
│   ├── PROJECT_SUMMARY.md
│   └── ARCHITECTURE.md
│
└── 📄 Configuration
    └── .gitignore
```

---

## 🎨 Component Hierarchy

```
App
├── Router
│   ├── Login Page
│   └── Protected Routes
│       ├── Layout
│       │   ├── Navbar
│       │   │   ├── Search
│       │   │   ├── Language Toggle
│       │   │   ├── Theme Toggle
│       │   │   ├── Notifications
│       │   │   └── Profile Dropdown
│       │   │
│       │   ├── Sidebar
│       │   │   ├── Menu Items (Role-based)
│       │   │   └── Logout Button
│       │   │
│       │   └── Page Content
│       │       ├── Dashboard
│       │       ├── Assets
│       │       ├── Employees
│       │       ├── Reports
│       │       ├── Inventory
│       │       ├── Profile
│       │       ├── Notifications
│       │       └── Chat
│       │
│       └── Common Components
│           ├── Button (variants)
│           ├── Input
│           ├── Card
│           ├── Badge
│           ├── Modal
│           ├── Table
│           ├── Toast
│           └── LoadingSkeleton
```

---

## 🌐 Context & State Management

```
AuthContext
├── user (Current logged-in user)
├── loading (Auth loading state)
├── login() (Handle user login)
└── logout() (Handle user logout)

ThemeContext
├── isDark (Dark mode state)
└── toggleTheme() (Switch theme)

i18n Context (via i18next)
├── language (Current language)
├── changeLanguage() (Switch EN/AR)
└── translations (All text)

localStorage
├── user (Persisted user data)
├── theme (Persisted theme)
├── language (Persisted language)
├── assets (CRUD data)
├── employees (CRUD data)
├── products (CRUD data)
├── reports (CRUD data)
├── tasks (Task data)
└── notifications (Notification data)
```

---

## 🔄 Authentication Flow

```
START
  │
  ▼
CHECK localStorage FOR USER
  │
  ├─→ User Found
  │   └─→ Set user in AuthContext
  │       └─→ Proceed to Dashboard
  │
  └─→ User Not Found
      └─→ Redirect to Login
          │
          ▼
          USER ENTERS CREDENTIALS OR CLICKS DEMO
          │
          ▼
          VALIDATE CREDENTIALS
          │
          ├─→ Valid
          │   └─→ Store in localStorage
          │       └─→ Set user in AuthContext
          │           └─→ Redirect to Dashboard
          │
          └─→ Invalid
              └─→ Show Error Message
                  └─→ Stay on Login
```

---

## 🎨 Theme System

```
ThemeContext
    │
    ├─→ isDark = true
    │   └─→ Apply dark classes
    │       ├─ bg-gray-900 (Background)
    │       ├─ bg-gray-800 (Cards)
    │       └─ text-gray-50 (Text)
    │
    └─→ isDark = false
        └─→ Apply light classes
            ├─ bg-gray-50 (Background)
            ├─ bg-white (Cards)
            └─ text-gray-900 (Text)

Toggle Button
    │
    ├─→ Click
    │   └─→ toggleTheme()
    │       └─→ Update isDark
    │           └─→ Save to localStorage
    │               └─→ Rerender with new theme
```

---

## 🌐 Internationalization Flow

```
i18n Config (i18next)
    │
    ├─→ Load JSON files
    │   ├─ en.json (500+ translations)
    │   └─ ar.json (500+ translations)
    │
    ├─→ Detect language
    │   └─ Check localStorage
    │
    ├─→ Set direction
    │   ├─ EN: LTR
    │   └─ AR: RTL
    │
    └─→ Use i18n hook
        └─ t('key') function
            ├─ Returns translated text
            ├─ Updates on language change
            └─ Persists to localStorage
```

---

## 📊 Mock Data Structure

```
Mock Data Sets
    │
    ├─→ Users (3)
    │   ├─ user@eva.com (User)
    │   ├─ manager@eva.com (Asset Manager)
    │   └─ admin@eva.com (Admin)
    │
    ├─→ Assets (10)
    │   ├─ Laptops
    │   ├─ Cameras
    │   ├─ Furniture
    │   └─ Accessories
    │
    ├─→ Products (5)
    │   └─ Cosmetics (Lips, Face, Eyes)
    │
    ├─→ Reports (8)
    │   ├─ Status: Pending
    │   ├─ Status: In Progress
    │   └─ Status: Completed
    │
    ├─→ Tasks (6)
    │   ├─ Priority: High
    │   ├─ Priority: Medium
    │   └─ Priority: Low
    │
    └─→ Notifications (3)
        ├─ Type: Info
        ├─ Type: Success
        └─ Type: Warning
```

---

## 🚀 Deployment Pipeline

```
Development
    │
    ├─→ npm install
    ├─→ npm run dev
    └─→ Test application
        │
        ▼
    Production Build
        │
        ├─→ npm run build
        │   └─→ Creates optimized dist/
        │
        ▼
    Deploy
        │
        ├─→ Choose hosting (Vercel, Netlify, etc.)
        ├─→ Upload dist/ folder
        ├─→ Configure domain
        └─→ Set environment variables
            │
            ▼
        Live Application
            ├─→ Replace mock data with API
            ├─→ Configure backend endpoints
            └─→ Monitor performance
```

---

## 📈 Performance Optimization

```
Optimization Strategies
    │
    ├─→ Code Splitting
    │   └─ React Router lazy loading
    │
    ├─→ Component Optimization
    │   └─ Memoization where needed
    │
    ├─→ CSS Optimization
    │   └─ Tailwind CSS purging
    │
    ├─→ Asset Optimization
    │   └─ Emoji icons (no HTTP requests)
    │
    ├─→ Bundle Optimization
    │   └─ Vite tree-shaking
    │
    └─→ Caching
        └─ localStorage for data persistence
```

---

## 🔐 Security Architecture

```
Security Layers
    │
    ├─→ Authentication
    │   ├─ Login form validation
    │   └─ Session management
    │
    ├─→ Authorization
    │   ├─ Protected routes
    │   └─ Role-based access
    │
    ├─→ Form Security
    │   ├─ Input validation
    │   └─ Error messages
    │
    ├─→ Data Security
    │   ├─ localStorage encryption ready
    │   └─ Confirmation dialogs
    │
    └─→ XSS Prevention
        └─ React's built-in XSS protection
```

---

## ✨ This architecture provides:

✅ Clean separation of concerns
✅ Scalable component structure
✅ Efficient data management
✅ Secure authentication
✅ Easy to test
✅ Ready for backend integration
✅ Performance optimized
✅ Accessible for all users

---

Generated: 2024
Project: EVA Cosmetics Asset Management System
