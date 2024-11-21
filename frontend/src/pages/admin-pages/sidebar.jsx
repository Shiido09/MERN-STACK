// src/pages/admin-pages/sidebar.jsx
import React, { useState } from "react";
import { FaTachometerAlt, FaUser, FaBlog, FaTags, FaBox, FaSignOutAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import { handleLogout } from '../../components/authUtils'; // Adjusted path
import { toast } from "react-toastify";
const Sidebar = ({ setIsAuthenticated, setUser, setIsAdmin }) => {
  const navigate = useNavigate(); 
  const [isMinimized, setIsMinimized] = useState(false); // State to control sidebar visibility

  const logout = async () => {
    await handleLogout(setIsAuthenticated, setUser, setIsAdmin);
    navigate('/login'); // Navigate to login page after logout
    toast.success("Logged out successfully");
  };

  const toggleSidebar = () => {
    setIsMinimized(prevState => !prevState); // Toggle minimized state
  };

  return (
    <div className={`h-screen w-${isMinimized ? '16' : '64'} bg-gray-800 text-white fixed flex flex-col justify-between transition-all duration-300`}>
      <div className="px-4 py-6 flex items-center justify-between">
        <h1 className={`text-2xl font-semibold text-center text-white ${isMinimized ? 'hidden' : ''}`}>Admin Panel</h1>
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
          {isMinimized ? <FaAngleRight /> : <FaAngleLeft />} {/* Toggle icon */}
        </button>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-4">
          <li>
            <Link to="/admin/dashboard" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaTachometerAlt />
              {!isMinimized && 'Dashboard'} {/* Show text only if not minimized */}
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaUser />
              {!isMinimized && 'User'}
            </Link>
          </li>
          <li>
            <Link to="/blogs" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaBlog />
              {!isMinimized && 'Blogs'}
            </Link>
          </li>
          <li>
            <Link to="/brands" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaTags />
              {!isMinimized && 'Brands'}
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaBox />
              {!isMinimized && 'Products'}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={logout} // Call the new logout function
          className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white w-full text-left"
        >
          <FaSignOutAlt />
          {!isMinimized && 'Logout'} {/* Show text only if not minimized */}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;