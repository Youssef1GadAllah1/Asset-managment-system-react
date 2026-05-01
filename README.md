# EVA Cosmetics - Asset Management System

A comprehensive Asset Management System built with React 18, Vite, and Tailwind CSS for EVA Cosmetics Group.

## 🎨 Features

### User Roles
- **Regular User**: Can view assigned assets, tasks, and submit reports
- **Asset Manager**: Can manage assets, employees, reports, and inventory
- **Administrator**: Full system access with all management capabilities

### Core Features
- ✅ Complete CRUD operations for Assets, Employees, Products, and Reports
- ✅ Real-time dashboard with statistics and task management
- ✅ Dark/Light theme toggle
- ✅ Multi-language support (English & Arabic with RTL)
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Professional UI with EVA Cosmetics brand colors
- ✅ Mock authentication and data persistence
- ✅ Chat messaging system
- ✅ Notification system
- ✅ User profile management

## 🚀 Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Internationalization**: i18next
- **State Management**: Context API
- **Data Storage**: localStorage (Mock)

## 📋 Project Structure

```
eva-cosmetics-ams/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   └── ProtectedRoute.jsx
│   ├── features/
│   │   ├── auth/            # Login
│   │   ├── dashboard/       # Dashboard
│   │   ├── assets/          # Assets management
│   │   ├── employees/       # Employees management
│   │   ├── reports/         # Reports management
│   │   ├── inventory/       # Inventory management
│   │   ├── profile/         # User profile
│   │   ├── notifications/   # Notifications
│   │   └── chat/            # Chat messaging
│   ├── context/             # React Context
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilities and mock data
│   ├── i18n/                # Translations (EN/AR)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── index.html
```

## 🎨 Color Palette (EVA Cosmetics)

### Primary Colors
- **Deep Teal**: `#0D9488` - Main brand color for buttons, headers, links
- **Slate Gray**: `#475569` - Secondary color for text, borders
- **Warm Amber**: `#F59E0B` - Accent color for highlights, warnings

### Status Colors
- ✅ Available: Green
- 🔵 In Use: Blue
- 🟡 Maintenance: Yellow
- ❌ Retired: Red
- ⏳ Pending: Amber

## 🔐 Demo Users

You can login with these credentials:

1. **Regular User**
   - Email: `user@eva.com`
   - Password: `password123`

2. **Asset Manager**
   - Email: `manager@eva.com`
   - Password: `password123`

3. **Administrator**
   - Email: `admin@eva.com`
   - Password: `password123`

## ⚙️ Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## 👀 Preview

```bash
npm run preview
```

## 📱 Responsive Design

- **Mobile**: Full responsive design with hamburger menu
- **Tablet**: Optimized layout for tablet devices
- **Desktop**: Full-featured layout with all components visible

## 🌍 Language Support

- **English**: Default language
- **Arabic**: Full RTL support
- Language preference saved in localStorage

## 🌓 Theme Support

- **Light Mode**: Clean white backgrounds
- **Dark Mode**: Dark theme for comfortable viewing
- Theme preference saved in localStorage

## 📊 Mock Data

The application includes realistic mock data for:
- 3 Users with different roles
- 10 Assets across various categories
- 5 Cosmetics Products
- 8 Reports
- 6 Tasks
- 3 Notifications

All data is stored in localStorage and can be modified through the UI.

## 🎯 Key Features

### Dashboard
- Welcome greeting and current date
- Statistics cards for managers/admins
- Task list with status tracking
- User's assigned assets overview

### Asset Management
- View all assets with filtering and search
- Add new assets
- Edit asset details
- Assign assets to employees
- Track asset status (Available, In Use, Maintenance, Retired)

### Employee Management
- View employee list
- Add new employees
- Edit employee information
- Assign roles
- Delete employees

### Report System
- Create and submit reports
- Track report status
- Filter reports by various criteria
- View report history

### Inventory Management
- Manage cosmetics products
- Track product stock levels
- Update product information
- Categorize products

### User Profile
- View user information
- Edit profile details
- Change personal information

### Notifications
- Receive system notifications
- Mark notifications as read
- Delete notifications

### Chat System
- Direct messaging between users
- Conversation history
- Real-time message exchange

## 🔒 Security Notes

This is a demo application with mock authentication. In a production environment:
- Implement proper backend authentication
- Use JWT tokens for session management
- Implement HTTPS
- Add proper input validation and sanitization
- Use secure password hashing
- Implement proper authorization checks

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme.

### Translations
Add or edit translations in:
- `src/i18n/en.json` (English)
- `src/i18n/ar.json` (Arabic)

### Mock Data
Update mock data in `src/utils/mockData.js`

## 📄 License

© 2024 EVA Cosmetics Group. All rights reserved.

## 👥 Support

For issues or questions, please contact the development team.
