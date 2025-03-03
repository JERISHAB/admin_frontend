import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/users/user/";

const userService = {
  getCurrentUser: async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      return response.data.data; // Ensure it matches API response structure
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return { username: "Guest", role: "No Role" }; // Return fallback values
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
  },
};

export default userService;
