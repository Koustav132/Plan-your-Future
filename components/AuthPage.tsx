
import React, { useState } from 'react';
import { Button } from './Button';
import { RiskProfiler } from './RiskProfiler';

interface AuthPageProps {
  onLogin: (name: string, email: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'risk'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tempRiskScore, setTempRiskScore] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name || 'Guest User', email || 'guest@example.com');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-[#000814]">
      {/* Brand Side */}
      <div className="lg:w-1/2 bg-[#001040] flex flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full -ml-48 -mb-48"></div>
        
        <div className="relative z-10 text-center max-w-md">
          <h1 className="text-5xl font-serif font-bold mb-4 tracking-widest uppercase">Plan Your Future</h1>
          <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-8">Rising Above Financial Challenges 🦅</p>
          <p className="text-blue-200 text-lg leading-relaxed italic mb-10">
            "Wealth management is a journey of vision and discipline. Join the vision of Mr. Koustav Biswas."
          </p>
          
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8 text-left">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">Philosophy</p>
              <p className="text-xs text-blue-100/70 font-medium">Protect. Grow. Endure.</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">Legacy</p>
              <p className="text-xs text-blue-100/70 font-medium">20+ Years Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form/Profiler Side */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white dark:bg-[#000c24] relative">
        <div className="w-full max-w-xl">
          {/* Navigation Tabs */}
          <div className="flex space-x-6 mb-12 border-b border-gray-100 dark:border-blue-900/50 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {[
              { id: 'login', label: 'Login' },
              { id: 'signup', label: 'Sign Up' },
              { id: 'risk', label: 'Risk Profiler' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-amber-500 text-[#001040] dark:text-white' 
                    : 'border-transparent text-gray-400 dark:text-gray-600 hover:text-amber-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'risk' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-serif font-bold text-[#001040] dark:text-white mb-2">Vision Mapping</h2>
                <p className="text-gray-500 dark:text-blue-100/60 font-medium">Discover your financial persona before starting your journey.</p>
              </div>
              {tempRiskScore === null ? (
                <RiskProfiler onComplete={(score) => setTempRiskScore(score)} />
              ) : (
                <div className="bg-amber-500/10 p-10 rounded-[40px] border border-amber-500/20 text-center animate-in zoom-in-95">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Assessment Complete</p>
                  <h3 className="text-4xl font-black text-[#001040] dark:text-white mb-2">{tempRiskScore}<span className="text-xl text-gray-400">/60</span></h3>
                  <div className="mb-8">
                    <p className="text-amber-600 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                      {tempRiskScore > 40 ? "AGGRESSIVE: The Growth Investor" : 
                       tempRiskScore < 21 ? "CONSERVATIVE: The Safety First Investor" : 
                       "MODERATE: The Balanced Investor"}
                    </p>
                    <p className="text-gray-600 dark:text-blue-100/80 font-serif italic text-lg leading-relaxed">
                      {tempRiskScore > 40 ? "You are willing to see short-term losses for long-term wealth creation." : 
                       tempRiskScore < 21 ? "You prioritize keeping money safe over high returns." : 
                       "You want to beat inflation but can't stomach huge volatility."}
                    </p>
                  </div>
                  <Button onClick={() => setActiveTab('signup')} className="w-full py-5 rounded-3xl bg-[#001040] shadow-2xl">Create Your Roadmap 📈</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 max-w-md mx-auto">
              <h2 className="text-3xl font-serif font-bold text-[#001040] dark:text-white mb-2">
                {activeTab === 'login' ? 'Welcome Back' : 'Join the Vision'}
              </h2>
              <p className="text-gray-500 dark:text-blue-100/60 mb-10">Secure access to your wealth panorama.</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-b-2 border-gray-100 dark:border-blue-900 focus:border-amber-500 bg-transparent py-4 outline-none transition-colors font-bold text-[#001040] dark:text-white"
                      placeholder="Amit Sharma"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Email Address / Mobile</label>
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b-2 border-gray-100 dark:border-blue-900 focus:border-amber-500 bg-transparent py-4 outline-none transition-colors font-bold text-[#001040] dark:text-white"
                    placeholder="amit@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Password</label>
                  <input 
                    type="password" 
                    required
                    className="w-full border-b-2 border-gray-100 dark:border-blue-900 focus:border-amber-500 bg-transparent py-4 outline-none transition-colors font-bold text-[#001040] dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" className="w-full py-5 rounded-[24px] text-[12px] font-black uppercase tracking-[0.25em] shadow-2xl bg-[#001040] dark:bg-amber-500 dark:text-[#001040]">
                  {activeTab === 'login' ? 'Sign In 🦅' : 'Begin Journey 📈'}
                </Button>
              </form>

              <div className="mt-12 pt-10 border-t border-gray-100 dark:border-blue-900/50 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest">
                <span>IRDA: HDF01653347</span>
                <span className="text-amber-500 opacity-50">NSE/MEM/12798</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
