# EVA Cosmetics - Quick Reference Guide

## 🚀 Getting Started (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Application opens at http://localhost:3000
```

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@eva.com | password123 |
| Manager | manager@eva.com | password123 |
| Admin | admin@eva.com | password123 |

**Tip:** Click on any demo user card for instant login!

---

## 📱 Main Features

### Dashboard 📊
- **User**: Sees assigned assets & tasks
- **Manager/Admin**: Sees statistics & overview

### Asset Management 📦
- View all assets with search & filter
- Add, edit, delete assets
- Assign assets to employees
- Track asset status

### Employee Management 👥
- View employee list
- Add/edit employees
- Assign roles
- Delete employees

### Reports 📋
- Create and manage reports
- Track report status
- View report history

### Inventory 🛍️
- Manage cosmetics products
- Track stock levels
- Add/edit/delete products

### Profile 👤
- View/edit user information
- Update profile details

### Notifications 🔔
- View system notifications
- Mark as read
- Delete notifications

### Chat 💬
- Direct messaging
- Conversation history
- Real-time chat interface

---

## 🎨 Theme & Language

### Theme Toggle
- Click Sun/Moon icon in navbar
- Preference saved automatically

### Language Toggle
- Click Globe icon in navbar
- Choose English (EN) or Arabic (AR)
- RTL support for Arabic
- Preference saved automatically

---

## 🔗 Page Routes

```
/login                  - Login page
/dashboard             - Main dashboard
/assets                - Asset list
/assets/add            - Add new asset
/assets/edit/:id       - Edit asset
/employees             - Employee list
/employees/add         - Add employee
/employees/edit/:id    - Edit employee
/reports               - Reports list
/reports/add           - Add report
/inventory             - Products list
/inventory/add         - Add product
/inventory/edit/:id    - Edit product
/profile               - User profile
/notifications         - Notifications
/chat                  - Chat interface
```

---

## 🎯 Quick Actions

### From Navbar
- **Search**: Find anything on current page
- **Notifications**: View system notifications
- **Profile Dropdown**: Access profile, notifications, logout
- **Language**: Switch EN/AR
- **Theme**: Toggle dark/light mode

### From Sidebar
- **Click any menu item**: Navigate to that section
- **Active item**: Highlighted with primary color
- **Logout**: Red button at bottom

---

## 📊 Status Colors

| Status | Color |
|--------|-------|
| Available | 🟢 Green |
| In Use | 🔵 Blue |
| Maintenance | 🟡 Yellow |
| Retired | 🔴 Red |
| Pending | 🟠 Amber |
| Completed | 🟢 Green |
| In Progress | 🔵 Blue |

---

## 🎨 EVA Brand Colors

- **Primary**: #0D9488 (Deep Teal) - Main color
- **Secondary**: #475569 (Slate Gray) - Text/borders
- **Accent**: #F59E0B (Warm Amber) - Warnings/CTAs

---

## 📝 Common Tasks

### Adding an Asset
1. Go to Assets → Click "Add Asset"
2. Fill in all fields (name, category, price, etc.)
3. Select assignee from dropdown
4. Click "Create Asset"

### Creating a Report
1. Go to Reports → Click "Add Report"
2. Enter title and description
3. Select status (Pending/In Progress/Completed)
4. Click "Create Report"

### Adding an Employee
1. Go to Employees → Click "Add Employee"
2. Fill in name, email, department
3. Select role (User/Asset Manager)
4. Click "Create Employee"

### Filtering Data
- Use search box to find items by name
- Use status dropdown to filter by status
- Filters work on Assets, Employees, etc.

---

## 🌐 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 💾 Data Storage

All data is stored in browser localStorage:
- Login data persists
- Theme preference saved
- Language preference saved
- All CRUD operations update localStorage

**Note**: Data resets on browser cache clear

---

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| App.jsx | Main app component & routing |
| AuthContext.jsx | Authentication state |
| ThemeContext.jsx | Theme management |
| mockData.js | Demo data & localStorage |
| Navbar.jsx | Top navigation |
| Sidebar.jsx | Side navigation |
| Dashboard.jsx | Dashboard page |
| Assets.jsx | Asset management |
| ... | Other feature pages |

---

## 🎓 Learning Path

1. **Start**: Login page
2. **Explore**: Dashboard
3. **Try**: Create an asset
4. **Test**: Edit & delete operations
5. **Play**: Switch themes & languages
6. **Manage**: Try different roles

---

## 🐛 Troubleshooting

### Page not loading?
- Clear browser cache
- Refresh page (Ctrl+R)
- Check console for errors

### Data not persisting?
- Check browser localStorage is enabled
- Clear data and restart

### Theme not changing?
- Refresh page
- Check if dark mode enabled in OS

### Language not updating?
- Check localStorage
- Ensure language file loaded

---

## 💡 Tips & Tricks

1. **Use demo user buttons** for quick login
2. **Search everywhere** - search works on most lists
3. **Filter by status** to find specific items
4. **Dark mode** reduces eye strain at night
5. **Arabic RTL** is fully supported
6. **Mobile responsive** - try on phone/tablet

---

## 🤝 Support

For issues:
1. Check browser console (F12)
2. Verify mock data loaded
3. Try clearing cache
4. Check localStorage

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Installation guide
- **COMPLETION_CHECKLIST.md** - All features
- **QUICK_REFERENCE.md** - This file!

---

## ✨ Features at a Glance

✅ 3 user roles with different permissions
✅ Full CRUD for assets, employees, products
✅ Beautiful dark/light theme
✅ English & Arabic support
✅ Responsive mobile design
✅ Professional animations
✅ Complete notification system
✅ Chat messaging
✅ User profiles
✅ Report management
✅ Inventory tracking

---

**Happy using EVA Cosmetics AMS! 🎉**

Need help? Check README.md or SETUP_GUIDE.md
