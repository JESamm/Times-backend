# TMU TIMES - Developer Guide

## 🎯 Project Overview

TMU TIMES is a university-specific social media platform designed to bridge official university communications with student engagement. It combines the structure of institutional announcements with the viral nature of social media platforms.

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React App)            │
├─────────────────────────────────────────┤
│  Navbar    │      Feed/Pages     │      │
│ (Nav Bar)  │  - Announcements   │      │
│            │  - Elections       │Sidebar│
│            │  - Student Feed    │ (Menu)│
└─────────────────────────────────────────┘
         ↓ (Context API)
┌─────────────────────────────────────────┐
│      AuthContext (Global State)         │
│  - User Data                            │
│  - Login Status                         │
│  - Permissions                          │
└─────────────────────────────────────────┘
         ↓ (Future)
┌─────────────────────────────────────────┐
│       Backend API (Node.js/Express)     │
│  - User Authentication                  │
│  - Post Management                      │
│  - Elections System                     │
│  - Moderation                           │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│       Database (MongoDB)                │
│  - Users                                │
│  - Posts                                │
│  - Elections                            │
│  - Announcements                        │
└─────────────────────────────────────────┘
```

## 🔧 Component Hierarchy

```
App
├── Navbar
│   └── User Info & Logout
├── Container
│   ├── Sidebar
│   │   └── Menu Items (4)
│   └── Pages
│       ├── Feed
│       │   └── PostCard[] (Multiple)
│       ├── Announcements
│       │   └── AnnouncementCard[] (Multiple)
│       ├── Elections
│       │   └── CandidateCard[] (Multiple)
│       └── Login (when not authenticated)
```

## 🔐 Authentication System

### Current Implementation (Mock)
```javascript
// Login Flow
1. User enters Registration Number + Password
2. Basic validation checks
3. Create user object with role detection
4. Store in state via AuthContext
5. Redirect to Feed
```

### Future Implementation (Real Backend)
```javascript
// Will use JWT tokens:
1. POST /api/auth/login with credentials
2. Receive JWT token
3. Store in localStorage
4. Include in all API requests
5. Automatic logout on token expiry
```

## 📝 Data Structures

### User Object
```javascript
{
  id: "STU-2024-001",
  name: "Student Name",
  type: "student", // or "admin", "dean", "hod", "vc"
  regNumber: "STU-2024-001",
  email: "student@tmu.edu",
  department: "Computer Science",
  verified: true
}
```

### Post Object
```javascript
{
  id: 1,
  author: "Author Name",
  type: "official", // or "student"
  icon: "👤",
  content: "Post content here",
  timestamp: "2 hours ago",
  likes: 245,
  comments: 32,
  shares: 12
}
```

### Announcement Object
```javascript
{
  id: 1,
  sender: "Vice Chancellor",
  title: "Announcement Title",
  content: "Full announcement content",
  timestamp: "Today, 9:30 AM",
  priority: "high", // or "normal"
  icon: "📚",
  attachments: []
}
```

### Candidate Object (Elections)
```javascript
{
  id: 1,
  name: "Candidate Name",
  position: "Student President",
  votes: 245,
  imageUrl: "url",
  biography: "Short bio"
}
```

## 🎨 Styling System

### Color Palette
- **Primary Blue**: `#1e3a8a` - Main brand color
- **Light Blue**: `#dbeafe` - Hover/Active states
- **Success Green**: `#22c55e` - Confirmations
- **Warning Red**: `#ef4444` - Important/Dangerous
- **Gray**: `#666` - Secondary text
- **White**: `#ffffff` - Backgrounds

### CSS Classes Organization
```
navbar/          - Top navigation styling
sidebar/         - Menu and navigation
post-card/       - Social posts
announcement/    - Official announcements
election/        - Voting interface
login/           - Authentication form
action-btn/      - Interactive buttons
```

## 🔄 State Management

