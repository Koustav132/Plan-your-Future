
import React, { useState, useRef, useEffect } from "react";
import { Message, UserData } from "../types";
import { getGeminiProResponse, generateSpeech, transcribeAudio } from "../services/geminiService";
import { Button } from "./Button";
import { LiveAudioSession } from "./LiveAudioSession";

interface ChatWindowProps {
  userData?: UserData;
}

const INDIAN_LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "Bengali", label: "বাংলা (Bengali)" },
  { code: "Marathi", label: "मराठी (Marathi)" },
  { code: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { code: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "Telugu", label: "తెలుగు (Telugu)" },
  { code: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { code: "Malayalam", label: "മലയാളം (Malayalam)" },
  { code: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" }
];

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ userData }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Namaste. I am Financial Guruji. 🦅\n\nI am here to lead a deep discussion on your wealth journey. My insights are based on 20 years of institutional professional logic.\n\nYou can share your financial statements or ledger documents for a deep descriptive and predictive audit.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ data: string; name: string; type: string } | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const discussionThemes = [
    { title: "Wealth Ethics", icon: "🏛️" },
    { title: "Taxation Logic", icon: "⚖️" },
    { title: "Market Cycles", icon: "📈" },
    { title: "NRI Vision", icon: "🌏" },
    { title: "Legacy Assets", icon: "📜" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleToggleTranscription = async () => {
    if (isTranscribing) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsTranscribing(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          const text = await transcribeAudio(base64Audio, 'audio/webm');
          if (text) setInput(text);
          setIsLoading(false);
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorder.start();
      setIsTranscribing(true);
    } catch (err) {
      console.error("Microphone access failed", err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          data: reader.result as string,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking && activeSourceRef.current) {
      activeSourceRef.current.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const audioData = await generateSpeech(text);
    if (audioData) {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      const bytes = decodeBase64(audioData);
      const buffer = await decodeAudioData(bytes, audioCtxRef.current, 24000, 1);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      activeSourceRef.current = source;
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  const handleSend = async (customInput?: string) => {
    const finalInput = customInput || input;
    if ((!finalInput.trim() && !selectedFile) || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: finalInput || `Ledger document [${selectedFile?.name}] provided for professional audit.`,
      timestamp: new Date(),
      image: selectedFile && selectedFile.type.startsWith('image/') ? selectedFile.data : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentFile = selectedFile;
    setInput("");
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const result = await getGeminiProResponse(
        messages.concat(userMsg), 
        userData, 
        currentFile ? { data: currentFile.data, mimeType: currentFile.type } : undefined,
        selectedLanguage
      );
      setMessages(prev => [...prev, {
        role: 'model',
        content: result.text,
        timestamp: new Date(),
        groundingUrls: result.grounding as any
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        content: "I am recalibrating my market connection. Please share your vision again shortly. 🦅",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[750px] bg-white dark:bg-[#000814] rounded-[50px] shadow-2xl overflow-hidden border border-gray-100 dark:border-blue-900/40">
      {/* Premium Session Header */}
      <div className="px-10 py-7 bg-[#fcfdfe] dark:bg-blue-950/20 flex items-center justify-between border-b border-gray-100 dark:border-blue-900/40">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-[#001040] dark:bg-amber-500 rounded-2xl flex items-center justify-center text-white dark:text-[#001040] text-3xl shadow-xl border border-white/5">🦅</div>
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#001040] dark:text-white uppercase tracking-tight">Guruji Discussion Session</h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Institutional Wisdom Node Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="appearance-none bg-white dark:bg-blue-900/50 border border-gray-100 dark:border-blue-800 rounded-xl px-5 py-3 pr-10 text-[10px] font-black uppercase tracking-widest text-[#001040] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-blue-800"
          >
            {INDIAN_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-white dark:bg-blue-950 text-[#001040] dark:text-white">
                {lang.label}
              </option>
            ))}
          </select>

          <button 
            onClick={() => setIsLiveOpen(true)} 
            className="p-4 bg-amber-500 text-[#001040] rounded-2xl shadow-xl hover:scale-105 transition-transform border-none flex items-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Live Voice</span>
          </button>
        </div>
      </div>

      {/* Discussion Feed Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 bg-white dark:bg-[#000814] scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
            <div className={`max-w-[92%] relative ${msg.role === 'user' ? 'text-right' : 'text-left w-full'}`}>
              
              {msg.role === 'model' ? (
                <div className="bg-[#f8fafb] dark:bg-[#000e2e] p-10 rounded-[50px] border border-gray-100 dark:border-blue-900/60 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                  <div className="flex items-center space-x-3 mb-8 opacity-40">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Lead Professional Insight 🏛️</span>
                     <div className="h-[1px] flex-1 bg-gray-100 dark:bg-blue-900"></div>
                  </div>
                  <div className="whitespace-pre-wrap text-[18px] leading-relaxed font-serif text-[#001040] dark:text-blue-50 selection:bg-emerald-100">
                    {msg.content}
                  </div>
                  
                  {msg.groundingUrls && (
                    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-blue-900/50">
                      <p className="text-[9px] font-black uppercase text-emerald-600 tracking-[0.4em] mb-4">Grounding Sources</p>
                      <div className="flex flex-wrap gap-3">
                        {msg.groundingUrls.map((g, j) => (
                          <a key={j} href={g.web.uri} target="_blank" rel="noreferrer" className="text-[11px] bg-white dark:bg-blue-900/40 px-5 py-2.5 rounded-full text-blue-800 dark:text-blue-200 hover:bg-emerald-500 hover:text-white transition-all border border-gray-100 dark:border-blue-900/50 shadow-sm">{g.web.title}</a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button 
                      onClick={() => handleSpeak(msg.content)} 
                      className={`p-3 rounded-xl transition-all ${isSpeaking ? 'text-emerald-500 bg-emerald-500/10 animate-pulse' : 'text-gray-300 hover:text-emerald-500'}`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#001040] text-white p-7 rounded-[35px] rounded-tr-none shadow-xl inline-block max-w-[85%] text-left">
                  {msg.image && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/10">
                      <img src={msg.image} alt="Attachment" className="w-full h-auto max-h-64 object-contain" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-[16px] font-bold leading-relaxed">{msg.content}</div>
                  <div className="mt-3 text-[9px] font-black uppercase opacity-40 text-right tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f8fafb] dark:bg-blue-950/40 p-10 rounded-[50px] animate-pulse flex flex-col space-y-5 w-full border border-gray-50 dark:border-blue-900/30">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.5em]">Auditing Institutional Ledger...</span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-blue-900/40 rounded-full w-4/5"></div>
              <div className="h-4 bg-gray-200 dark:bg-blue-900/40 rounded-full w-2/3"></div>
            </div>
          </div>
        )}
      </div>

      {/* Discussion Controls Bar */}
      <div className="p-8 bg-[#fcfdfe] dark:bg-blue-950/40 border-t border-gray-100 dark:border-blue-900/40">
        {!isLoading && messages.length < 5 && (
          <div className="flex space-x-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
            {discussionThemes.map((theme, i) => (
              <button 
                key={i}
                onClick={() => handleSend(`Initiate discussion on ${theme.title}.`)}
                className="flex items-center space-x-3 px-8 py-4 bg-white dark:bg-[#001040] border border-gray-100 dark:border-blue-900 rounded-full shadow-sm hover:border-emerald-500 hover:shadow-lg transition-all whitespace-nowrap group"
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-500">{theme.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#001040] dark:text-blue-100">{theme.title}</span>
              </button>
            ))}
          </div>
        )}

        {selectedFile && (
          <div className="mb-5 bg-white dark:bg-blue-900 p-6 rounded-[30px] flex items-center justify-between border border-emerald-500/30 shadow-xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl">
                {selectedFile.type.startsWith('image/') ? '🖼️' : '📄'}
              </div>
              <div>
                <span className="text-xs font-black text-[#001040] dark:text-white uppercase tracking-widest">Institutional Ledger:</span>
                <p className="text-[10px] text-gray-400 font-bold truncate max-w-[200px]">{selectedFile.name}</p>
              </div>
            </div>
            <button onClick={() => setSelectedFile(null)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">×</button>
          </div>
        )}
        
        <div className="flex items-center space-x-4 bg-white dark:bg-[#000814] p-4 rounded-[35px] shadow-[0_15px_60px_rgba(0,16,64,0.06)] border border-gray-100 dark:border-blue-900/50">
          <button onClick={() => fileInputRef.current?.click()} className="p-4 text-gray-300 hover:text-emerald-500 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf" className="hidden" />
          
          <button 
            onClick={handleToggleTranscription} 
            className={`p-4 rounded-2xl transition-all ${isTranscribing ? 'bg-red-500 text-white animate-pulse' : 'text-gray-300 hover:text-emerald-500'}`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>

          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Engage Guruji in discussion or audit..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[17px] font-medium dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-600"
          />

          <button 
            onClick={() => handleSend()} 
            disabled={isLoading} 
            className="p-5 bg-[#001040] dark:bg-emerald-500 text-white dark:text-[#001040] rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M13 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      {isLiveOpen && <LiveAudioSession onClose={() => setIsLiveOpen(false)} />}
    </div>
  );
};
