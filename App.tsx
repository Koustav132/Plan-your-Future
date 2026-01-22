
import React, { useState, Suspense, lazy, useRef } from 'react';
import { BRAND_NAVY, PRODUCTION_URL } from './constants';
import { ChatWindow } from './components/ChatWindow';
import { UserData } from './types';
import { Button } from './components/Button';

// Lazy load calculators for better initial load speed
const SIPCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.SIPCalculator })));
const LoanCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.LoanCalculator })));
const RetirementCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.RetirementCalculator })));
const ChildEducationCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.ChildEducationCalculator })));
const SWPCalculator = lazy(() => import('./components/Calculator').then(m => ({ default: m.SWPCalculator })));

const INITIAL_USER: UserData = {
  name: "Valued Investor",
  age: 34,
  email: "investor@vision.com",
  role: 'client',
  riskScore: 35,
  portfolioValue: 1250000,
  assets: [],
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
  const [userData, setUserData] = useState<UserData>(INITIAL_USER);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const guruRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const investButtons = [
    { name: "Mutual Funds", icon: "📈", url: "https://planyourfuture.themfbox.com/", desc: "Execution portal" },
    { name: "Bonds & FD", icon: "🛡️", url: "https://stablemoney.in/?pid=Koustav%20Biswas", desc: "Fixed yields" },
    { name: "Shares", icon: "📊", url: "https://angel-one.onelink.me/Wjgr/xtq5crdk", desc: "Direct trading" },
    { name: "Direct Voice", icon: "📞", url: "tel:9663393794", desc: "Speak Now" }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#000814]' : 'bg-white'} transition-colors duration-300`}>
      {/* Institutional Navigation */}
      <nav className="bg-white dark:bg-[#001040] border-b border-gray-100 dark:border-blue-900 sticky top-0 z-50 shadow-sm px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-[#001040] dark:bg-amber-500 rounded-lg flex items-center justify-center text-white dark:text-[#001040] text-sm font-black shadow-lg">🦅</div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-base md:text-xl text-[#001040] dark:text-white uppercase tracking-tight leading-none">Plan Your Future</h1>
              <span className="text-[6px] md:text-[7px] font-black text-emerald-500 uppercase tracking-widest mt-1 hidden sm:block">Secure: www.planfuture.in</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollTo(guruRef)} className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-amber-500 transition-colors">Financial Guru</button>
            <button onClick={() => scrollTo(toolsRef)} className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-amber-500 transition-colors">Strategic Tools</button>
            <a href="https://planyourfuture.themfbox.com/" target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-500 hover:text-emerald-400 transition-colors">Login 🏛️</a>
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
            <Button onClick={() => window.open('tel:9663393794')} className="hidden sm:flex bg-[#001040] dark:bg-amber-500 dark:text-[#001040] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">Call 9663393794</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden px-4 md:px-8 bg-slate-50 dark:bg-blue-950/10">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]"></div>
        <div className="max-w-7xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-3xl lg:text-7xl font-black text-[#001040] dark:text-white uppercase leading-none tracking-tighter max-w-5xl mx-auto">
              Elevate Your <span className="text-emerald-500 font-normal">Financial Wisdom</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-500 dark:text-blue-100/60 font-medium max-w-2xl mx-auto px-4">
              Visionary wealth management founded by Mr. Koustav Biswas. Protect. Grow. Endure.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Button onClick={() => window.open('tel:9663393794')} size="lg" className="rounded-xl px-6 md:px-10 py-3 md:py-5 bg-[#001040] dark:bg-amber-500 dark:text-[#001040] font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-xl">Call us to 9663393794 📞</Button>
          </div>
        </div>
      </section>

      {/* Financial Guru Interaction - MASSIVE AI READING BOARD */}
      <section ref={guruRef} className="max-w-7xl mx-auto px-0 md:px-8 py-2 md:py-16 animate-in fade-in duration-700">
        <div className="flex flex-col space-y-4 md:space-y-8">
          {/* Main Chat Board - Very responsive display area */}
          <div className="w-full h-[700px] md:h-[800px]">
            <ChatWindow userData={userData} />
          </div>

          {/* Quick Execution Links - Compact layout below the Board */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-2 md:px-0">
            {investButtons.map((btn, i) => (
              <a key={i} href={btn.url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center py-4 md:py-6 px-2 bg-white dark:bg-[#001040] border border-gray-100 dark:border-blue-900 rounded-[20px] md:rounded-[30px] hover:border-amber-500 transition-all shadow-sm group">
                <span className="text-2xl md:text-3xl mb-1.5 md:mb-3 group-hover:scale-110 transition-transform">{btn.icon}</span>
                <p className="text-[8px] md:text-[10px] font-black text-[#001040] dark:text-white uppercase tracking-wider text-center">{btn.name}</p>
                <p className="hidden md:block text-[7px] text-gray-400 font-bold uppercase tracking-widest mt-1">{btn.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Tools Section */}
      <section ref={toolsRef} className="bg-slate-50 dark:bg-[#000c24] py-12 md:py-24 px-4 md:px-8 border-y border-gray-100 dark:border-blue-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-16 text-center">
            <h3 className="text-2xl md:text-5xl font-black text-[#001040] dark:text-white uppercase tracking-tighter mb-2 md:mb-4">Strategic Frameworks 📊</h3>
            <p className="text-gray-400 dark:text-blue-100/40 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-[10px]">Institutional Grade Numerical Vision</p>
          </div>
          <Suspense fallback={<Loader />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <RetirementCalculator />
              <SIPCalculator />
              <ChildEducationCalculator />
              <SWPCalculator />
              <LoanCalculator />
              <div className="p-8 bg-white dark:bg-[#001040] rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 dark:border-blue-900 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-2xl md:text-3xl">📡</div>
                 <h4 className="text-base md:text-lg font-black text-[#001040] dark:text-white uppercase tracking-tight">Need a Custom Audit?</h4>
                 <p className="text-[10px] md:text-sm text-gray-500 dark:text-blue-100/40 font-medium">Connect with our team for deep wealth restructuring.</p>
                 <Button onClick={() => window.open('tel:9663393794')} className="w-full py-3 md:py-4 bg-[#001040] dark:bg-amber-500 text-white dark:text-[#001040] font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl">Call 9663393794</Button>
              </div>
            </div>
          </Suspense>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-white dark:bg-[#001040] py-12 md:py-20 px-4 md:px-8 border-t border-gray-100 dark:border-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-20">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#001040] dark:bg-amber-500 rounded-lg flex items-center justify-center text-white dark:text-[#001040] text-lg md:text-xl font-black">🦅</div>
                <h4 className="text-lg md:text-xl font-black text-[#001040] dark:text-white uppercase tracking-tight">Plan Your Future</h4>
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 dark:text-blue-100/40 font-medium leading-relaxed">
                Empowering the modern Indian investor with <span className="text-emerald-500">Global Financial Wisdom</span>. A vision of excellence led by Mr. Koustav Biswas.
              </p>
            </div>
            <div className="hidden md:block">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Quick Vision Links</h5>
              <ul className="space-y-4 text-xs font-bold text-[#001040] dark:text-blue-100/80">
                <li><button onClick={() => scrollTo(guruRef)} className="hover:text-amber-500 transition-colors uppercase tracking-widest text-left">Financial Guru</button></li>
                <li><button onClick={() => scrollTo(toolsRef)} className="hover:text-amber-500 transition-colors uppercase tracking-widest text-left">Strategic Tools</button></li>
                <li><a href="https://planyourfuture.themfbox.com/" className="hover:text-amber-500 transition-colors uppercase tracking-widest">Client Portal</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 md:mb-6">Legacy Connect</h5>
              <ul className="space-y-2 md:space-y-4 text-[10px] md:text-xs font-bold text-[#001040] dark:text-blue-100/80">
                <li className="uppercase tracking-widest">West Bengal, India</li>
                <li className="uppercase tracking-widest">Direct Call: 9663393794</li>
                <li className="uppercase tracking-widest">www.planfuture.in</li>
              </ul>
            </div>
            <div>
               <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 md:mb-6">Authentication</h5>
               <div className="p-4 bg-slate-50 dark:bg-blue-950/40 rounded-xl border border-gray-100 dark:border-blue-900">
                  <p className="text-[7px] md:text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1 md:mb-2">Registered Entity</p>
                  <p className="text-[9px] md:text-[10px] text-[#001040] dark:text-white font-bold">Mutual Fund Distributor (EUIN: E389902)</p>
               </div>
            </div>
          </div>
          
          <div className="pt-8 md:pt-10 border-t border-gray-50 dark:border-blue-900/40 text-center">
            <p className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-blue-100/30 uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 leading-loose px-2">
              Disclaimer: Investing in the securities market carries inherent risks. Please read all relevant documents thoroughly before making any investment decisions. As a registered Authorized Person and Distributor, we do not charge additional fees for our value-added services. I/We do not provide investment advice.
            </p>
            <div className="flex flex-col items-center space-y-2">
              <a href={PRODUCTION_URL} target="_blank" rel="noreferrer" className="text-[10px] md:text-xs font-black text-[#001040] dark:text-white uppercase tracking-widest hover:text-amber-500">www.planfuture.in</a>
              <p className="text-[6px] md:text-[7px] font-black text-emerald-500 uppercase tracking-[0.3em] md:tracking-[0.5em]">Professional Node of Mr. Koustav Biswas • Secure 🦅 • Call 9663393794</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
