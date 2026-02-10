import { useState, useEffect } from "react";
import { announcementsAPI } from "../services/api";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAnnouncements();
  }, [filter]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filter !== "all") {
        params.priority = filter;
      }

      const response = await announcementsAPI.getAnnouncements(params);
      
      if (response.success) {
        const transformedAnnouncements = response.announcements.map(ann => ({
          id: ann._id,
          sender: ann.author?.name || "Administration",
          title: ann.title,
          content: ann.content,
          timestamp: formatTimestamp(ann.publishedAt || ann.createdAt),
          priority: ann.priority || "normal",
          icon: ann.icon || "📢",
          category: ann.category,
          isPinned: ann.isPinned,
          views: ann.views || 0
        }));
        setAnnouncements(transformedAnnouncements);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Could not load announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return "Today, " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday, " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleAcknowledge = async (id) => {
    try {
      await announcementsAPI.acknowledge(id);
      // Optionally update UI to show acknowledged state
    } catch (err) {
      console.error('Error acknowledging:', err);
    }
  };

  // Sort: pinned first, then by priority, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (a.priority !== "high" && b.priority === "high") return 1;
    return 0;
  });

  return (
    <div className="feed">
      <h2>📢 Official Announcements</h2>
      
      {/* Filter Tabs */}
      <div className="announcement-filters">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === "high" ? "active" : ""}`}
          onClick={() => setFilter("high")}
        >
          ⚠️ Important
        </button>
        <button 
          className={`filter-btn ${filter === "normal" ? "active" : ""}`}
          onClick={() => setFilter("normal")}
        >
          📋 General
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchAnnouncements}>Retry</button>
        </div>
      )}

      {/* Announcements List */}
      <div className="announcements-container">
        {loading ? (
          <div className="loading-posts">
            <div className="spinner"></div>
            <p>Loading announcements...</p>
          </div>
        ) : sortedAnnouncements.length === 0 ? (
          <div className="empty-feed">
            <p>📭 No announcements</p>
            <p>Check back later for updates!</p>
          </div>
        ) : (
          sortedAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`announcement-card ${announcement.priority} ${announcement.isPinned ? "pinned" : ""}`}
            >
              {announcement.isPinned && (
                <div className="pinned-badge">📌 Pinned</div>
              )}
              <div className="announcement-header">
                <span className="announcement-icon">{announcement.icon}</span>
                <div className="announcement-meta">
                  <h4>{announcement.sender}</h4>
                  <span className="timestamp">{announcement.timestamp}</span>
                </div>
              </div>
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-content">{announcement.content}</p>
              {announcement.priority === "high" && (
                <div className="priority-badge">⚠️ IMPORTANT</div>
              )}
              <div className="announcement-footer">
                <span className="views">👁️ {announcement.views} views</span>
                <button 
                  className="acknowledge-btn"
                  onClick={() => handleAcknowledge(announcement.id)}
                >
                  ✓ Acknowledge
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Announcements;
