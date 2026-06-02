import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Layout = ({ title, children, user, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
