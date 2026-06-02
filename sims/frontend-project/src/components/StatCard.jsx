import React from 'react';

const StatCard = ({ icon, title, value, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className={`card border ${colorClasses[color]} p-6`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend.positive ? '📈' : '📉'} {trend.text}
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
