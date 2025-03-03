import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import user icon
import userService from "../api/userService";

const Layout = ({ children }) => {
  const [user, setUser] = useState({ name: "", role: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logout clicked");
    // For example, clear the authentication token and redirect to the login page
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="bg-white text-black p-4 w-full shadow-md">
        <h1 className="text-xl font-bold">Boson Admin</h1>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-200 p-4 flex flex-col justify-between h-full">
          {/* Navigation Links */}
          <ul>
            {["Members", "Careers"].map((item) => (
              <li key={item} className="mb-2">
                <NavLink
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative block px-4 py-2 transition-all font-medium 
                    ${isActive ? "text-blue-500" : "text-black"} 
                    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-[60%] 
                    after:bg-blue-500 after:transition-transform after:duration-300 after:ease-in-out 
                    after:origin-left after:scale-x-0 
                    ${isActive ? "after:scale-x-100" : ""}`
                  }
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Info at Bottom */}
          <div className="relative flex items-center gap-3 p-4 rounded-lg group">
            <FaUserCircle className="text-4xl text-gray-500" />
            <div>
              <p className="text-black font-semibold">{user.username}</p>
              <p className="text-gray-600 text-sm">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="absolute right-0 top-0 mt-2 mr-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-4/5 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
