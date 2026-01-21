
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserData } from '../types';

interface DashboardProps {
  userData: UserData;
}

const COLORS = ['#1e3a8a', '#d97706', '#059669', '#7c3aed', '#dc2626'];

export const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Portfolio Allocation</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userData.assets}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="category"
              >
                {userData.assets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-2">Portfolio Overview</h3>
          <p className="text-gray-500 text-sm mb-4">Current total value and risk status</p>
          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-900">₹{userData.portfolioValue.toLocaleString()}</p>
            <p className="text-green-600 text-sm font-medium">+12.4% vs Last Year</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Risk Score</span>
              <span className="text-sm font-bold text-amber-600">{userData.riskScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${userData.riskScore}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800 font-medium">Eagle Vision Insight 🦅</p>
            <p className="text-xs text-blue-700 mt-1">Your risk profile is currently "Balanced". Consider increasing Equity SIP for long-term growth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
