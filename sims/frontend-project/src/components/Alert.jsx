import React, { useEffect } from 'react';

const Alert = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-100 border-emerald-500 text-emerald-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-orange-100 border-orange-500 text-orange-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  };

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border-l-4 ${bgColor[type]} shadow-lg animate-pulse z-50`}>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{icon[type]}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Alert;
