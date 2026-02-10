import { useState } from "react";
import { authAPI } from "../services/api";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNumber: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.regNumber || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authAPI.login({
        regNumber: formData.regNumber,
        password: formData.password
      });

      if (response.success && response.token) {
        onLogin(response.user, response.token);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.regNumber || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        regNumber: formData.regNumber,
        password: formData.password,
        department: formData.department,
        role: formData.role
      });

      if (response.success && response.token) {
        onLogin(response.user, response.token);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📰 TMU TIMES</h1>
        <h2>{isRegister ? "Create Account" : "Welcome to Campus News"}</h2>
        
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g., john.doe@student.tmu.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Registration Number *</label>
            <input
              type="text"
              name="regNumber"
              placeholder="e.g., STU-2024-001"
              value={formData.regNumber}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g., Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Please wait..." : (isRegister ? "Create Account" : "Login")}
          </button>
        </form>

        <p className="signup-link">
          {isRegister ? (
            <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(false); setError(""); }}>Login here</a></>
          ) : (
            <>Not registered? <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(true); setError(""); }}>Register here</a></>
          )}
        </p>

        {!isRegister && (
          <div className="test-credentials">
            <p>📝 Test Credentials:</p>
            <code>STU-2024-001 / password123</code>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
