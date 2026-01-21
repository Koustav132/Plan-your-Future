
import React, { useState, useEffect } from 'react';
import { BRAND_NAVY, BRAND_GREEN, PRODUCTION_URL } from './constants';
import { ChatWindow } from './components/ChatWindow';
import { SIPCalculator, LoanCalculator, RetirementCalculator, ChildEducationCalculator, SWPCalculator } from './components/Calculator';
import { RiskProfiler } from './components/RiskProfiler';
import { AssetAllocation } from './components/AssetAllocation';
import { Recommendations } from './components/Recommendations';
import { GoalsTracker } from './components/GoalsTracker';
import { KeyNoteSpace } from './components/KeyNoteSpace';
import { PublicHome } from './components/PublicHome';
import { UserData, UserRole, AssetCategory, FinancialGoal } from './types';
import { Button } from './components/Button';
import { supabase } from './services/supabaseClient';

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

  const navTabs = [
    { id: 'guru', label: 'Financial Guru' },
    { id: 'vision', label: 'My Vision Board' },
    { id: 'tools', label: 'Calculators' },
    { id: 'profile', label: 'Profile & Risk' }
  ];

  if (currentView === 'home') {
    return <PublicHome onStart={() => setCurrentView('portal')} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#000814]' : 'bg-slate-50'} transition-colors duration-500`}>
      <nav className="bg-white dark:bg-[#001040] border-b border-gray-100 dark:border-blue-900 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-8 h-8 bg-[#001040] dark:bg-amber-500 rounded-lg flex items-center justify-center text-white dark:text-[#001040] text-sm font-bold shadow-lg">🦅</div>
              <div className="flex flex-col">
                <h1 className="font-serif font-bold text-xl text-[#001040] dark:text-white uppercase tracking-widest leading-none">Plan Your Future</h1>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Secure Node: www.planfuture.in</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-10">
              {navTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-[10px] font-black uppercase tracking-[0.25em] py-2 border-b-2 transition-all relative group ${
                    activeTab === tab.id 
                    ? 'border-amber-500 text-[#001040] dark:text-amber-400' 
                    : 'border-transparent text-gray-400 hover:text-amber-500'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <span className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-emerald-500/20 blur-[2px]"></span>}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-gray-100 dark:border-blue-800 hover:bg-emerald-500/10 transition-colors"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
              <button onClick={() => setCurrentView('home')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Terminate Node</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {activeTab === 'guru' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight mb-5">Financial Guruji 🦅</h2>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <p className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[9px]">Neural Discussion Stream Active</p>
              </div>
              <p className="text-gray-500 dark:text-blue-100/60 font-medium tracking-widest uppercase text-[11px]">Deep Discussion Mode: Institutional Insights Powered by 20+ Years Wisdom.</p>
            </div>
            <div className="shadow-[0_60px_150px_rgba(0,16,64,0.18)] rounded-[60px] overflow-hidden border border-gray-100 dark:border-blue-900/50">
              <ChatWindow userData={userData} />
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="lg:col-span-2 space-y-12">
              <Recommendations userData={userData} />
              <GoalsTracker 
                goals={userData.goals} 
                onAddGoal={handleAddGoal} 
                onUpdateGoal={handleUpdateGoal} 
                onDeleteGoal={handleDeleteGoal} 
              />
            </div>
            <div className="space-y-12">
              <AssetAllocation userData={userData} onUpdateAssets={handleUpdateAssets} />
              <KeyNoteSpace notes={userData.notes} onUpdate={(val) => setUserData({ ...userData, notes: val })} />
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in zoom-in-95 duration-700">
            <RetirementCalculator />
            <SIPCalculator />
            <ChildEducationCalculator />
            <SWPCalculator />
            <LoanCalculator />
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-6 duration-1000">
            <div className="bg-white dark:bg-[#001040] p-16 rounded-[60px] shadow-2xl border border-gray-100 dark:border-blue-900/40 max-w-5xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#001040] dark:text-white uppercase mb-10 tracking-tight">Investor Vision Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Institutional Label</label>
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-blue-950/40 p-5 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white outline-none shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Vision ID (Email)</label>
                    <input 
                      type="text" 
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-blue-950/40 p-5 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white outline-none shadow-inner"
                    />
                  </div>
                  <div className="pt-6 flex justify-between items-center border-t border-gray-50 dark:border-blue-900/50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Risk Index Segment</span>
                    <span className="font-bold text-emerald-600 uppercase tracking-widest text-sm">
                      {userData.riskScore > 40 ? 'Aggressive' : userData.riskScore < 21 ? 'Conservative' : 'Moderate'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-blue-950/50 p-12 rounded-[50px] border border-gray-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] mb-4">Vision Alpha Score</p>
                   <p className="text-7xl font-serif font-bold text-[#001040] dark:text-white leading-none">{userData.riskScore}<span className="text-xl text-gray-300 dark:text-gray-600">/60</span></p>
                   <p className="mt-6 text-[11px] text-emerald-600 font-black uppercase tracking-[0.4em] border-t border-emerald-500/20 pt-4">Institutional Grade</p>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="mb-12 text-center">
                <h3 className="text-4xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight">Re-evaluate Vision Appetite</h3>
                <p className="text-lg text-gray-500 font-light mt-4 italic">Update your behavior profile to recalibrate your institutional wealth roadmap.</p>
              </div>
              <RiskProfiler onComplete={(score) => setUserData({...userData, riskScore: score})} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-[#001040] py-20 mt-32 border-t border-gray-100 dark:border-blue-900">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="flex justify-center space-x-4 mb-10">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-blue-950 flex items-center justify-center text-[10px] border border-gray-100 dark:border-blue-800 shadow-sm transition-transform hover:scale-110">🦅</div>
             ))}
          </div>
          
          <div className="mb-10">
            <a href={PRODUCTION_URL} target="_blank" rel="noreferrer" className="text-2xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-[0.2em] hover:text-amber-500 transition-colors">
              www.planfuture.in
            </a>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mt-2">Official Digital Vision Node</p>
          </div>

          <p className="text-[12px] font-black text-gray-400 dark:text-blue-100/40 uppercase tracking-[0.7em] mb-6">Professional Leadership of Mr. Koustav Biswas</p>
          
          <div className="w-20 h-1 bg-emerald-500/30 mx-auto mb-12 rounded-full"></div>
          
          <div className="max-w-5xl mx-auto text-left space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-blue-950/30 rounded-[30px] border border-gray-100 dark:border-blue-900/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Verified Distributor</span>
                </div>
              </div>
              <p className="text-[11px] text-[#001040] dark:text-blue-100 font-medium leading-relaxed">
                <span className="font-black text-emerald-600 uppercase tracking-widest block mb-2">Detailed Disclaimer:</span>
                Disclaimer: Investing in the securities market carries inherent risks. Please read all relevant documents thoroughly before making any investment decisions. As a registered Authorized Person and Distributor, we do not charge additional fees for our value-added services; our remuneration comes from commissions or brokerage fees paid by product companies. Our role is limited to Plan making, data inside discussion, and assisting with the execution and sale of financial products. The customer has to make and take their own decisions. All content in this website are for education purposes only. I/We am/are acting as a Mutual Fund Distributor. I/We do not provide investment advice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 px-4">
              {[
                { label: "Mutual Fund Distribution", val: "EUIN: E389902" },
                { label: "IRDA Registration", val: "HDF01653347" },
                { label: "TIN", val: "1115016820240310" },
                { label: "GST Registration", val: "19AMXPB1031B1ZG" },
                { label: "Trade Mark No.", val: "4032388" },
                { label: "NSE Ref.No.", val: "NSE/MEM/12798/AP/397/Mar'21" },
                { label: "BSE Ref No.", val: "57819" }
              ].map((reg, i) => (
                <div key={i} className="flex flex-col space-y-1 group">
                  <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">{reg.label}</span>
                  <span className="text-[10px] font-bold text-[#001040] dark:text-blue-200">{reg.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-blue-900/50">
            <p className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-[0.5em]">Powered by Plan Your Future Ecosystem 🦅 <span className="text-emerald-500">All Nodes Secure @ www.planfuture.in</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
