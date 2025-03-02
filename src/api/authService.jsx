import axios from "axios";

let isRefreshing = false;
let refreshQueue = [];

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve));
  }

  isRefreshing = true;

  try {
    const response = await axios.post("http://localhost:8000/api/v1/users/refresh/", {
      refresh: getRefreshToken(),
    });

    const newAccessToken = response.data.access_token;
    localStorage.setItem("accessToken", newAccessToken);
    isRefreshing = false;

    // Resolve all pending requests with new token
    refreshQueue.forEach((resolve) => resolve(newAccessToken));
    refreshQueue = [];

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    isRefreshing = false;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect user to login page
    window.location.href = "/";

    return null;
  }
};
