
import React, { useState, useEffect } from 'react';
import { AdminMetrics, UserData, AssetCategory } from '../types';
import { Button } from './Button';
import { getMarketUpdate } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

const INITIAL_MOCK_CLIENTS: UserData[] = [
  {
    name: "Amit Sharma",
    age: 34,
    email: "amit@vision.com",
    phone: "+91 98300 12345",
    role: 'client',
    riskScore: 35,
    portfolioValue: 1250000,
    assets: [
      { category: 'Equity', value: 750000 },
      { category: 'Bond', value: 300000 },
      { category: 'Gold', value: 100000 },
      { category: 'FD', value: 100000 }
    ],
    notes: "Planning for early retirement.",
    goals: [
      { id: '1', title: 'Child Education', type: 'education', targetAmount: 5000000, currentAmount: 1200000, deadline: '2035-01-01' },
      { id: '1b', title: 'World Tour', type: 'other', targetAmount: 1000000, currentAmount: 500000, deadline: '2028-01-01' }
    ]
  },
  {
    name: "Sneha Gupta",
    age: 28,
    email: "sneha@growth.in",
    phone: "+91 88200 55443",
    role: 'client',
    riskScore: 52,
    portfolioValue: 4500000,
    assets: [
      { category: 'Equity', value: 3800000 },
      { category: 'Gold', value: 700000 }
    ],
    notes: "Young professional seeking high alpha.",
    goals: [
      { id: '2', title: 'Dream Home', type: 'home', targetAmount: 20000000, currentAmount: 18000000, deadline: '2030-06-15' }
    ]
  },
  {
    name: "Rajesh Kumar",
    age: 62,
    email: "rajesh@retired.com",
    phone: "+91 99033 88221",
    role: 'client',
    riskScore: 12,
    portfolioValue: 8500000,
    assets: [
      { category: 'Bond', value: 5000000 },
      { category: 'FD', value: 3000000 },
      { category: 'Gold', value: 500000 }
    ],
    notes: "Post-retirement income generation.",
    goals: [
      { id: '3', title: 'Health Reserve', type: 'other', targetAmount: 2000000, currentAmount: 1500000, deadline: '2025-01-01' }
    ]
  }
];

