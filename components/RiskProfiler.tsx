
import React, { useState } from 'react';
import { Button } from './Button';
import { RiskQuestion } from '../types';

const QUESTIONS: RiskQuestion[] = [
  {
    id: 1,
    question: "Q1. What is your current age?",
    options: [
      { text: "A) Less than 30 years", score: 10 },
      { text: "B) 31 to 45 years", score: 7 },
      { text: "C) 46 to 60 years", score: 5 },
      { text: "D) Above 60 years", score: 1 }
    ]
  },
  {
    id: 2,
    question: "Q2. When do you need to withdraw this money (Investment Horizon)?",
    options: [
      { text: "A) In less than 1 year", score: 1 },
      { text: "B) In 1 to 3 years", score: 3 },
      { text: "C) In 3 to 7 years", score: 7 },
      { text: "D) More than 7 years", score: 10 }
    ]
  },
  {
    id: 3,
    question: "Q3. Which statement best describes your investment knowledge?",
    options: [
      { text: "A) I have no knowledge; I rely completely on advice.", score: 1 },
      { text: "B) I have basic knowledge of savings (FDs, RDs).", score: 3 },
      { text: "C) I understand mutual funds and stock markets moderately.", score: 7 },
      { text: "D) I am an experienced investor (Stocks, F&O, AIF).", score: 10 }
    ]
  },
  {
    id: 4,
    question: "Q4. Imagine the market crashes and your portfolio drops by 20% in one month. What would you do?",
    options: [
      { text: "A) Panic and withdraw everything immediately.", score: 1 },
      { text: "B) Worry, but wait for a few months.", score: 5 },
      { text: "C) Do nothing; I understand markets go up and down.", score: 7 },
      { text: "D) Invest more money to buy at lower prices.", score: 10 }
    ]
  },
  {
    id: 5,
    question: "Q5. What is your primary goal for this investment?",
    options: [
      { text: "A) Capital Protection (No principal loss).", score: 1 },
      { text: "B) Regular Income with slight growth.", score: 3 },
      { text: "C) Wealth Accumulation (Balance of risk and growth).", score: 7 },
      { text: "D) Aggressive Growth (Maximizing returns long term).", score: 10 }
    ]
  },
  {
    id: 6,
    question: "Q6. What percentage of your monthly income do you save?",
    options: [
      { text: "A) Less than 10%", score: 1 },
      { text: "B) 10% to 25%", score: 5 },
      { text: "C) 25% to 50%", score: 7 },
      { text: "D) More than 50%", score: 10 }
    ]
  }
];

export const RiskProfiler: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [step, setStep] = useState(0);

  const handleSelect = (qId: number, score: number) => {
    setAnswers({ ...answers, [qId]: score });
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  // Explicitly type reduce parameters to fix 'operator + cannot be applied to unknown' error
  const calculate = () => {
    const total = Object.values(answers).reduce((a: number, b: number) => a + b, 0);
    onComplete(total);
  };

  const currentQ = QUESTIONS[step];

  return (
    <div className="bg-white dark:bg-[#001a40] p-10 rounded-[40px] border border-gray-100 dark:border-blue-900 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16"></div>
      
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight">Risk Appetite Assessment</h3>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em] mt-2">Compliance Scoring Model</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-amber-500">{step + 1}</span>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2">/ {QUESTIONS.length}</span>
        </div>
      </div>

      <div className="mb-12 animate-in fade-in slide-in-from-right-4 duration-500">
        <p className="text-xl text-[#001040] dark:text-blue-50 mb-10 font-medium leading-relaxed">{currentQ.question}</p>
        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(currentQ.id, opt.score)}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                answers[currentQ.id] === opt.score 
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-500/10' 
                : 'border-gray-50 dark:border-blue-900/50 hover:border-amber-200 dark:hover:border-amber-500/30'
              }`}
            >
              <div className="flex justify-between items-center relative z-10">
                <span className={`font-bold uppercase text-xs tracking-wider ${answers[currentQ.id] === opt.score ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>{opt.text}</span>
                {answers[currentQ.id] === opt.score && (
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-amber-500/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-50 dark:border-blue-900/50">
        <button 
          onClick={() => step > 0 && setStep(step - 1)} 
          disabled={step === 0}
          className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${step === 0 ? 'opacity-0' : 'text-gray-400 hover:text-[#001040] dark:hover:text-white transition-colors'}`}
        >
          <span className="mr-3">←</span> Back to Wisdom
        </button>
        
        {Object.keys(answers).length === QUESTIONS.length ? (
          <Button onClick={calculate} className="px-10 py-5 bg-[#001040] dark:bg-amber-500 dark:text-[#001040] text-white shadow-2xl rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-transform">
            Calculate Vision Score 🦅
          </Button>
        ) : (
          <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest italic">Choose an option to proceed</p>
        )}
      </div>
    </div>
  );
};
