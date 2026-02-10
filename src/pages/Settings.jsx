import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { usersAPI, authAPI } from "../services/api";

function Settings() {
  const { user, handleLogout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("account");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Account settings state
  const [accountData, setAccountData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    department: user?.department || "",
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showDepartment: true,
    allowMessages: true,
    showOnlineStatus: true,
    profileVisibility: "public", // public, students, private
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Apply theme on mount and changes
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAccountChange = (e) => {
    setAccountData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveAccountSettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      
      const response = await usersAPI.updateProfile(accountData);
      if (response.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      
      // Save privacy settings
      localStorage.setItem("privacySettings", JSON.stringify(privacySettings));
      setMessage({ type: "success", text: "Privacy settings saved!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save privacy settings" });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      
      const response = await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      handleLogout();
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p>Manage your account and preferences</p>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.type === "success" ? "✓" : "⚠"} {message.text}
        </div>
      )}

      <div className="settings-container">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
          
          {/* Sign Out Button */}
          <button className="settings-tab signout-tab" onClick={handleSignOut}>
            <span className="tab-icon">🚪</span>
            <span className="tab-label">Sign Out</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="settings-section">
              <h3>Account Information</h3>
              
              <div className="settings-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={accountData.name}
                    onChange={handleAccountChange}
                    placeholder="Your display name"
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={accountData.bio}
                    onChange={handleAccountChange}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={280}
                  />
                  <small>{accountData.bio.length}/280 characters</small>
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={accountData.department}
                    onChange={handleAccountChange}
                    placeholder="Your department"
                  />
                </div>

                <div className="form-group readonly">
                  <label>Registration Number</label>
                  <input type="text" value={user?.regNumber || ""} disabled />
                  <small>This cannot be changed</small>
                </div>

                <div className="form-group readonly">
                  <label>Email</label>
                  <input type="text" value={user?.email || ""} disabled />
                  <small>Contact admin to change email</small>
                </div>

                <button 
                  className="save-btn" 
                  onClick={saveAccountSettings}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="settings-divider"></div>

              <h3>Change Password</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <button 
                  className="save-btn" 
                  onClick={changePassword}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                >
                  {saving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="settings-section">
              <h3>Privacy Settings</h3>
              <p className="section-description">Control who can see your information</p>
              
              <div className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Show Email Address</span>
                    <span className="toggle-description">Allow other users to see your email</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) => handlePrivacyChange("showEmail", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Show Department</span>
                    <span className="toggle-description">Display your department on your profile</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.showDepartment}
                      onChange={(e) => handlePrivacyChange("showDepartment", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Allow Direct Messages</span>
                    <span className="toggle-description">Let other users send you messages</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.allowMessages}
                      onChange={(e) => handlePrivacyChange("allowMessages", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Show Online Status</span>
                    <span className="toggle-description">Let others see when you're online</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={privacySettings.showOnlineStatus}
                      onChange={(e) => handlePrivacyChange("showOnlineStatus", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="form-group">
                  <label>Profile Visibility</label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="students">TMU Only - Only TMU members</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <button 
                  className="save-btn" 
                  onClick={savePrivacySettings}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Privacy Settings"}
                </button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="settings-section">
              <h3>Appearance</h3>
              <p className="section-description">Customize how TMU TIMES looks</p>
              
              <div className="settings-form">
                <div className="theme-selector">
                  <div className="toggle-info">
                    <span className="toggle-label">Theme</span>
                    <span className="toggle-description">
                      {theme === "light" ? "Light mode is active" : "Dark mode is active"}
                    </span>
                  </div>
                  
                  <div className="theme-buttons">
                    <button
                      className={`theme-btn ${theme === "light" ? "active" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      ☀️ Light
                    </button>
                    <button
                      className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      🌙 Dark
                    </button>
                  </div>
                </div>

                <div className="theme-preview">
                  <div className={`preview-card ${theme}`}>
                    <div className="preview-header">Preview</div>
                    <div className="preview-content">
                      <p>This is how your feed will look.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <p className="section-description">Choose what notifications you receive</p>
              
              <div className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">New Announcements</span>
                    <span className="toggle-description">Get notified about official announcements</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Post Likes</span>
                    <span className="toggle-description">When someone likes your post</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Comments</span>
                    <span className="toggle-description">When someone comments on your post</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Elections Updates</span>
                    <span className="toggle-description">Updates about student elections</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-group">
                  <div className="toggle-info">
                    <span className="toggle-label">Email Notifications</span>
                    <span className="toggle-description">Receive notifications via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
