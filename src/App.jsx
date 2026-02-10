import { useState, createContext, useEffect } from "react";
import "./styles/main.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Elections from "./pages/Elections";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import InstallPrompt from "./components/InstallPrompt";
import { authAPI } from "./services/api";

// Auth Context
export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("feed");
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.user) {
            setUser(response.user);
            setIsLoggedIn(true);
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleLogin = (userData, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage("feed");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>📰 TMU TIMES</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "announcements":
        return <Announcements />;
      case "elections":
        return <Elections />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      case "feed":
      default:
        return <Feed />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, handleLogout }}>
      <Navbar user={user} />
      <div className="container">
        <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
        {renderPage()}
        <RightSidebar />
      </div>
      <InstallPrompt />
    </AuthContext.Provider>
  );
}

export default App;
