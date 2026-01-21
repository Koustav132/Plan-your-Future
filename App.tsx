
import React, { useState, Suspense, lazy } from 'react';
import { BRAND_NAVY, BRAND_GREEN, PRODUCTION_URL } from './constants';
import { ChatWindow } from './components/ChatWindow';
import { PublicHome } from './components/PublicHome';
import { UserData, AssetCategory, FinancialGoal } from './types';
import { Button } from './components/Button';

// Lazy load heavy components
const SIPCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.SIPCalculator })));
const LoanCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.LoanCalculator })));
const RetirementCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.RetirementCalculator })));
const ChildEducationCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.ChildEducationCalculator })));
const SWPCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.SWPCalculator })));
const RiskProfiler = lazy(() => import('./components/RiskProfiler').then(m => ({ default: m.RiskProfiler })));
const AssetAllocation = lazy(() => import('./components/AssetAllocation').then(m => ({ default: m.AssetAllocation })));
const Recommendations = lazy(() => import('./components/Recommendations').then(m => ({ default: m.Recommendations })));
const GoalsTracker = lazy(() => import('./components/GoalsTracker').then(m => ({ default: m.GoalsTracker })));
const KeyNoteSpace = lazy(() => import('./components/KeyNoteSpace').then(m => ({ default: m.KeyNoteSpace })));

const INITIAL_USER: UserData = {
  name: "Valued Investor",
  age: 34,
  email: "investor@vision.com",
  role: 'client',
  riskScore: 35,
  portfolioValue: 1250000,
  assets: [
    { category: 'Equity', value: 750000, remark: '' },
    { category: 'Bond', value: 300000, remark: '' },
    { category: 'Gold', value: 100000, remark: '' },
    { category: 'FD', value: 100000, remark: '' }
  ],
  notes: "",
  goals: []
};

