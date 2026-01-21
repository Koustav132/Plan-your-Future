
import React from 'react';
import { UserData } from '../types';
import { Button } from './Button';

export const Recommendations: React.FC<{ userData: UserData }> = ({ userData }) => {
  const score = userData.riskScore;
  
  let category = "Moderate";
  let persona = "The Balanced Investor";
  let philosophy = "Wants to beat inflation but can't stomach huge volatility.";
  let logicDesc = "Score 21 to 40: Balanced vision prioritizing steady growth while mitigating drawdown.";
  let recs = [
    { title: "Aggressive Hybrid Funds", desc: "For dynamic participation in equity and debt.", tag: "Balanced" },
    { title: "Nifty 50 Index Fund", desc: "Core large-cap exposure for stability.", tag: "Equity" },
    { title: "Dynamic Bond Fund", desc: "Interest rate play for fixed income gains.", tag: "Debt" }
  ];

  if (score > 40) {
    category = "Aggressive";
    persona = "The Growth Investor";
    philosophy = "Willing to see short-term losses for long-term wealth creation.";
    logicDesc = "Score 41 to 60: High-conviction growth vision leveraging market volatility for alpha.";
    recs = [
      { title: "Mid-Cap Opportunity Fund", desc: "Focus on the next-gen bluechips of India.", tag: "Small/Mid" },
      { title: "Small-Cap Growth Discovery", desc: "High-risk, high-alpha for 10+ year horizons.", tag: "Small Cap" },
      { title: "International Equity Fund", desc: "Global diversification into tech giants.", tag: "Global" }
    ];
  } else if (score < 21 && score > 0) {
    category = "Conservative";
    persona = "The Safety First Investor";
    philosophy = "Prioritizes keeping money safe over high returns.";
    logicDesc = "Score 6 to 20: Defensive vision focused on capital preservation and liquidity.";
    recs = [
      { title: "Liquid Funds", desc: "Institutional safety with higher yield than bank FD.", tag: "Cash" },
      { title: "Conservative Hybrid Funds", desc: "Debt focus with minor (10-25%) equity kicker.", tag: "Stable" },
      { title: "Arbitrage Funds", desc: "Tax-efficient low risk market neutral play.", tag: "Low Risk" }
    ];
  }

  return (
    <div className="space-y-12">
      {/* Risk Profile Header */}
      <div className="bg-white dark:bg-[#001040] p-10 rounded-[40px] border border-gray-100 dark:border-blue-900 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
             <div className="flex items-center space-x-4">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Investment Recommendation</span>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${score > 40 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : score < 21 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                  {category} VISION 🦅
                </div>
             </div>
             <h3 className="text-4xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight leading-none">{persona}</h3>
             <p className="text-xl text-gray-600 dark:text-blue-100/70 font-medium italic leading-relaxed">"{philosophy}"</p>
          </div>
          <div className="bg-gray-50 dark:bg-blue-900/30 p-10 rounded-[40px] text-center border border-gray-100 dark:border-blue-900 shadow-inner flex flex-col justify-center min-w-[180px]">
             <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Algorithm Score</p>
             <p className="text-6xl font-black text-[#001040] dark:text-white leading-none">{score}<span className="text-xl text-gray-300 dark:text-gray-600">/60</span></p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
      </div>

      {/* Logic Analysis Card */}
      <div className="bg-slate-50 dark:bg-blue-900/10 p-10 rounded-[40px] border border-gray-100 dark:border-blue-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-2">Strategic Logic Path</h4>
            <p className="text-sm font-bold text-[#001040] dark:text-blue-100 uppercase tracking-widest">{logicDesc}</p>
          </div>
          <div className="flex space-x-2">
            <div className={`h-1.5 w-12 rounded-full ${score >= 6 && score < 21 ? 'bg-amber-500' : 'bg-gray-200 dark:bg-blue-900'}`}></div>
            <div className={`h-1.5 w-12 rounded-full ${score >= 21 && score <= 40 ? 'bg-amber-500' : 'bg-gray-200 dark:bg-blue-900'}`}></div>
            <div className={`h-1.5 w-12 rounded-full ${score > 40 ? 'bg-amber-500' : 'bg-gray-200 dark:bg-blue-900'}`}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[11px] font-bold text-gray-400 dark:text-blue-200/40 uppercase tracking-widest">
           <div className={score >= 6 && score < 21 ? 'text-amber-600 opacity-100' : 'opacity-40'}>CONSERVATIVE: 6-20</div>
           <div className={score >= 21 && score <= 40 ? 'text-amber-600 opacity-100' : 'opacity-40 text-center'}>MODERATE: 21-40</div>
           <div className={score > 40 ? 'text-amber-600 opacity-100 text-right' : 'opacity-40 text-right'}>AGGRESSIVE: 41-60</div>
        </div>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recs.map((r, i) => (
          <div key={i} className="bg-white dark:bg-[#001a40] p-10 rounded-[40px] border border-gray-100 dark:border-blue-900 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors rounded-full -mr-8 -mt-8"></div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-6 block">{r.tag} Focus</span>
            <h4 className="text-2xl font-serif font-bold text-[#001040] dark:text-white mb-4 group-hover:text-amber-500 transition-colors">{r.title}</h4>
            <p className="text-sm text-gray-600 dark:text-blue-100/60 leading-relaxed font-medium mb-10 flex-grow">{r.desc}</p>
            <a 
              href="https://planyourfuture.themfbox.com/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center text-[10px] font-black text-[#001040] dark:text-amber-400 uppercase tracking-[0.3em] hover:text-amber-500 transition-colors pt-6 border-t border-gray-50 dark:border-blue-900"
            >
              EXECUTE NOW <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </a>
          </div>
        ))}
      </div>

      {/* Founder's Footer */}
      <div className="p-12 bg-[#001040] dark:bg-amber-500 rounded-[50px] text-white dark:text-[#001040] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="text-center md:text-left flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-4">Institutional Professional Team</h4>
              <p className="text-2xl font-serif font-bold italic leading-snug">
                "Our proprietary algorithm translates your risk behavioral data into a diversified roadmap that respects both capital protection and growth aspirations."
              </p>
              <div className="mt-6 flex items-center space-x-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">🦅</div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Mr. Koustav Biswas (Founder)</p>
              </div>
           </div>
           <Button variant="outline" onClick={() => window.open('tel:+919830560706')} className="rounded-full px-12 py-5 border-white dark:border-[#001040] text-white dark:text-[#001040] font-black text-[11px] uppercase tracking-[0.35em] hover:bg-white hover:text-[#001040] dark:hover:bg-[#001040] dark:hover:text-white transition-all whitespace-nowrap shadow-xl">
              CONSULT PROFESSIONAL 🦅
           </Button>
        </div>
      </div>
    </div>
  );
};
