import React, { useState } from "react";
import { FaTachometerAlt, FaUser, FaBlog, FaTags, FaBox, FaSignOutAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { handleLogout } from '../../components/authUtils'; // Adjusted path

const Sidebar = ({ setIsAuthenticated, setUser, setIsAdmin }) => {
  const navigate = useNavigate(); 
  const [isMinimized, setIsMinimized] = useState(false); // State to control sidebar visibility

  const logout = async () => {
    await handleLogout(setIsAuthenticated, setUser, setIsAdmin); // Call the imported function
    navigate('/login'); // Navigate to login page after logout
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
            <a href="/admin/dashboard" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaTachometerAlt />
              {!isMinimized && 'Dashboard'} {/* Show text only if not minimized */}
            </a>
          </li>
          <li>
            <a href="/user" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaUser />
              {!isMinimized && 'User'}
            </a>
          </li>
          <li>
            <a href="/blogs" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaBlog />
              {!isMinimized && 'Blogs'}
            </a>
          </li>
          <li>
            <a href="/brands" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaTags />
              {!isMinimized && 'Brands'}
            </a>
          </li>
          <li>
            <a href="/admin/products" className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white ${isMinimized ? 'justify-center' : ''}`}>
              <FaBox />
              {!isMinimized && 'Products'}
            </a>
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
