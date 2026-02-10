import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import { postsAPI, usersAPI } from "../services/api";

function Profile() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    department: "",
    avatar: ""
  });

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's posts
      const postsResponse = await postsAPI.getPosts();
      // Filter posts by author ID - handle both id and _id formats
      const userId = user?.id || user?._id;
      const userPosts = postsResponse.posts.filter(post => {
        const authorId = post.author?.id || post.author?._id || post.author;
        return authorId === userId;
      });
      setPosts(userPosts);
      
      // Set profile data from user context
      setProfileData(user);
      setProfileForm({
        name: user?.name || "",
        bio: user?.bio || "",
        department: user?.department || "",
        avatar: user?.avatar || "👤"
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => (post._id || post.id) !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post._id || post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    if (!editContent.trim()) {
      alert("Post content cannot be empty");
      return;
    }
    
    try {
      const updated = await postsAPI.updatePost(postId, { content: editContent });
      setPosts(posts.map(post => 
        (post._id || post.id) === postId ? { ...post, content: editContent } : post
      ));
      setEditingPost(null);
      setEditContent("");
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post");
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditContent("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await usersAPI.updateProfile(profileForm);
      setProfileData({ ...profileData, ...profileForm });
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const avatarEmojis = ["👤", "👨", "👩", "🧑", "👨‍💻", "👩‍💻", "🧑‍💻", "👨‍🎓", "👩‍🎓", "🧑‍🎓", "👨‍🏫", "👩‍🏫", "😊", "😎", "🤓", "🦊", "🐱", "🐶", "🦁", "🐯"];

  if (loading) {
    return (
      <div className="feed">
        <div className="profile-loading">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-cover"></div>
        <div className="profile-info-section">
          <div className="profile-avatar-large">
            {profileData?.avatar || "👤"}
          </div>
          <div className="profile-details">
            <h2>{profileData?.name}</h2>
            <p className="profile-handle">@{profileData?.handle?.replace('@', '') || 'user'}</p>
            <p className="profile-bio">{profileData?.bio || "No bio yet"}</p>
            <div className="profile-meta">
              <span>🎓 {profileData?.department || "No department"}</span>
              <span>📧 {profileData?.email}</span>
              <span>🆔 {profileData?.regNumber}</span>
            </div>
          </div>
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            {isEditingProfile ? "Cancel" : "✏️ Edit Profile"}
          </button>
        </div>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                  placeholder="Your department"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                maxLength={280}
              />
              <small>{profileForm.bio.length}/280</small>
            </div>
            <div className="form-group">
              <label>Avatar</label>
              <div className="avatar-picker">
                {avatarEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className={`avatar-option ${profileForm.avatar === emoji ? 'selected' : ''}`}
                    onClick={() => setProfileForm({...profileForm, avatar: emoji})}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="save-profile-btn">
              💾 Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 My Posts ({posts.length})
        </button>
        <button 
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="profile-posts">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>📭 You haven't posted anything yet.</p>
              <p>Go to the Feed to create your first post!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id || post.id} className="profile-post-card">
                <div className="post-header">
                  <div className="author-avatar">{user?.avatar || "👤"}</div>
                  <div className="author-info">
                    <h4>{user?.name}</h4>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="post-actions-menu">
                    <button 
                      className="post-menu-btn edit"
                      onClick={() => handleEditPost(post)}
                      title="Edit post"
                    >
                      ✏️
                    </button>
                    <button 
                      className="post-menu-btn delete"
                      onClick={() => handleDeletePost(post._id || post.id)}
                      title="Delete post"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {editingPost === (post._id || post.id) ? (
                  <div className="edit-post-form">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit your post..."
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-edit-btn"
                        onClick={() => handleSaveEdit(post._id || post.id)}
                      >
                        ✅ Save
                      </button>
                      <button 
                        className="cancel-edit-btn"
                        onClick={handleCancelEdit}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="post-body">
                    <p>{post.content}</p>
                    {post.media && (
                      <div className="post-media">
                        {post.type === 'image' ? (
                          <img src={post.media} alt="Post media" />
                        ) : post.type === 'video' ? (
                          <video src={post.media} controls />
                        ) : null}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="post-stats">
                  <span>❤️ {post.likes?.length || 0} likes</span>
                  <span>💬 {post.comments?.length || 0} comments</span>
                  <span>👁️ {post.views || 0} views</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-value">
              {posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)}
            </div>
            <div className="stat-label">Total Likes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-value">
              {posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
            </div>
            <div className="stat-label">Total Comments</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-value">
              {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
            </div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
