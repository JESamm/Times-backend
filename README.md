# 📰 TMU TIMES - University News & Social Platform

A Twitter/X-like social platform designed for university campuses, featuring official announcements, student discussions, secure elections, and community engagement.

## 🎯 Features

### 📢 Official Broadcast System
- Vice Chancellors, Deans, and HODs post verified announcements
- High-priority alerts for critical updates
- Official verification badges
- Institutional announcements with timestamps

### 🧑‍🎓 Student Social Feed
- Students share updates, events, and campus issues
- Real-time engagement (likes, comments, shares)
- X/Twitter-like interface
- Post engagement metrics

### 🗳️ Digital Election System
- Secure student voting platform
- Real-time vote counting
- Multiple candidate positions
- Vote confirmation and live results

### 🪪 Identity System
- University registration number authentication
- Student-only access with password protection
- User profile management
- Session management

### 🛡️ Moderation System
- Content verification for official posts
- Official vs. student post differentiation
- Built-in safety features
- Abuse prevention (in development)

### 📊 Admin Governance Panel
- University controls content policies
- Announcement management
- User moderation tools
- System analytics (in development)

### 📱 Multi-Platform Support
- React-based web application
- Responsive design for mobile & desktop
- Cross-platform compatibility
- Touch-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React.js
- **State Management**: React Context API
- **Styling**: Custom CSS with modern design patterns
- **Authentication**: Basic JWT-ready structure
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Top navigation with user info
│   ├── PostCard.jsx     # Reusable post component
│   └── Sidebar.jsx      # Navigation menu
├── pages/
│   ├── Feed.jsx         # Student social feed
│   ├── Login.jsx        # Authentication page
│   ├── Elections.jsx    # Voting system
│   └── Announcements.jsx # Official broadcasts
├── styles/
│   └── main.css         # Global styles
├── App.jsx              # Main app component with routing
└── index.js             # React entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- React 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## 🔑 Key Components

### Authentication Flow
- Login with registration number and password
- Mock authentication (expandable to real backend)
- User context stored in AuthContext
- Automatic logout functionality

### Navigation System
- Sidebar menu with active state tracking
- Page routing without React Router
- Quick navigation between Feed, Announcements, and Elections

### Post Management
- Dynamic post rendering
- Like/unlike functionality
- Comment count display
- Share buttons
- Official post badges

### Voting System
- Candidate selection interface
- Vote confirmation
- Live results display
- Vote success notification

## 🎨 Design Features

- **Modern UI**: Clean, professional design
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessible**: Proper color contrast and semantic HTML
- **Interactive**: Smooth transitions and hover effects
- **Branded**: University-themed color scheme (#1e3a8a blue)

## 🔐 Security Considerations

- Input validation on login form
- XSS protection through React
- CSRF tokens ready (backend integration needed)
- Secure password field handling
- Official post verification system

## 📝 Sample Data

### Test Credentials
- Registration Number: `STU-2024-001`
- Any password: `password`

### Sample Posts
- Official announcements from VCs and Deans
- Student posts about events and activities
- Election announcements with candidates

## 🛠️ Future Enhancements

### Phase 2 - Backend Integration
- Express.js/Node.js backend
- MongoDB database
- Real authentication with JWT
- Post creation and management
- User profiles and settings

### Phase 3 - Advanced Features
- Full moderation dashboard
- Admin governance panel
- Real-time notifications
- Comment threads
- User mentions and hashtags
- Search functionality
- Direct messaging

### Phase 4 - Mobile App
- React Native Android app
- iOS version
- Push notifications
- Offline support

## 📊 Module Breakdown

| Module | Status | Completion |
|--------|--------|-----------|
| Student Social Feed | ✅ Done | 100% |
| Official Broadcasts | ✅ Done | 100% |
| Digital Elections | ✅ Done | 100% |
| Identity System | ✅ Done | 80% |
| UI/UX Design | ✅ Done | 95% |
| Admin Panel | 🔄 In Progress | 10% |
| Moderation System | ⏳ Planned | 0% |
| Backend API | ⏳ Planned | 0% |
| Android App | ⏳ Planned | 0% |

## 🤝 Contributing

This is a university project. For contributions or bug reports, please contact the development team.

## 📄 License

Academic Use - TMU

## 📞 Support

For issues or questions, contact:
- Project Lead: [Contact Info]
- Technical Support: [Email/Phone]

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0 (Beta)
