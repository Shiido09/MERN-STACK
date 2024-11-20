import React from 'react';
import { Link } from 'react-router-dom';
import { handleLogout } from '../../components/authUtils'; // Adjust the import path as needed
import { FaShoppingCart } from 'react-icons/fa'; // Cart icon from react-icons

const Header = ({ isAuthenticated, user, setIsAuthenticated, setUser, setIsAdmin }) => {
  const logout = async () => {
    console.log("Logout button clicked in Header");
    await handleLogout(setIsAuthenticated, setUser, setIsAdmin);
    console.log("Logout function executed in Header");
  };

  return (
    <header className="w-full bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 h-16"> {/* Fixed height for consistent alignment */}
          <div className="text-2xl font-bold text-white">HAB APPLIANCES</div>
          <nav className="space-x-6">
            <Link to="/index" className="text-white hover:text-gray-300">Home</Link>
            <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
            <Link to="/brand" className="text-white hover:text-gray-300">Brand</Link>
            <Link to="/vlogs" className="text-white hover:text-gray-300">Blogs</Link>
            {isAuthenticated ? (
              <>
                <Link to="/Carts" className="text-white hover:text-gray-300 flex items-center">
                  <FaShoppingCart className="mr-2" />
                  Cart
                </Link>
                <Link to="/Orders" className="text-white hover:text-gray-300">Orders</Link>
                <Link to="/account" className="text-white hover:text-gray-300">Account</Link>
                <button onClick={logout} className="text-white hover:text-gray-300">Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-300">Log In</Link>
                <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { handleLogout } from '../../components/authUtils'; // Adjust the import path as needed

// const Header = ({ isAuthenticated, user, setIsAuthenticated, setUser, setIsAdmin }) => {
//   const logout = async () => {
//     console.log("Logout button clicked in Header");
//     await handleLogout(setIsAuthenticated, setUser, setIsAdmin);
//     console.log("Logout function executed in Header");
//   };

//   return (
//     <header className="w-full bg-slate-900 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4 h-16"> {/* Fixed height for consistent alignment */}
//           <div className="text-2xl font-bold text-white">HAB APPLIANCES</div>
//           <nav className="space-x-6">
//           <Link to="/index" className="text-white hover:text-gray-300">Home</Link>
//             <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
//             <Link to="/brand" className="text-white hover:text-gray-300">Brand</Link>
//             <Link to="/vlogs" className="text-white hover:text-gray-300">Blogs</Link>
//             {isAuthenticated ? (
//               <>
//                 <Link to="/Carts" className="text-white hover:text-gray-300">Cart</Link>
//                 <Link to="/Orders" className="text-white hover:text-gray-300">Orders</Link>
//                 <Link to="/account" className="text-white hover:text-gray-300">Account</Link>
//                 <button onClick={logout} className="text-white hover:text-gray-300">Log Out</button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="text-white hover:text-gray-300">Log In</Link>
//                 <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
//               </>
//             )}
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
