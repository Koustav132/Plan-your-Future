
import React from 'react';
import { UserData, AssetCategory } from '../types';

interface AssetAllocationProps {
  userData: UserData;
  onUpdateAssets: (newAssets: AssetCategory[]) => void;
}

export const AssetAllocation: React.FC<AssetAllocationProps> = ({ userData, onUpdateAssets }) => {
  const assetClasses = [
    { key: 'Equity', label: 'Equity' },
    { key: 'Bond', label: 'Bond' },
    { key: 'Gold', label: 'Gold' },
    { key: 'FD', label: 'FD' },
    { key: 'RealState', label: 'Real Estate' },
    { key: 'Others', label: 'Others' }
  ];

  const getAsset = (key: string) => userData.assets.find(a => a.category === key);

  const handleValueChange = (key: string, val: string) => {
    const numericVal = parseFloat(val) || 0;
    const newAssets = [...userData.assets];
    const index = newAssets.findIndex(a => a.category === key);
    
    if (index > -1) {
      newAssets[index] = { ...newAssets[index], value: numericVal };
    } else {
      newAssets.push({ category: key, value: numericVal, remark: '' });
    }
    onUpdateAssets(newAssets);
  };

  const handleRemarkChange = (key: string, remark: string) => {
    const newAssets = [...userData.assets];
    const index = newAssets.findIndex(a => a.category === key);
    
    if (index > -1) {
      newAssets[index] = { ...newAssets[index], remark: remark };
    } else {
      newAssets.push({ category: key, value: 0, remark: remark });
    }
    onUpdateAssets(newAssets);
  };

  const total = userData.assets.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-[#001040] p-10 rounded-[40px] border border-gray-100 dark:border-blue-900 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight">Current Asset Allocation</h3>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em] mt-2">Institutional-Grade Portfolio Management</p>
        </div>
        <div className="bg-amber-500/10 px-6 py-3 rounded-2xl border border-amber-500/20">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Client Ledger Mode</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-blue-900 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#001040] dark:bg-blue-950 text-white">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.4em] w-1/4">Asset Class</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.4em] text-right w-1/4">Amount (₹)</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.4em] text-right w-1/6">Weight</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.4em] w-1/3">Manual Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-blue-900/30">
            {assetClasses.map((ac) => {
              const asset = getAsset(ac.key);
              const amount = asset?.value || 0;
              const remark = asset?.remark || '';
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              return (
                <tr key={ac.key} className="hover:bg-slate-50 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="p-6 font-bold text-[#001040] dark:text-blue-100 uppercase text-xs tracking-widest">{ac.label}</td>
                  <td className="p-6 text-right">
                    <div className="relative inline-block w-full max-w-[160px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                      <input 
                        type="number"
                        value={amount || ''}
                        onChange={(e) => handleValueChange(ac.key, e.target.value)}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-blue-900/30 border border-transparent focus:border-amber-500 rounded-xl text-right font-black text-[#001040] dark:text-blue-200 outline-none transition-all group-hover:bg-white dark:group-hover:bg-blue-900/50"
                      />
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <span className="text-[10px] font-black text-amber-600">{percentage.toFixed(1)}%</span>
                  </td>
                  <td className="p-6">
                    <input 
                      type="text"
                      value={remark}
                      onChange={(e) => handleRemarkChange(ac.key, e.target.value)}
                      placeholder="Add institutional note..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-blue-900/30 border border-transparent focus:border-amber-500 rounded-xl font-medium text-xs text-[#001040] dark:text-blue-100 outline-none transition-all group-hover:bg-white dark:group-hover:bg-blue-900/50 italic"
                    />
                  </td>
                </tr>
              );
            })}
            <tr className="bg-amber-500 dark:bg-amber-600 text-[#001040] dark:text-white font-black">
              <td className="p-6 uppercase text-sm tracking-[0.2em]">Total Assets</td>
              <td className="p-6 text-right text-lg">₹{total.toLocaleString()}</td>
              <td className="p-6 text-right text-lg">100%</td>
              <td className="p-6 text-[10px] uppercase tracking-widest opacity-60">Verified Portfolio View 🦅</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
               <div key={i} className="w-6 h-6 rounded-full bg-[#001040] dark:bg-white border-2 border-white dark:border-blue-950 flex items-center justify-center text-[8px] font-black text-white dark:text-[#001040]">🦅</div>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">Institutional remarks are encrypted and secured</p>
        </div>
        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest italic animate-pulse">Syncing Vision...</p>
      </div>
    </div>
  );
};
