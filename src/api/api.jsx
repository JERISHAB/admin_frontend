import axios from "axios";

// API URL
const API_URL = "http://localhost:8000/api/v1"; // Keep your existing API URL

// Function to get the access token from localStorage
export const getAccessToken = () => {
  const token = localStorage.getItem("access_token");
  console.log("Retrieved access token:", token);
  return token;
};

// Function to get the refresh token from localStorage
export const getRefreshToken = () => {
  const token = localStorage.getItem("refresh_token");
  console.log("Retrieved refresh token:", token);
  return token;
};

// Function to set the Authorization header
export const setAuthHeader = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to refresh the access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.error("No refresh token available");
      return null;
    }

    const response = await axios.post(`${API_URL}/users/refresh/`, { refresh_token: refreshToken });

    // Store new tokens
    localStorage.setItem("access_token", response.data.access_token);
    console.log("Stored new access token:", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    console.log("Stored new refresh token:", response.data.refresh_token);

    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing token", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
});

// Axios request interceptor → Automatically adds Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor → Handles 401 Unauthorized & refreshes token
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    // If request fails with 401 and it hasn't been retried already
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Update request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// === Members Section ===

// Fetch all members
export const getMembers = async () => {
  try {
    const response = await api.get("/members/");
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

// Add a new member
export const addMember = async (memberData) => {
  try {
    return await api.post("/members/create/", memberData);
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};

// Update member role
export const updateMemberRole = async (id, newRole) => {
  try {
    return await api.put(`/members/${id}/change-role/${newRole}`, {});
  } catch (error) {
    console.error("Error updating member role:", error);
    throw error;
  }
};

// Remove member
export const removeMember = async (id) => {
  try {
    return await api.delete(`/members/${id}/delete/`);
  } catch (error) {
    console.error("Error removing member:", error);
    throw error;
  }
};

// === Jobs Section ===

// Fetch all jobs
export const getJobs = async () => {
  try {
    const response = await api.get("/jobs/");
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Add a new job
export const addJob = async (jobData) => {
  try {
    return await api.post("/jobs/", jobData);
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

// Update job status
export const updateJobStatus = async (id, status) => {
  try {
    return await api.put(`/jobs/${id}/status/${status}/`, {});
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (id) => {
  try {
    return await api.delete(`/jobs/${id}/delete/`);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};