
import React, { useState } from 'react';
import { Button } from './Button';
import { SIPInputs, LoanInputs } from '../types';

const CashflowTable: React.FC<{ 
  headers: string[], 
  data: (string | number)[][], 
  title: string 
}> = ({ headers, data, title }) => (
  <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3">{title}</h4>
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#001040] text-white">
            {headers.map((h, i) => (
              <th key={i} className="p-3 font-black uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              {row.map((cell, j) => (
                <td key={j} className="p-3 font-medium text-[#001040] whitespace-nowrap">
                  {typeof cell === 'number' ? `₹${cell.toLocaleString()}` : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SIPCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<SIPInputs>({
    monthlyInvestment: 5000,
    expectedReturn: 12,
    tenure: 10
  });
  const [result, setResult] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<(string | number)[][] | null>(null);

  const calculate = () => {
    const P = inputs.monthlyInvestment;
    const r = (inputs.expectedReturn / 100) / 12;
    const n = inputs.tenure * 12;
    const fv = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    setResult(Math.round(fv));

    const yearlyData = [];
    let balance = 0;
    for (let year = 1; year <= inputs.tenure; year++) {
      const yearlyInvestment = P * 12;
      const prevBalance = balance;
      // Formula for balance at end of year
      const yearN = year * 12;
      balance = P * (((Math.pow(1 + r, yearN) - 1) / r) * (1 + r));
      const interest = balance - (prevBalance + yearlyInvestment);
      yearlyData.push([`Year ${year}`, yearlyInvestment, Math.round(interest), Math.round(balance)]);
    }
    setSchedule(yearlyData);
  };

  return (
    <div className="p-8 bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-[#001040] mb-6 flex items-center">
        <span className="mr-3 text-2xl">📈</span> SIP Wealth Creator
      </h3>
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Investment (₹)</label>
          <input type="number" value={inputs.monthlyInvestment} onChange={(e) => setInputs({...inputs, monthlyInvestment: Number(e.target.value)})} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none text-lg font-bold text-[#001040]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Return (% p.a.)</label>
            <input type="number" value={inputs.expectedReturn} onChange={(e) => setInputs({...inputs, expectedReturn: Number(e.target.value)})} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tenure (Years)</label>
            <input type="number" value={inputs.tenure} onChange={(e) => setInputs({...inputs, tenure: Number(e.target.value)})} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full py-4 bg-[#001040]">Generate Vision 🦅</Button>
        {result !== null && (
          <div className="mt-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 text-center">
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Maturity Value</p>
            <p className="text-3xl font-serif font-bold text-[#001040]">₹{result.toLocaleString()}</p>
          </div>
        )}
        {schedule && (
          <CashflowTable 
            title="Yearly Growth Statement" 
            headers={['Period', 'Invested', 'Interest', 'Balance']} 
            data={schedule} 
          />
        )}
      </div>
    </div>
  );
};

export const RetirementCalculator: React.FC = () => {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [expenses, setExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [result, setResult] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<(string | number)[][] | null>(null);

  const calculate = () => {
    const yearsToRetire = retireAge - age;
    const futureExpense = expenses * Math.pow(1 + inflation / 100, yearsToRetire);
    const corpusNeeded = Math.round(futureExpense * 12 * 25);
    setResult(corpusNeeded);

    const yearlyData = [];
    for (let i = 0; i <= yearsToRetire; i++) {
      const yearExp = expenses * Math.pow(1 + inflation / 100, i);
      yearlyData.push([`Age ${age + i}`, Math.round(yearExp), i === yearsToRetire ? Math.round(corpusNeeded) : '-']);
    }
    setSchedule(yearlyData);
  };

  return (
    <div className="p-8 bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-[#001040] mb-6 flex items-center">
        <span className="mr-3 text-2xl">🌅</span> Retirement Vision
      </h3>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Age</label>
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Retire At</label>
            <input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Expense (₹)</label>
          <input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
        </div>
        <Button onClick={calculate} className="w-full py-4 bg-[#001040]">Map Retirement 🦅</Button>
        {result !== null && (
          <div className="mt-6 p-6 bg-amber-50/50 rounded-3xl border border-amber-100 text-center">
            <p className="text-[10px] text-amber-600 uppercase font-black tracking-widest mb-1">Target Corpus</p>
            <p className="text-3xl font-serif font-bold text-[#001040]">₹{(result / 10000000).toFixed(2)} Cr</p>
            <p className="text-[9px] text-gray-400 mt-2 font-bold italic tracking-tighter">Adjusted for {inflation}% annual inflation</p>
          </div>
        )}
        {schedule && (
          <CashflowTable 
            title="Inflation & Corpus Statement" 
            headers={['User Age', 'Monthly Need', 'Corpus Goal']} 
            data={schedule} 
          />
        )}
      </div>
    </div>
  );
};

export const SWPCalculator: React.FC = () => {
  const [corpus, setCorpus] = useState(10000000);
  const [withdrawal, setWithdrawal] = useState(50000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [tenure, setTenure] = useState(10);
  const [finalValue, setFinalValue] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<(string | number)[][] | null>(null);

  const calculate = () => {
    let balance = corpus;
    const r = (expectedReturn / 100) / 12;
    const yearlyData = [];
    
    for (let year = 1; year <= tenure; year++) {
      const yearStart = balance;
      let yearInterest = 0;
      for (let m = 1; m <= 12; m++) {
        const interest = balance * r;
        yearInterest += interest;
        balance = balance + interest - withdrawal;
      }
      yearlyData.push([`Year ${year}`, Math.round(yearStart), Math.round(withdrawal * 12), Math.round(yearInterest), Math.max(0, Math.round(balance))]);
      if (balance <= 0) break;
    }
    setFinalValue(Math.max(0, Math.round(balance)));
    setSchedule(yearlyData);
  };

  return (
    <div className="p-8 bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-[#001040] mb-6 flex items-center">
        <span className="mr-3 text-2xl">💸</span> SWP Income Stream
      </h3>
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Corpus (₹)</label>
          <input type="number" value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Withdrawal</label>
            <input type="number" value={withdrawal} onChange={(e) => setWithdrawal(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Return (%)</label>
            <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full py-4 bg-[#001040]">Project Cashflow 🦅</Button>
        {finalValue !== null && (
          <div className="mt-6 p-6 bg-slate-50/50 rounded-3xl border border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Final Balance</p>
            <p className="text-3xl font-serif font-bold text-[#001040]">₹{finalValue.toLocaleString()}</p>
          </div>
        )}
        {schedule && (
          <CashflowTable 
            title="Withdrawal Statement" 
            headers={['Year', 'Opening', 'Withdrawn', 'Interest', 'Closing']} 
            data={schedule} 
          />
        )}
      </div>
    </div>
  );
};

export const ChildEducationCalculator: React.FC = () => {
  const [currentCost, setCurrentCost] = useState(2000000);
  const [years, setYears] = useState(15);
  const [inflation, setInflation] = useState(10);
  const [futureCost, setFutureCost] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<(string | number)[][] | null>(null);

  const calculate = () => {
    const cost = Math.round(currentCost * Math.pow(1 + inflation / 100, years));
    setFutureCost(cost);

    const yearlyData = [];
    for (let i = 1; i <= years; i++) {
      yearlyData.push([`Year ${i}`, Math.round(currentCost * Math.pow(1 + inflation / 100, i))]);
    }
    setSchedule(yearlyData);
  };

  return (
    <div className="p-8 bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-[#001040] mb-6 flex items-center">
        <span className="mr-3 text-2xl">🎓</span> Higher Education
      </h3>
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Degree Cost (₹)</label>
          <input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Years to Admission</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Education Inflation (%)</label>
            <input type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full py-4 bg-[#001040]">Forecast Cost 🦅</Button>
        {futureCost !== null && (
          <div className="mt-6 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-center">
            <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-1">Future Value</p>
            <p className="text-3xl font-serif font-bold text-[#001040]">₹{futureCost.toLocaleString()}</p>
          </div>
        )}
        {schedule && (
          <CashflowTable 
            title="Escalation Statement" 
            headers={['Milestone', 'Projected Cost']} 
            data={schedule} 
          />
        )}
      </div>
    </div>
  );
};

export const LoanCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<LoanInputs>({
    principal: 500000,
    interestRate: 8.5,
    tenureYears: 5
  });
  const [emi, setEmi] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<(string | number)[][] | null>(null);

  const calculate = () => {
    const P = inputs.principal;
    const r = (inputs.interestRate / 100) / 12;
    const n = inputs.tenureYears * 12;
    const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(emiVal));

    const yearlyData = [];
    let balance = P;
    for (let year = 1; year <= inputs.tenureYears; year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        const interest = balance * r;
        const principal = emiVal - interest;
        yearInterest += interest;
        yearPrincipal += principal;
        balance -= principal;
      }
      yearlyData.push([`Year ${year}`, Math.round(yearPrincipal), Math.round(yearInterest), Math.max(0, Math.round(balance))]);
    }
    setSchedule(yearlyData);
  };

  return (
    <div className="p-8 bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-[#001040] mb-6 flex items-center">
        <span className="mr-3 text-2xl">🏠</span> Loan Amortization
      </h3>
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Loan Amount (₹)</label>
          <input type="number" value={inputs.principal} onChange={(e) => setInputs({...inputs, principal: Number(e.target.value)})} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rate (% p.a.)</label>
            <input type="number" value={inputs.interestRate} onChange={(e) => setInputs({...inputs, interestRate: Number(e.target.value)})} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tenure (Years)</label>
            <input type="number" value={inputs.tenureYears} onChange={(e) => setInputs({...inputs, tenureYears: Number(e.target.value)})} className="w-full border-b border-gray-100 focus:border-amber-500 py-2 outline-none font-bold text-[#001040]" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full py-4 bg-[#001040]">Repayment Plan 🦅</Button>
        {emi !== null && (
          <div className="mt-6 p-6 bg-amber-50/50 rounded-3xl border border-amber-100 text-center">
            <p className="text-[10px] text-amber-600 uppercase font-black tracking-widest mb-1">Monthly EMI</p>
            <p className="text-3xl font-serif font-bold text-[#001040]">₹{emi.toLocaleString()}</p>
          </div>
        )}
        {schedule && (
          <CashflowTable 
            title="Amortization Schedule" 
            headers={['Year', 'Principal Paid', 'Interest Paid', 'Balance']} 
            data={schedule} 
          />
        )}
      </div>
    </div>
  );
};
