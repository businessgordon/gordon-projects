import React from 'react';

const Navbar = ({ title }) => {
  return (
    <div className="bg-white shadow-md p-6 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">SmartPark Inc.</p>
          <p className="text-sm text-gray-500">Rubavu District, Rwanda</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