### Context Structure
```javascript
AuthContext {
  user: {
    id, name, type, regNumber, email, department, verified
  },
  isLoggedIn: boolean,
  handleLogout: function
}
```

### Local Component State
- **Feed**: `posts` array
- **Elections**: `voted` boolean, `selectedCandidate`
- **Login**: `regNumber`, `password`, `error`

## 📱 Responsive Design Breakpoints

```css
Desktop:  1024px+  (Full sidebar + content)
Tablet:   768px    (Smaller sidebar)
Mobile:   <768px   (Stacked layout)
```

## 🚀 Development Workflow

### 1. Create New Feature
```bash
1. Create component in appropriate folder
2. Define prop types/data structure
3. Implement component logic
4. Add CSS classes and styling
5. Integrate with parent component
6. Test on multiple screen sizes
```

### 2. Add New Page
```bash
1. Create file in src/pages/
2. Add navigation item in Sidebar.jsx
3. Add case in App.jsx switch statement
4. Create route handler
5. Design page layout and styling
```

### 3. Styling New Components
```bash
1. Define CSS classes in main.css
2. Use existing color variables
3. Follow BEM naming convention
4. Add hover/active states
5. Ensure mobile responsiveness
```

## 🧪 Testing Scenarios

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Session persistence

### Feed
- [ ] Load sample posts
- [ ] Like/unlike posts
- [ ] Comment count display
- [ ] Share functionality

### Announcements
- [ ] Display official posts
- [ ] Filter by priority
- [ ] Verify badges display
- [ ] Timestamp accuracy

### Elections
- [ ] Load candidates
- [ ] Select candidate
- [ ] Confirm vote
- [ ] Display results
- [ ] Prevent double voting

## 🔌 API Integration Points (Future)

### Authentication Endpoints
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me
```

### Feed/Posts Endpoints
```
GET    /api/posts/feed
POST   /api/posts/create
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
POST   /api/posts/:id/comment
```

### Elections Endpoints
```
GET    /api/elections/active
GET    /api/elections/:id/candidates
POST   /api/elections/:id/vote
GET    /api/elections/:id/results
```

### Announcements Endpoints
```
GET    /api/announcements
POST   /api/announcements (admin only)
GET    /api/announcements/:id
DELETE /api/announcements/:id
```

## 📦 Dependencies

### Current
- `react@18.2.0` - UI framework
- `react-dom@18.2.0` - DOM rendering

### Recommended for Next Phase
- `axios` - HTTP client
- `react-router-dom` - Client-side routing
- `jsonwebtoken` - JWT handling
- `moment` - Date/time formatting
- `react-icons` - Icon library

## 🛡️ Security Checklist

- [ ] Input validation on all forms
- [ ] XSS protection (React built-in)
- [ ] CSRF tokens for state-changing requests
- [ ] Secure password hashing (backend)
- [ ] Rate limiting on login attempts
- [ ] Content sanitization for posts
- [ ] Access control checks
- [ ] Audit logging for admin actions

## 🐛 Known Issues & TODOs

### Current Phase
- [ ] Post creation form not yet implemented
- [ ] Admin panel is placeholder only
- [ ] Comment threads not functional
- [ ] Search feature not implemented
- [ ] Notifications system pending

### Phase 2
- [ ] Backend API integration
- [ ] Real database setup
- [ ] Production deployment
- [ ] SSL/TLS configuration

## 📞 Support & Documentation

### Key Files
- `App.jsx` - Main routing and auth logic
- `styles/main.css` - All styling
- `components/` - Reusable UI components
- `pages/` - Page-level components

### For Questions
- Check component comments for inline documentation
- Review README.md for feature overview
- Examine sample data in page components

## 🎓 Learning Resources

For developers working on TMU TIMES:
- React Hooks: https://react.dev/reference/react
- CSS Grid/Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS
- REST API Design: https://restfulapi.net/
- Authentication: https://tools.ietf.org/html/rfc7519

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0-beta
**Maintained By**: TMU Development Team
