import { useState, useEffect } from "react";
import { statsAPI, usersAPI } from "../services/api";

function RightSidebar() {
  const [stats, setStats] = useState(null);
  const [trending, setTrending] = useState(null);
  const [whoToFollow, setWhoToFollow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, trendingRes, followRes] = await Promise.all([
        statsAPI.getStats().catch(() => null),
        statsAPI.getTrending().catch(() => null),
        statsAPI.getWhoToFollow().catch(() => null)
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (trendingRes?.trending) setTrending(trendingRes.trending);
      if (followRes?.users) setWhoToFollow(followRes.users);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sidebar data:', err);
      setError('Could not load data');
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await usersAPI.follow(userId);
      setWhoToFollow(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  if (loading) {
    return (
      <div className="right-sidebar">
        <div className="sidebar-section">
          <div className="loading-placeholder">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="right-sidebar">
      {/* Search Box */}
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search TMU TIMES" />
      </div>

      {/* Platform Stats */}
      {stats && (
        <div className="sidebar-section stats-card">
          <h3>📊 Campus Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{formatNumber(stats.users?.total || 0)}</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{formatNumber(stats.posts?.total || 0)}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{formatNumber(stats.engagement?.totalViews || 0)}</span>
              <span className="stat-label">Views</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.elections?.active || 0}</span>
              <span className="stat-label">Active Polls</span>
            </div>
          </div>
          {stats.posts?.today > 0 && (
            <div className="stat-highlight">
              🔥 {stats.posts.today} new posts today
            </div>
          )}
        </div>
      )}

      {/* Trending Topics */}
      {trending?.hashtags?.length > 0 && (
        <div className="sidebar-section trending-card">
          <h3>🔥 Trending on Campus</h3>
          <div className="trending-list">
            {trending.hashtags.slice(0, 5).map((tag, index) => (
              <div key={tag.tag} className="trending-item">
                <div className="trending-rank">{index + 1}</div>
                <div className="trending-content">
                  <span className="trending-category">Campus · Trending</span>
                  <span className="trending-topic">#{tag.tag}</span>
                  <span className="trending-posts">{tag.posts} posts</span>
                </div>
              </div>
            ))}
          </div>
          <button className="show-more-btn">Show more</button>
        </div>
      )}

      {/* Who to Follow */}
      {whoToFollow.length > 0 && (
        <div className="sidebar-section follow-card">
          <h3>👥 Who to follow</h3>
          <div className="follow-list">
            {whoToFollow.map((user) => (
              <div key={user.id} className="follow-item">
                <div className="follow-avatar">{user.avatar || "👤"}</div>
                <div className="follow-info">
                  <div className="follow-name">
                    {user.name}
                    {user.isVerified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="follow-handle">{user.handle}</div>
                  {user.bio && <div className="follow-bio">{user.bio}</div>}
                </div>
                <button 
                  className="follow-btn"
                  onClick={() => handleFollow(user.id)}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
          <button className="show-more-btn">Show more</button>
        </div>
      )}

      {/* Quick Links */}
      <div className="sidebar-section links-card">
        <h3>🔗 Quick Links</h3>
        <div className="quick-links">
          <a href="#" className="quick-link">📚 Library</a>
          <a href="#" className="quick-link">📅 Calendar</a>
          <a href="#" className="quick-link">🎓 Portal</a>
          <a href="#" className="quick-link">📧 Email</a>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer-links">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Help</a>
        <a href="#">About</a>
        <span>© 2026 TMU TIMES</span>
      </div>
    </div>
  );
}

export default RightSidebar;
