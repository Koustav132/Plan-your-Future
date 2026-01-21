
import React from 'react';
import { Button } from './Button';
import { ChatWindow } from './ChatWindow';

interface PublicHomeProps {
  onStart: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onStart }) => {
  const investButtons = [
    { name: "Mutual Funds", icon: "📈", url: "https://planyourfuture.themfbox.com/", desc: "Execution portal" },
    { name: "Bonds & FD", icon: "🛡️", url: "https://stablemoney.in/?pid=Koustav%20Biswas", desc: "Fixed yields" },
    { name: "Shares", icon: "📊", url: "https://angel-one.onelink.me/Wjgr/xtq5crdk", desc: "Direct trading" },
    { name: "WhatsApp", icon: "💬", url: "https://wa.me/919830560706", desc: "Consult Team" }
  ];

  return (
    <div className="bg-white dark:bg-[#000814] min-h-screen">
      <section className="relative pt-8 pb-20 overflow-hidden">
        {/* Background dots */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#001040] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">🦅</div>
              <div>
                <h1 className="text-2xl font-black text-[#001040] dark:text-white uppercase tracking-tight">Plan Your Future</h1>
                <p className="text-[8px] font-black text-amber-600 uppercase tracking-[0.5em]">Vision of Mr. Koustav Biswas</p>
              </div>
            </div>
            <a href="https://planyourfuture.themfbox.com/" className="text-[10px] font-black bg-amber-500 text-[#001040] px-6 py-3 rounded-full uppercase tracking-widest shadow-xl">Login 🏛️</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="relative rounded-[40px] overflow-hidden border border-gray-100 dark:border-blue-900 bg-white dark:bg-[#000814] shadow-2xl">
                <ChatWindow />
              </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-[#001040] dark:text-white uppercase leading-none tracking-tighter">
                   <span className="text-emerald-500 font-normal">Global Financial Wisdom</span>
                </h2>
                <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto lg:mx-0"></div>
              </div>
              <p className="text-lg text-gray-500 dark:text-blue-100/60 font-medium">
                Guruji facilitates deep discussions on global asset cycles and <span className="text-emerald-500 font-normal">Global Financial Wisdom</span> wealth preservation strategies.
              </p>
              <Button onClick={onStart} size="lg" className="w-full rounded-2xl shadow-xl bg-[#001040] dark:bg-amber-500 dark:text-[#001040] font-black text-[12px] uppercase tracking-widest py-5">
                ENTER VISION PORTAL 🦅
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-[#000c24] border-y border-gray-100 dark:border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {investButtons.map((btn, i) => (
              <a key={i} href={btn.url} target="_blank" rel="noreferrer" className="bg-white dark:bg-[#001040] p-8 rounded-[30px] border border-gray-100 dark:border-blue-900/40 shadow-sm hover:shadow-xl transition-all text-center flex flex-col items-center">
                <div className="text-5xl mb-6">{btn.icon}</div>
                <h4 className="font-black text-[#001040] dark:text-white text-xs uppercase tracking-wider mb-2">{btn.name}</h4>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">{btn.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
