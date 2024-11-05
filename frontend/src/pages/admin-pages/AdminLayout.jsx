import React from "react";
import Sidebar from "./sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-10 ml-64">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
