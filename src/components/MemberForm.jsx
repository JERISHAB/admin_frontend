import { useState, useEffect } from "react";
import axios from "axios";

const MemberForm = ({ onClose }) => {
  const [newMember, setNewMember] = useState({
    username: "",
    email: "",
    role: "editor",
    password: "", // Password field added
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  // Function to get the refresh token from local storage
  const getStoredToken = () => {
    return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
  };

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setRefreshToken(token);
    } else {
      setError("Authentication token missing. Please log in again.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!refreshToken) {
      setError("Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/members/create/", // Ensure this matches your backend API
        newMember,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNewMember({ username: "", email: "", role: "editor", password: "" });
      onClose();
      onSubmit(); // Refresh and navigate
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-blue-600 text-sm mb-4">Create Member</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Choose Role</label>
            <select
              name="role"
              value={newMember.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Enter Email</label>
            <input
              type="email"
              name="email"
              value={newMember.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Enter Username</label>
            <input
              type="text"
              name="username"
              value={newMember.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Enter Password</label>
            <input
              type="password"
              name="password"
              value={newMember.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Member"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
