
import React, { useState } from 'react';
import { FinancialGoal } from '../types';
import { Button } from './Button';

interface GoalsTrackerProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: FinancialGoal) => void;
  onUpdateGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
}

const ShareModal: React.FC<{ 
  goal: FinancialGoal; 
  onClose: () => void 
}> = ({ goal, onClose }) => {
  const [copied, setCopied] = useState(false);
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const message = `Namaste! I'm mapping my financial vision on "Plan Your Future". My goal "${goal.title}" is currently at ${Math.round(progress)}% progress (₹${goal.currentAmount.toLocaleString()} saved of ₹${goal.targetAmount.toLocaleString()} target). Founder: Mr. Koustav Biswas 🦅`;

  const shareEmail = () => {
    const subject = encodeURIComponent(`Financial Vision: ${goal.title}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#001040] w-full max-w-md rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-blue-900 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight">Share Your Vision</h3>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em] mt-2">Institutional Milestone Export</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-blue-900 rounded-full transition-colors text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4 mb-10">
            <button 
              onClick={shareWhatsApp}
              className="w-full flex items-center p-6 bg-green-50 dark:bg-green-500/10 rounded-3xl border border-green-100 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all group"
            >
              <span className="text-3xl mr-6 group-hover:scale-110 transition-transform">💬</span>
              <div className="text-left">
                <p className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest">WhatsApp</p>
                <p className="text-[10px] text-green-600/70 font-medium">Broadcast your progress</p>
              </div>
            </button>

            <button 
              onClick={shareEmail}
              className="w-full flex items-center p-6 bg-blue-50 dark:bg-blue-500/10 rounded-3xl border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all group"
            >
              <span className="text-3xl mr-6 group-hover:scale-110 transition-transform">✉️</span>
              <div className="text-left">
                <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Email</p>
                <p className="text-[10px] text-blue-600/70 font-medium">Share formal roadmap details</p>
              </div>
            </button>

            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center p-6 bg-amber-50 dark:bg-amber-500/10 rounded-3xl border border-amber-100 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all group"
            >
              <span className="text-3xl mr-6 group-hover:scale-110 transition-transform">{copied ? '✅' : '📋'}</span>
              <div className="text-left">
                <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">{copied ? 'Copied' : 'Copy Text'}</p>
                <p className="text-[10px] text-amber-600/70 font-medium">Clipboard vision summary</p>
              </div>
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-blue-900 text-center">
            <p className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.5em]">Powered by Plan Your Future 🦅</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GoalsTracker: React.FC<GoalsTrackerProps> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [sharingGoal, setSharingGoal] = useState<FinancialGoal | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FinancialGoal>>({
    title: '',
    type: 'retirement',
    targetAmount: 0,
    currentAmount: 0,
    deadline: ''
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', type: 'retirement', targetAmount: 0, currentAmount: 0, deadline: '' });
  };

  const handleEdit = (goal: FinancialGoal) => {
    setFormData(goal);
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (formData.title && formData.targetAmount) {
      if (editingId) {
        onUpdateGoal({ ...formData as FinancialGoal, id: editingId });
      } else {
        onAddGoal({
          ...formData as FinancialGoal,
          id: Math.random().toString(36).substr(2, 9)
        });
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-10">
      {sharingGoal && <ShareModal goal={sharingGoal} onClose={() => setSharingGoal(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight">Your Milestones 🦅</h3>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.3em] mt-2">Vision Mapping & Goal Progress</p>
        </div>
        <Button 
          onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} 
          className={`rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-[#001040] dark:bg-amber-500 text-white dark:text-[#001040]'}`}
        >
          {showForm ? 'Cancel Journey' : '+ Add New Goal'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-50 dark:bg-blue-900/10 p-10 rounded-[40px] border border-gray-100 dark:border-blue-800 animate-in fade-in zoom-in-95 duration-500">
          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8">{editingId ? 'Refine Existing Vision' : 'Define New Vision'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Goal Identity</label>
              <input 
                placeholder="e.g. My First Home" 
                className="w-full bg-white dark:bg-[#001040] p-4 rounded-2xl border border-gray-100 dark:border-blue-800 focus:border-amber-500 outline-none font-bold text-[#001040] dark:text-white transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
              <select 
                className="w-full bg-white dark:bg-[#001040] p-4 rounded-2xl border border-gray-100 dark:border-blue-800 focus:border-amber-500 outline-none font-bold text-[#001040] dark:text-white transition-all appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="retirement">Retirement</option>
                <option value="education">Education</option>
                <option value="home">Home</option>
                <option value="car">Car</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Amount (₹)</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-white dark:bg-[#001040] p-4 rounded-2xl border border-gray-100 dark:border-blue-800 focus:border-amber-500 outline-none font-bold text-[#001040] dark:text-white transition-all"
                value={formData.targetAmount || ''}
                onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Saved (₹)</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-white dark:bg-[#001040] p-4 rounded-2xl border border-gray-100 dark:border-blue-800 focus:border-amber-500 outline-none font-bold text-[#001040] dark:text-white transition-all"
                value={formData.currentAmount || ''}
                onChange={e => setFormData({...formData, currentAmount: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Deadline Date</label>
              <input 
                type="date" 
                className="w-full bg-white dark:bg-[#001040] p-4 rounded-2xl border border-gray-100 dark:border-blue-800 focus:border-amber-500 outline-none font-bold text-[#001040] dark:text-white transition-all"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full py-5 bg-[#001040] dark:bg-amber-500 text-white dark:text-[#001040] rounded-[24px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-transform">
            {editingId ? 'Update Vision Roadmap 🦅' : 'Establish Roadmap 🦅'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const isComplete = progress >= 100;
          
          // Dynamic color scheme based on progress
          const getProgressColorClass = () => {
            if (isComplete) return 'from-emerald-400 via-emerald-500 to-emerald-600';
            if (progress >= 70) return 'from-amber-400 via-emerald-400 to-emerald-500';
            return 'from-amber-400 via-amber-500 to-amber-600';
          };

          return (
            <div 
              key={goal.id} 
              className={`group bg-white dark:bg-[#001a40] p-8 rounded-[40px] border transition-all duration-500 relative overflow-hidden ${
                isComplete 
                ? 'border-emerald-500 dark:border-emerald-500/50 shadow-[0_20px_60px_rgba(16,185,129,0.1)]' 
                : 'border-gray-100 dark:border-blue-900 shadow-xl hover:shadow-2xl'
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150 ${isComplete ? 'bg-emerald-500/10' : 'bg-amber-500/5'}`}></div>
              
              {isComplete && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-[0.3em] shadow-lg animate-bounce z-20">
                  Vision Realized ✨
                </div>
              )}

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h4 className="text-xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight mb-1">{goal.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <p className="text-[9px] text-gray-400 dark:text-blue-300 uppercase tracking-widest font-black">{goal.type} Strategy</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                   <button 
                     onClick={() => setSharingGoal(goal)}
                     className="p-3 bg-gray-50 dark:bg-blue-900/30 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-all"
                     title="Share Vision"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                   </button>
                   <button 
                     onClick={() => handleEdit(goal)}
                     className="p-3 bg-gray-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                     title="Edit Goal"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                   </button>
                   <button 
                     onClick={() => onDeleteGoal(goal.id)}
                     className="p-3 bg-gray-50 dark:bg-blue-900/30 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                     title="Delete Goal"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Target Wealth</p>
                     <p className="text-xl font-black text-[#001040] dark:text-white">₹{goal.targetAmount.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Target Date</p>
                     <p className="text-xs font-bold text-[#001040] dark:text-blue-100">{goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' }) : 'Undated'}</p>
                   </div>
                </div>

                <div className="relative pt-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className={`${isComplete ? 'text-emerald-500' : 'text-amber-600'} font-black transition-colors`}>
                      {isComplete ? '100% SECURED' : `${progress.toFixed(1)}% REACHED`}
                    </span>
                    <span className="text-gray-400">₹{goal.currentAmount.toLocaleString()} SAVED</span>
                  </div>
                  <div className={`w-full h-4 rounded-full overflow-hidden relative p-[2px] transition-all border ${isComplete ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/30' : 'bg-gray-100 dark:bg-blue-900/50 border-gray-100 dark:border-blue-900/50'}`}>
                    <div 
                      className={`bg-gradient-to-r ${getProgressColorClass()} h-full transition-all duration-1000 ease-out rounded-full group-hover:animate-pulse ${isComplete ? 'shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                    <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none">
                       <span className="text-[6px] font-black text-gray-400 uppercase tracking-tighter">START</span>
                       <span className={`text-[6px] font-black uppercase tracking-tighter ${isComplete ? 'text-white' : 'text-amber-500'}`}>VISION</span>
                    </div>
                  </div>
                  {!isComplete && (
                    <p className="text-[8px] text-gray-400 mt-2 font-bold uppercase tracking-widest text-right">
                      ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} more to destiny
                    </p>
                  )}
                </div>
              </div>
              
              <div className={`mt-8 pt-6 border-t flex items-center justify-between transition-colors ${isComplete ? 'border-emerald-100 dark:border-emerald-500/20' : 'border-gray-50 dark:border-blue-900/50'}`}>
                 <p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">Institutional Roadmap</p>
                 <div className="flex -space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] transition-all ${
                          isComplete 
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600' 
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                        }`}
                      >
                        🦅
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && !showForm && (
          <div className="md:col-span-2 py-20 bg-gray-50 dark:bg-blue-900/10 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-blue-800 text-center flex flex-col items-center justify-center space-y-4">
             <div className="w-20 h-20 bg-white dark:bg-[#001040] rounded-full flex items-center justify-center text-4xl shadow-xl border border-gray-100 dark:border-blue-900">🔭</div>
             <h4 className="text-xl font-serif font-bold text-[#001040] dark:text-white uppercase tracking-tight">No Active Milestones</h4>
             <p className="text-sm text-gray-500 max-w-xs">Start your journey by defining your first financial destination.</p>
             <button onClick={() => setShowForm(true)} className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] hover:text-amber-500 transition-colors">Begin Vision Setup 🦅</button>
          </div>
        )}
      </div>
    </div>
  );
};
