# 🚀 Quick Start Guide - TMU TIMES

## Getting Started in 5 Minutes

### 1. **Clone/Setup the Project**
```bash
cd "TMU TIMES"
npm install
```

### 2. **Start Development Server**
```bash
npm start
```
The app will open at `http://localhost:3000`

### 3. **Login with Test Account**
- **Registration Number**: `STU-2024-001`
- **Password**: `password`

### 4. **Explore Features**
- 📡 **Feed**: See sample posts from students and officials
- 📢 **Announcements**: View official university broadcasts
- 🗳️ **Elections**: Cast your vote and see live results

---

## 📁 File Structure Quick Reference

```
TMU TIMES/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      ← Top bar with user info
│   │   ├── PostCard.jsx    ← Individual post component
│   │   └── Sidebar.jsx     ← Navigation menu
│   │
│   ├── pages/
│   │   ├── Feed.jsx        ← Main student feed
│   │   ├── Login.jsx       ← Login screen
│   │   ├── Elections.jsx   ← Voting system
│   │   └── Announcements.jsx ← Official broadcasts
│   │
│   ├── styles/
│   │   └── main.css        ← All styling
│   │
│   ├── App.jsx             ← Main app & routing
│   └── index.js            ← Entry point
│
├── public/
│   ├── index.html          ← HTML template
│   └── manifest.json       ← PWA manifest
│
├── package.json            ← Dependencies
├── README.md               ← Feature overview
└── DEVELOPER_GUIDE.md      ← Technical guide
```

---

## 🎯 Key Features Overview

### 1. **Authentication**
- Registration number based login
- User context management
- Logout functionality
- Role detection (student/admin/dean)

### 2. **Social Feed**
- 👍 Like/Unlike posts
- 💬 View comment counts
- 🔄 Share posts
- ⏰ See timestamps
- ✓ Official post verification badges

### 3. **Announcements**
- 📢 Official university announcements
- ⚠️ High-priority alerts
- 🏛️ Posts from VCs, Deans, HODs
- 📌 Pinned important messages

### 4. **Elections**
- 🗳️ Secure student voting
- 📊 Live vote counting
- ✅ Vote confirmation
- 🔒 One vote per person

---

## 🎨 Design System

### Colors
- **Primary**: `#1e3a8a` (Dark Blue)
- **Success**: `#22c55e` (Green)
- **Warning**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Light Blue)

### Key Components
- **Navbar**: Fixed at top, shows user & logout
- **Sidebar**: Sticky menu for navigation
- **Feed**: Main content area with posts
- **Cards**: Reusable post/announcement containers

---

## 🔄 Navigation Flow

```
Login Page
    ↓
Feed (default page)
    ├→ Announcements (click menu)
    ├→ Elections (click menu)
    └→ Logout (top right)
```

---

## 🛠️ Common Tasks

### To Add a New Menu Item
Edit `src/components/Sidebar.jsx`:
```javascript
const menuItems = [
  { id: "new-page", icon: "📌", label: "New Page" },
  // ... existing items
];
```

Then add case in `src/App.jsx`:
```javascript
case "new-page":
  return <NewPage />;
```

### To Add a New Post
In `src/pages/Feed.jsx`:
```javascript
{
  id: 5,
  author: "Name",
  type: "student",
  icon: "👤",
  content: "Post content",
  timestamp: "Just now",
  likes: 0,
  comments: 0,
}
```

### To Style a Component
Add CSS in `src/styles/main.css` with the class name, then use in JSX:
```css
.my-component {
  padding: 20px;
  background: white;
}
```

---

## 🧪 Testing the App

1. **Login Test**
   - Try invalid credentials first
   - See error message
   - Login with test account

2. **Feed Test**
   - Scroll through posts
   - Click like buttons
   - Watch like count increase

3. **Elections Test**
   - Select a candidate
   - Click "Confirm Vote"
   - See results display

4. **Announcements Test**
   - View official posts
   - Notice verification badges
   - See high-priority alerts

---

## 🚨 Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Styling not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check `main.css` is imported in `App.jsx`
- Verify CSS class names match JSX className

### Component not displaying
- Check component is imported in parent
- Verify export statement at bottom
- Check for console errors (F12)

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 🎯 Next Steps

1. **Understand the codebase** - Read through component files
2. **Modify styling** - Experiment with CSS changes
3. **Add features** - Create new components
4. **Test functionality** - Use the app daily
5. **Plan Phase 2** - Design backend integration

---

**Made with ❤️ for TMU Students**
*Version 1.0 - January 2026*