export const AdminDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'vault'>('overview');
  const [clients, setClients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const [minRisk, setMinRisk] = useState<number>(0);
  const [maxRisk, setMaxRisk] = useState<number>(100);
  const [minAum, setMinAum] = useState<number>(0);
  const [maxAum, setMaxAum] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-track' | 'behind' | 'realized'>('all');
  
  const [metrics] = useState<AdminMetrics>({
    totalAUM: 154200000,
    activeClients: 1242,
    pendingReviews: 18,
    marketSentiment: "Cautiously Bullish"
  });

  const [wisdomText, setWisdomText] = useState("Focus on Financial Wisdom-grade allocation. Protect the principal, then seek the growth.");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('clients').select('*');
        if (!error && data && data.length > 0) {
          setClients(data);
        } else {
          setClients(INITIAL_MOCK_CLIENTS);
        }
      } catch (err) {
        console.error("Supabase fetch failed", err);
        setClients(INITIAL_MOCK_CLIENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const fetchUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await getMarketUpdate("Current Indian Market Summary");
      setWisdomText(result.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRisk = client.riskScore >= minRisk && client.riskScore <= maxRisk;
    const matchAum = client.portfolioValue >= minAum && (maxAum === null || client.portfolioValue <= maxAum);
    
    const goals = client.goals || [];
    let avgProgress = 0;
    if (goals.length > 0) {
      const sum = goals.reduce((acc, g) => acc + (g.currentAmount / g.targetAmount), 0);
      avgProgress = sum / goals.length;
    }

    let matchStatus = true;
    if (statusFilter === 'on-track') matchStatus = avgProgress > 0.5;
    if (statusFilter === 'behind') matchStatus = goals.length > 0 && avgProgress <= 0.5;
    if (statusFilter === 'realized') matchStatus = goals.some((g) => (g.currentAmount / g.targetAmount) >= 1);

    return matchSearch && matchRisk && matchAum && matchStatus;
  });

  const activeFilterCount = (minRisk > 0 ? 1 : 0) + (maxRisk < 100 ? 1 : 0) + (minAum > 0 ? 1 : 0) + (maxAum !== null ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const getAssetValue = (assets: AssetCategory[], category: string) => {
    const asset = assets ? assets.find((a) => a.category === category) : null;
    return asset ? asset.value : 0;
  };

  const generateDataArray = (): (string | number)[][] => {
    const headers: string[] = [
      "Client Name", "Phone number", "Email id", "Risk Score", 
      "Equity", "Bond", "Gold", "Fixed Deposit", "Real Estate", "Other", 
      "Total", "Goal 1", "Amt 1", "Goal 2", "Amt 2", "Goal 3", "Amt 3"
    ];

    const rows: (string | number)[][] = filteredClients.map((client) => {
      const goals = client.goals || [];
      return [
        client.name,
        client.phone || 'N/A',
        client.email,
        client.riskScore,
        getAssetValue(client.assets, 'Equity'),
        getAssetValue(client.assets, 'Bond'),
        getAssetValue(client.assets, 'Gold'),
        getAssetValue(client.assets, 'FD'),
        getAssetValue(client.assets, 'RealState'),
        getAssetValue(client.assets, 'Others'),
        client.portfolioValue,
        goals[0] ? goals[0].title : '-',
        goals[0] ? goals[0].targetAmount : 0,
        goals[1] ? goals[1].title : '-',
        goals[1] ? goals[1].targetAmount : 0,
        goals[2] ? goals[2].title : '-',
        goals[2] ? goals[2].targetAmount : 0
      ];
    });

    return [headers as (string | number)[], ...rows];
  };

  const exportToCSV = () => {
    const data = generateDataArray();
    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map((e) => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Vision_Ledger_" + new Date().toISOString().split('T')[0] + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyForSheets = () => {
    const data = generateDataArray();
    const tsvContent = data.map((e) => e.join("\t")).join("\n");
    
    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  const renderGoalProgress = (goal: any) => {
    if (!goal) return '-';
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return (
      <div className="space-y-1">
        <div className="font-bold truncate max-w-[120px]">{goal.title}</div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-blue-900 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              style={{ width: Math.min(progress, 100) + "%" }}
            ></div>
          </div>
          <span className="text-[8px] font-black">{Math.round(progress)}%</span>
        </div>
      </div>
    );
  };

  const resetFilters = () => {
    setMinRisk(0);
    setMaxRisk(100);
    setMinAum(0);
    setMaxAum(null);
    setStatusFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-blue-950 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-1">Command Center 🦅</h2>
          <p className="text-blue-300 text-xs font-black uppercase tracking-[0.2em]">Founder Access: Mr. Koustav Biswas</p>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-4 relative z-10">
          <button 
            onClick={() => setActiveSubTab('overview')}
            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'overview' ? 'bg-amber-500 text-[#001040]' : 'bg-blue-900/50 text-blue-300 hover:bg-blue-800'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveSubTab('vault')}
            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'vault' ? 'bg-amber-500 text-[#001040]' : 'bg-blue-900/50 text-blue-300 hover:bg-blue-800'}`}
          >
            Client Vault
          </button>
        </div>
      </div>

      {activeSubTab === 'overview' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#001040] p-8 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
              <p className="text-[10px] text-gray-400 dark:text-blue-300/50 font-black uppercase tracking-widest mb-2">Total AUM managed</p>
              <p className="text-3xl font-serif font-bold text-blue-950 dark:text-white">₹{(metrics.totalAUM / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="bg-white dark:bg-[#001040] p-8 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
              <p className="text-[10px] text-gray-400 dark:text-blue-300/50 font-black uppercase tracking-widest mb-2">Active Investors</p>
              <p className="text-3xl font-serif font-bold text-blue-950 dark:text-white">{metrics.activeClients.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-[#001040] p-8 rounded-3xl border border-gray-100 dark:border-blue-900 shadow-sm">
              <p className="text-[10px] text-gray-400 dark:text-blue-300/50 font-black uppercase tracking-widest mb-2">Pending Reviews</p>
              <p className="text-3xl font-serif font-bold text-amber-600">{metrics.pendingReviews}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#001040] p-10 rounded-[40px] border border-gray-100 dark:border-blue-900 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-blue-950 dark:text-white uppercase tracking-widest">Founder's Pulse Broadcast 🦅</h3>
              <Button onClick={fetchUpdate} size="sm" variant="outline" disabled={isUpdating}>
                {isUpdating ? 'Analyzing...' : 'Refresh Market View'}
              </Button>
            </div>
            <textarea 
              value={wisdomText}
              onChange={(e) => setWisdomText(e.target.value)}
              className="w-full p-8 bg-slate-50 dark:bg-blue-950/30 rounded-[32px] border-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed text-gray-700 dark:text-blue-100 min-h-[150px] font-medium italic outline-none"
            />
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-[#001040] rounded-[40px] border border-gray-100 dark:border-blue-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-10 border-b border-gray-100 dark:border-blue-900">
            <div className="flex flex-col xl:flex-row justify-between items-center gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-blue-950 dark:text-white uppercase tracking-tight">
                   <span className="text-emerald-500 font-normal">Financial Wisdom</span> Client Master Ledger
                </h3>
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em] mt-2">Vision Tracking System • All Records Enabled</p>
              </div>
              <div className="flex items-center space-x-4 w-full xl:w-auto">
                <div className="relative flex-1 xl:w-80">
                  <input 
                    type="text" 
                    placeholder="Search Name or Email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-blue-900 rounded-2xl border border-gray-100 dark:border-blue-900 focus:border-amber-500 outline-none text-xs font-bold"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={showFilters ? 'secondary' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-xl px-5 py-3 font-black text-[9px] uppercase tracking-widest transition-all relative"
                  >
                    Filter Suite {activeFilterCount > 0 ? "(" + activeFilterCount + ")" : ''} ⚙️
                    {activeFilterCount > 0 ? <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span> : null}
                  </Button>
                  <Button 
                    onClick={exportToCSV}
                    className="rounded-xl px-5 py-3 bg-green-600 text-white font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-green-700"
                  >
                    CSV 📥
                  </Button>
                  <Button 
                    onClick={copyForSheets}
                    className={`rounded-xl px-5 py-3 font-black text-[9px] uppercase tracking-widest shadow-lg transition-all ${copyStatus ? 'bg-amber-500 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}
                  >
                    {copyStatus ? 'Copied!' : 'Sheets 📋'}
                  </Button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="p-8 bg-gray-50 dark:bg-blue-950/50 rounded-3xl border border-gray-100 dark:border-blue-900 mb-8 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Risk Appetite Range</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={minRisk}
                        onChange={(e) => setMinRisk(Number(e.target.value))}
                        className="w-full bg-white dark:bg-blue-900 p-2 rounded-lg border border-gray-100 dark:border-blue-800 text-[10px] font-bold"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxRisk}
                        onChange={(e) => setMaxRisk(Number(e.target.value))}
                        className="w-full bg-white dark:bg-blue-900 p-2 rounded-lg border border-gray-100 dark:border-blue-800 text-[10px] font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Portfolio AUM (₹)</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={minAum}
                        onChange={(e) => setMinAum(Number(e.target.value))}
                        className="w-full bg-white dark:bg-blue-900 p-2 rounded-lg border border-gray-100 dark:border-blue-800 text-[10px] font-bold"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxAum === null ? '' : maxAum}
                        onChange={(e) => setMaxAum(e.target.value === '' ? null : Number(e.target.value))}
                        className="w-full bg-white dark:bg-blue-900 p-2 rounded-lg border border-gray-100 dark:border-blue-800 text-[10px] font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vision Velocity</label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full bg-white dark:bg-blue-900 p-2 rounded-lg border border-gray-100 dark:border-blue-800 text-[10px] font-bold outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="on-track">On Track (>50%)</option>
                      <option value="behind">Behind (<=50%)</option>
                      <option value="realized">Vision Realized (100%)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={resetFilters}
                      className="text-[9px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-500 transition-colors pb-3"
                    >
                      Reset All Vision Criteria ↺
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center">
                 <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connecting to Global Visionary Cloud...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[2000px]">
                <thead>
                  <tr className="bg-blue-950 text-white text-[9px] font-black uppercase tracking-widest">
                    <th className="p-5 border-r border-white/5 whitespace-nowrap sticky left-0 z-20 bg-blue-950 shadow-[4px_0_10px_rgba(0,0,0,0.1)]">Client Name</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap">Phone Number</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap">Email ID</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-center">Risk Score</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Equity (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Bond (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Gold (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">FD (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Real Estate (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Other (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right bg-blue-900">Total (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap">Goal 1 Status</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Goal 1 Target (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap">Goal 2 Status</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap text-right">Goal 2 Target (₹)</th>
                    <th className="p-5 border-r border-white/5 whitespace-nowrap">Goal 3 Status</th>
                    <th className="p-5 whitespace-nowrap text-right">Goal 3 Target (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-blue-900/30 text-[11px]">
                  {filteredClients.map((client, idx) => {
                    const goals = client.goals || [];
                    return (
                      <tr key={idx} className="hover:bg-amber-50/30 dark:hover:bg-blue-900/20 transition-all font-medium text-gray-700 dark:text-blue-100 group">
                        <td className="p-5 font-bold text-blue-950 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#001040] shadow-[4px_0_10px_rgba(0,0,0,0.05)] group-hover:bg-amber-50 dark:group-hover:bg-blue-900/30 transition-colors">
                          {client.name}
                        </td>
                        <td className="p-5 whitespace-nowrap">{client.phone || 'N/A'}</td>
                        <td className="p-5 whitespace-nowrap">{client.email}</td>
                        <td className="p-5 text-center font-black">
                          <span className={`px-3 py-1 rounded-full ${client.riskScore > 40 ? 'bg-red-500/10 text-red-500' : client.riskScore < 21 ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-600'}`}>
                            {client.riskScore}
                          </span>
                        </td>
                        <td className="p-5 text-right">{getAssetValue(client.assets, 'Equity').toLocaleString()}</td>
                        <td className="p-5 text-right">{getAssetValue(client.assets, 'Bond').toLocaleString()}</td>
                        <td className="p-5 text-right">{getAssetValue(client.assets, 'Gold').toLocaleString()}</td>
                        <td className="p-5 text-right">{getAssetValue(client.assets, 'FD').toLocaleString()}</td>
                        <td className="p-5 text-right">{getAssetValue(client.assets, 'RealState').toLocaleString()}</td>
                        <td className="p-5 text-right">{getAssetValue(client.assets, 'Others').toLocaleString()}</td>
                        <td className="p-5 text-right font-black bg-blue-50/30 dark:bg-blue-900/10 text-blue-900 dark:text-amber-400">₹{client.portfolioValue.toLocaleString()}</td>
                        <td className="p-5">{renderGoalProgress(goals[0])}</td>
                        <td className="p-5 text-right font-bold">{goals[0] ? goals[0].targetAmount.toLocaleString() : '-'}</td>
                        <td className="p-5">{renderGoalProgress(goals[1])}</td>
                        <td className="p-5 text-right font-bold">{goals[1] ? goals[1].targetAmount.toLocaleString() : '-'}</td>
                        <td className="p-5">{renderGoalProgress(goals[2])}</td>
                        <td className="p-5 text-right font-bold">{goals[2] ? goals[2].targetAmount.toLocaleString() : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-8 bg-gray-50 dark:bg-blue-950/50 flex flex-col md:flex-row justify-between items-center border-t border-gray-100 dark:border-blue-900 gap-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
              Encrypted Secure Node • Vision Ledger v3.0 • {filteredClients.length} Segment Matches Found
            </p>
            <div className="flex items-center space-x-6">
               <p className="text-[10px] text-amber-600 font-bold italic">Paste directly into Google Sheets for instant cloud sync 🦅</p>
               <Button size="sm" variant="outline" className="text-[9px] uppercase tracking-widest font-black" onClick={() => window.print()}>Print Summary 📄</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
