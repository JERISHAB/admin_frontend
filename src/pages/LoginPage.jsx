import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login/", {
        email,
        password,
      });

      // Check if the response contains the access token and refresh token
      if (response.data && response.data.data && response.data.data.access_token && response.data.data.refresh_token) {
        localStorage.setItem("accessToken", response.data.data.access_token); // Save the access token
        localStorage.setItem("refreshToken", response.data.data.refresh_token); // Save the refresh token
        navigate("/members");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Parent Container */}
      <div className="w-3/5 flex justify-center items-center bg-blue-900 text-white">
        {/* Centered Content Container */}
        <div className="w-96">
          {/* Boson Admin Heading (Left-Aligned) */}
          <h1 className="text-lg text-gray-300 mb-6">Boson Admin</h1>

          {/* Login Box */}
          <div className="bg-white p-8 rounded-lg shadow-lg text-black">
            <h2 className="text-2xl mb-4 ">Welcome back !</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image (40%) */}
      <div className="w-2/5">
        <img
          src="/login-img.png"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;