const Loader = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-pulse">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
      <span className="text-emerald-500 font-normal">Global Financial Wisdom</span> Node Connecting...
    </p>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'portal'>('home');
  const [userData, setUserData] = useState<UserData>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'vision' | 'guru' | 'tools' | 'profile'>('guru');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleUpdateAssets = (newAssets: AssetCategory[]) => {
    const total = newAssets.reduce((acc, curr) => acc + curr.value, 0);
    setUserData(prev => ({ ...prev, assets: newAssets, portfolioValue: total }));
  };

  const handleAddGoal = (goal: FinancialGoal) => {
    setUserData(prev => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const handleUpdateGoal = (updatedGoal: FinancialGoal) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  if (currentView === 'home') {
    return <PublicHome onStart={() => setCurrentView('portal')} />;
  }

  const tabs = [
    { id: 'guru', label: 'Financial Guru', icon: '🦅' },
    { id: 'vision', label: 'Vision', icon: '🔭' },
    { id: 'tools', label: 'Tools', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${theme === 'dark' ? 'dark bg-[#000814]' : 'bg-slate-50'} transition-colors duration-300`}>
      <nav className="bg-white dark:bg-[#001040] border-b border-gray-100 dark:border-blue-900 sticky top-0 z-50 shadow-sm px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-8 h-8 bg-[#001040] dark:bg-amber-500 rounded-lg flex items-center justify-center text-white dark:text-[#001040] text-sm font-black shadow-lg">🦅</div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-base md:text-xl text-[#001040] dark:text-white uppercase tracking-tight leading-none">Plan Your Future</h1>
              <span className="text-[6px] md:text-[7px] font-black text-emerald-500 uppercase tracking-widest mt-1 hidden sm:block">Secure: www.planfuture.in</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[10px] font-black uppercase tracking-[0.25em] py-2 border-b-2 transition-all relative ${
                  activeTab === tab.id 
                  ? 'border-amber-500 text-[#001040] dark:text-amber-400' 
                  : 'border-transparent text-gray-400 hover:text-amber-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full w-8 h-8 md:w-9 md:h-9 p-0 flex items-center justify-center border-gray-100 dark:border-blue-800"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
            <button onClick={() => setCurrentView('home')} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <Suspense fallback={<Loader />}>
          {activeTab === 'guru' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
              <div className="mb-6 md:mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-[#001040] dark:text-white uppercase tracking-tighter mb-2">Financial Guruji 🦅</h2>
                <p className="text-gray-600 dark:text-blue-100/40 font-black uppercase tracking-widest text-[8px] md:text-[10px] bg-slate-100 dark:bg-blue-900/20 inline-block px-3 py-1 rounded-full">
                  Neural <span className="text-emerald-500 font-normal">Global Financial Wisdom</span> Stream Active
                </p>
              </div>
              <ChatWindow userData={userData} />
            </div>
          )}

          {activeTab === 'vision' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 animate-in fade-in duration-300">
              <div className="lg:col-span-2 space-y-6 md:space-y-10">
                <Recommendations userData={userData} />
                <GoalsTracker 
                  goals={userData.goals} 
                  onAddGoal={handleAddGoal} 
                  onUpdateGoal={handleUpdateGoal} 
                  onDeleteGoal={handleDeleteGoal} 
                />
              </div>
              <div className="space-y-6 md:space-y-10">
                <AssetAllocation userData={userData} onUpdateAssets={handleUpdateAssets} />
                <KeyNoteSpace notes={userData.notes} onUpdate={(val) => setUserData({ ...userData, notes: val })} />
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-300">
              <RetirementCalculator />
              <SIPCalculator />
              <ChildEducationCalculator />
              <SWPCalculator />
              <LoanCalculator />
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="space-y-8 md:space-y-12 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-[#001040] p-6 md:p-14 rounded-[30px] md:rounded-[40px] shadow-xl border border-gray-100 dark:border-blue-900/40 max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#001040] dark:text-white uppercase mb-6 md:mb-8 tracking-tighter">Investor Vision Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Name</label>
                      <input 
                        type="text" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-blue-950/40 p-3 md:p-4 rounded-xl border-none font-bold dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Email</label>
                      <input 
                        type="text" 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-blue-950/40 p-3 md:p-4 rounded-xl border-none font-bold dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-blue-950/50 p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-center text-center">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Alpha Score</p>
                     <p className="text-5xl md:text-6xl font-black text-[#001040] dark:text-white tracking-tighter">{userData.riskScore}<span className="text-xl text-gray-300 font-medium">/60</span></p>
                  </div>
                </div>
              </div>
              <div className="max-w-4xl mx-auto px-1">
                <RiskProfiler onComplete={(score) => setUserData({...userData, riskScore: score})} />
              </div>
            </div>
          )}
        </Suspense>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#001040] border-t border-gray-100 dark:border-blue-900 z-50 flex justify-around items-center py-2 px-1 shadow-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center space-y-1 flex-1 py-1 transition-all ${
              activeTab === tab.id ? 'text-amber-500' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <footer className="bg-white dark:bg-[#001040] py-12 md:py-16 mt-10 md:mt-20 border-t border-gray-100 dark:border-blue-900 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 md:mb-8">
            <a href={PRODUCTION_URL} target="_blank" rel="noreferrer" className="text-lg md:text-xl font-black text-[#001040] dark:text-white uppercase tracking-tight hover:text-amber-500 transition-colors">
              www.planfuture.in
            </a>
            <p className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-2">
              Official Digital <span className="text-emerald-500 font-normal">Global Financial Wisdom</span> Node
            </p>
          </div>
          <p className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-blue-100/30 uppercase tracking-[0.6em] mb-4">Professional Leadership of Mr. Koustav Biswas</p>
          <div className="max-w-4xl mx-auto text-left opacity-60 text-[8px] md:text-[10px] leading-relaxed border-t pt-6 px-2">
            Disclaimer: Investing in the securities market carries inherent risks. I/We are acting as a Mutual Fund Distributor (EUIN: E389902). I/We do not provide investment advice.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
