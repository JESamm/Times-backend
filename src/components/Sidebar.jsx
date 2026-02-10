function Sidebar({ onNavigate, currentPage }) {
  const menuItems = [
    { id: "feed", icon: "🏠", label: "Feed" },
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "announcements", icon: "📢", label: "Announcements" },
    { id: "elections", icon: "🗳", label: "Elections" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <p className="info-text">🛡️ Moderated by University</p>
      </div>
    </div>
  );
}

export default Sidebar;
