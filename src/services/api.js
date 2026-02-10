// API Configuration
// For Android: use 10.0.2.2 (emulator) or your computer's IP (physical device)
const getApiUrl = () => {
  // Check if running in Capacitor (Android/iOS)
  if (window.Capacitor?.isNativePlatform()) {
    // Use your computer's local IP for physical devices
    // Use 10.0.2.2 for Android emulator
    return 'http://192.168.0.114:5000/api';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Base fetch with auth
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getMe: () => fetchWithAuth('/auth/me'),

  updatePassword: (passwords) => fetchWithAuth('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(passwords)
  }),

  logout: () => fetchWithAuth('/auth/logout', { method: 'POST' })
};

// Users API
export const usersAPI = {
  getUser: (id) => fetchWithAuth(`/users/${id}`),

  updateProfile: (profileData) => fetchWithAuth('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  uploadProfileImage: (formData) => fetchWithAuth('/users/profile/image', {
    method: 'PUT',
    body: formData
  }),

  follow: (userId) => fetchWithAuth(`/users/${userId}/follow`, {
    method: 'POST'
  }),

  unfollow: (userId) => fetchWithAuth(`/users/${userId}/follow`, {
    method: 'DELETE'
  }),

  getFollowers: (userId) => fetchWithAuth(`/users/${userId}/followers`),

  getFollowing: (userId) => fetchWithAuth(`/users/${userId}/following`)
};

// Posts API
export const postsAPI = {
  getPosts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/posts${query ? `?${query}` : ''}`);
  },

  getPost: (id) => fetchWithAuth(`/posts/${id}`),

  createPost: (postData) => {
    if (postData instanceof FormData) {
      return fetchWithAuth('/posts', {
        method: 'POST',
        body: postData
      });
    }
    return fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  updatePost: (id, postData) => fetchWithAuth(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData)
  }),

  deletePost: (id) => fetchWithAuth(`/posts/${id}`, {
    method: 'DELETE'
  }),

  likePost: (id) => fetchWithAuth(`/posts/${id}/like`, {
    method: 'POST'
  }),

  repostPost: (id) => fetchWithAuth(`/posts/${id}/repost`, {
    method: 'POST'
  }),

  bookmarkPost: (id) => fetchWithAuth(`/posts/${id}/bookmark`, {
    method: 'POST'
  }),

  getComments: (postId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/posts/${postId}/comments${query ? `?${query}` : ''}`);
  },

  addComment: (postId, content) => fetchWithAuth(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content })
  }),

  trackView: (postId) => fetchWithAuth(`/posts/${postId}/view`, {
    method: 'POST'
  })
};

// Announcements API
export const announcementsAPI = {
  getAnnouncements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/announcements${query ? `?${query}` : ''}`);
  },

  getAnnouncement: (id) => fetchWithAuth(`/announcements/${id}`),

  createAnnouncement: (data) => {
    if (data instanceof FormData) {
      return fetchWithAuth('/announcements', {
        method: 'POST',
        body: data
      });
    }
    return fetchWithAuth('/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateAnnouncement: (id, data) => fetchWithAuth(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteAnnouncement: (id) => fetchWithAuth(`/announcements/${id}`, {
    method: 'DELETE'
  }),

  acknowledge: (id) => fetchWithAuth(`/announcements/${id}/acknowledge`, {
    method: 'POST'
  })
};

// Elections API
export const electionsAPI = {
  getElections: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/elections${query ? `?${query}` : ''}`);
  },

  getElection: (id) => fetchWithAuth(`/elections/${id}`),

  createElection: (data) => fetchWithAuth('/elections', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  addCandidate: (electionId, candidateData) => fetchWithAuth(`/elections/${electionId}/candidates`, {
    method: 'POST',
    body: JSON.stringify(candidateData)
  }),

  removeCandidate: (electionId, candidateId) => fetchWithAuth(`/elections/${electionId}/candidates/${candidateId}`, {
    method: 'DELETE'
  }),

  vote: (electionId, candidateIds) => fetchWithAuth(`/elections/${electionId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ candidateIds })
  }),

  getResults: (electionId) => fetchWithAuth(`/elections/${electionId}/results`),

  deleteElection: (id) => fetchWithAuth(`/elections/${id}`, {
    method: 'DELETE'
  })
};

// Stats API
export const statsAPI = {
  getStats: () => fetchWithAuth('/stats'),
  getTrending: () => fetchWithAuth('/stats/trending'),
  getWhoToFollow: () => fetchWithAuth('/stats/who-to-follow'),
  getLive: () => fetchWithAuth('/stats/live')
};

// Health check
export const healthCheck = () => fetch(`${API_URL}/health`).then(res => res.json());

export default {
  auth: authAPI,
  users: usersAPI,
  posts: postsAPI,
  announcements: announcementsAPI,
  elections: electionsAPI,
  stats: statsAPI,
  healthCheck
};
