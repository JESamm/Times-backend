function Navbar({ user }) {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1>📰 TMU TIMES</h1>
          <p className="tagline">University News & Social Feed</p>
        </div>
        <div className="navbar-right">
          {user && (
            <div className="user-info">
              <span className="user-avatar">{user.avatar || "👤"}</span>
              <div className="user-details">
                <span className="username">{user.name}</span>
                <span className="user-handle">{user.handle}</span>
              </div>
              {user.role && user.role !== "student" && (
                <span className="user-badge">{user.role.toUpperCase()}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
