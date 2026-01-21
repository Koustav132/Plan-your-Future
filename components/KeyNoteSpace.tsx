
import React from 'react';

interface KeyNoteSpaceProps {
  notes: string;
  onUpdate: (val: string) => void;
}

export const KeyNoteSpace: React.FC<KeyNoteSpaceProps> = ({ notes, onUpdate }) => {
  return (
    <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-serif font-bold text-amber-900">Personal Wealth Notes 📝</h3>
        <span className="text-[10px] text-amber-700 font-black uppercase tracking-widest">Auto-Saving enabled</span>
      </div>
      <textarea
        className="flex-1 w-full bg-transparent border-none focus:ring-0 text-amber-950 font-medium leading-relaxed resize-none text-lg"
        placeholder="Document your aspirations, financial realizations, or reminders from the Guru here..."
        value={notes}
        onChange={(e) => onUpdate(e.target.value)}
      />
      <div className="mt-6 pt-6 border-t border-amber-200/50 flex items-center space-x-4">
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-white shadow-md">🦅</div>
        <p className="text-xs text-amber-800 italic">"Writing down your goals is the first step in turning the invisible into the visible."</p>
      </div>
    </div>
  );
};
