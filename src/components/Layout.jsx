import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="bg-white text-black p-4 w-full shadow-md">
        <h1 className="text-xl font-bold">Boson Admin</h1>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-200 text-black p-4">
          <ul>
            <li className="mb-2">
              <Link 
                to="/members" 
                className="text-black hover:text-blue-500 hover:underline"
              >
                Members
              </Link>
            </li>
            <li>
              <Link 
                to="/careers" 
                className="text-black hover:text-blue-500 hover:underline"
              >
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-4/5 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;