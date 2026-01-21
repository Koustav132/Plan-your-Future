
import React from 'react';
import { Button } from './Button';
import { BRAND_NAVY } from '../constants';
import { SIPCalculator, RetirementCalculator, SWPCalculator, ChildEducationCalculator, LoanCalculator } from './Calculator';
import { ChatWindow } from './ChatWindow';

interface PublicHomeProps {
  onStart: () => void;
  theme?: 'light' | 'dark';
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onStart, theme }) => {
  const investButtons = [
    { 
      name: "Invest in Mutual Fund", 
      icon: "📈", 
      url: "https://planyourfuture.themfbox.com/",
      desc: "Institutional mutual fund portal"
    },
    { 
      name: "Invest in Bonds & FD", 
      icon: "🛡️", 
      url: "https://stablemoney.in/?shortlink=c43s254m&c=Offline&pid=Koustav%20Biswas&af_xp=custom&source_caller=ui",
      desc: "Fixed yields and security"
    },
    { 
      name: "Invest in Shares", 
      icon: "📊", 
      url: "https://angel-one.onelink.me/Wjgr/xtq5crdk",
      desc: "Direct equity trading"
    },
    { 
      name: "Query via WhatsApp", 
      icon: "💬", 
      url: "https://wa.me/919830560706?text=Namaste! I want to plan my future.", 
      desc: "Chat with our Professional Team"
    },
    { 
      name: "Discuss with Professionals", 
      icon: "📞", 
      url: "tel:+919830560706",
      desc: "Call for high-net-worth execution"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#000814] min-h-screen transition-colors duration-500">
      
      {/* 1. HERO SECTION: Guruji Discussion (ABSOLUTE TOP) */}
      <section className="relative pt-6 pb-24 bg-white dark:bg-[#000814] overflow-hidden">
        {/* Subtle Background Vision Gradients */}
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-amber-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-blue-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Elite Mini-Header Integrated */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center space-x-5">
              <div className="h-12 w-1.5 bg-amber-500 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-[0.25em] leading-none">Plan Your Future</h1>
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.6em] mt-2">Professional Leadership: Mr. Koustav Biswas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-5">
              <div className="hidden xl:flex items-center space-x-4 bg-slate-50 dark:bg-blue-900/10 px-6 py-3 rounded-full border border-gray-100 dark:border-blue-900/40">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-500 dark:text-blue-100 uppercase tracking-widest">Discussion Node: Active 🏛️</span>
              </div>
              <a 
                href="https://planyourfuture.themfbox.com/" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] font-black bg-amber-500 text-[#001040] px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-amber-400 transition-all shadow-2xl hover:-translate-y-0.5"
              >
                Customer Login 🏛️
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Immersive Discussion Interface */}
            <div className="lg:col-span-8 order-2 lg:order-1 relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 rounded-[64px] blur-2xl opacity-40"></div>
              <div className="relative shadow-[0_50px_120px_rgba(0,16,64,0.15)] rounded-[60px] overflow-hidden border border-gray-100 dark:border-blue-900 bg-white dark:bg-[#000814]">
                <ChatWindow />
              </div>
            </div>

            {/* Strategic Content Column */}
            <div className="lg:col-span-4 order-1 lg:order-2 space-y-10 lg:pt-12 text-center lg:text-left">
              <div className="space-y-5">
                <h2 className="text-5xl lg:text-6xl font-serif font-bold text-[#001040] dark:text-white leading-[1.1] uppercase tracking-tighter">
                  INSTITUTIONAL <br />
                  <span className="text-amber-500 dark:text-amber-400 italic">WISDOM</span>
                </h2>
                <div className="w-24 h-1.5 bg-amber-500 rounded-full mx-auto lg:mx-0"></div>
              </div>

              <p className="text-xl text-gray-500 dark:text-blue-100/60 leading-relaxed font-light">
                Guruji facilitates deep discussions on global asset cycles, NRI strategies, and the logic path of wealth preservation.
              </p>
              
              <div className="space-y-5 pt-4">
                 <Button onClick={onStart} size="lg" className="w-full rounded-[30px] shadow-2xl bg-[#001040] dark:bg-amber-500 dark:text-[#001040] hover:bg-blue-900 dark:hover:bg-amber-400 border-none text-white font-black px-12 py-6 transform transition hover:scale-[1.03] uppercase tracking-[0.3em] text-[13px]">
                   OPEN VISION BOARD 🦅
                 </Button>
                 <div className="flex items-center justify-center space-x-4 opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Neural Logic Session</span>
                 </div>
              </div>

              <div className="p-10 bg-[#fbfcfd] dark:bg-blue-900/10 rounded-[50px] border border-gray-100 dark:border-blue-800/40 shadow-sm">
                <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.5em] mb-8">Session Pillars</h4>
                <div className="space-y-7">
                  {[
                    { icon: "🎙️", label: "Voice Navigation Flow" },
                    { icon: "📜", label: "Smart Vision Ledger" },
                    { icon: "🌍", label: "Global Grounding Analysis" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-5">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-[11px] font-black text-gray-600 dark:text-blue-200 uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER'S VISION */}
      <section className="py-28 bg-white dark:bg-[#000814] relative overflow-hidden border-t border-gray-100 dark:border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
           <div className="max-w-4xl mx-auto text-center space-y-20">
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center space-x-8 border-y border-amber-500/15 py-6 px-12 mb-12">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.6em]">Visionary Leadership</span>
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.6em]">Professional Standard</span>
                </div>
                
                <h3 className="text-4xl lg:text-6xl font-serif font-bold text-[#001040] dark:text-white leading-tight">
                  "Wealth is not just a destination; it is a disciplined vision that rises above the noise."
                </h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-[30px] bg-[#001040] border-[6px] border-amber-500/20 flex items-center justify-center text-white font-serif font-bold text-3xl mb-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                  KB
                </div>
                <p className="text-3xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-[0.15em]">Mr. Koustav Biswas</p>
                <p className="text-[11px] text-amber-600 font-black uppercase tracking-[0.6em] mt-4">Founder • Lead Private Wealth Professional</p>
              </div>

              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: "Market Tenure", value: "20+ Years" },
                  { label: "Segment", value: "Institutional" },
                  { label: "Focus", value: "Wealth Preservation" },
                  { label: "Registration", value: "EUIN: E389902" }
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <p className="text-4xl font-serif font-bold text-[#001040] dark:text-white group-hover:text-amber-500 transition-colors duration-500">{stat.value}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-3 opacity-60">{stat.label}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* 3. STRATEGIC GATEWAYS */}
      <section className="py-28 bg-[#f9fafb] dark:bg-[#000c24] border-y border-gray-100 dark:border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-24">
            <h3 className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.7em] mb-5">Strategic Access</h3>
            <h2 className="text-6xl font-serif font-bold text-[#001040] dark:text-white tracking-tighter">INSTITUTIONAL GATEWAYS</h2>
            <div className="w-24 h-2 bg-amber-500 mx-auto mt-10 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {investButtons.map((btn, i) => (
              <a 
                key={i} 
                href={btn.url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white dark:bg-[#001040] p-12 rounded-[60px] border border-gray-100 dark:border-blue-900/40 shadow-sm hover:shadow-[0_40px_100px_rgba(0,16,64,0.15)] hover:-translate-y-4 transition-all duration-700 group text-center flex flex-col items-center h-full"
              >
                <div className="text-7xl mb-12 transform group-hover:scale-125 transition-transform duration-700 grayscale group-hover:grayscale-0">{btn.icon}</div>
                <h4 className="font-black text-[#001040] dark:text-white text-[16px] leading-tight mb-4 uppercase tracking-tighter">{btn.name}</h4>
                <p className="text-[10px] text-gray-400 dark:text-blue-200/50 font-bold uppercase tracking-[0.2em] leading-relaxed px-2">{btn.desc}</p>
                <div className="mt-12 p-4 bg-slate-50 dark:bg-blue-900/50 rounded-full text-[#001040] dark:text-white group-hover:bg-amber-500 dark:group-hover:bg-amber-400 group-hover:text-white dark:group-hover:text-[#001040] transition-all duration-500">
                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC PLANNING TOOLS */}
      <section className="py-32 bg-white dark:bg-[#000814]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 space-y-10 lg:space-y-0">
            <div className="space-y-6 text-center lg:text-left">
              <h3 className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.8em]">Visionary Analytics</h3>
              <h2 className="text-7xl font-serif font-bold text-[#001040] dark:text-white leading-[0.9]">STRATEGIC <br /> PLANNING</h2>
            </div>
            <p className="text-gray-500 dark:text-blue-100/50 max-w-sm text-2xl font-light leading-relaxed text-center lg:text-right italic">
              Sophisticated institutional tools designed to map your financial destiny with surgical precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <RetirementCalculator />
            <SIPCalculator />
            <ChildEducationCalculator />
            <SWPCalculator />
            <LoanCalculator />
            
            <div className="p-14 rounded-[64px] bg-[#001040] dark:bg-amber-500 text-white dark:text-[#001040] flex flex-col justify-center items-center text-center shadow-[0_50px_100px_rgba(0,16,64,0.2)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -mr-28 -mt-28 group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="w-24 h-24 bg-white/10 dark:bg-[#001040]/10 rounded-[35px] flex items-center justify-center text-5xl mb-10 relative z-10 shadow-inner">📞</div>
               <h4 className="text-3xl font-serif font-bold mb-6 relative z-10 uppercase tracking-tight">360° Vision Consultation</h4>
               <p className="opacity-70 dark:text-[#001040] text-base mb-12 leading-relaxed relative z-10 font-medium px-6">Direct channel to our senior professional team for high-net-worth execution and vision alignment.</p>
               <Button variant="outline" onClick={() => window.open('tel:+919830560706')} className="w-full rounded-full py-6 border-white dark:border-[#001040] text-white dark:text-[#001040] hover:bg-white hover:text-[#001040] dark:hover:bg-[#001040] dark:hover:text-white font-black relative z-10 transition-all uppercase tracking-[0.5em] text-[12px] shadow-2xl">
                CALL PROFESSIONAL 🦅
               </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
