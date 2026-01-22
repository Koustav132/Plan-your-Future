
import React, { useState, useRef, useEffect } from "react";
import { Message, UserData } from "../types";
import { getGeminiProResponse, generateSpeech, transcribeAudio } from "../services/geminiService";
import { LiveAudioSession } from "./LiveAudioSession";
import { GLOBAL_WISDOM_MAP } from "../constants";

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
  const brandPhrase = GLOBAL_WISDOM_MAP[selectedLanguage] || GLOBAL_WISDOM_MAP["English"];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Namaste. I am Financial Guruji. 🦅\n\nI am here to lead a deep discussion on your wealth journey. My insights are based on 20 years of deep Financial Wisdom.\n\nYou can share your financial statements or ledger documents for a deep descriptive and predictive discussion.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsLoadingMic] = useState(false);
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
      setIsLoadingMic(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          // FAST PATH: Process audio directly for instant response
          handleSend("Institutional Voice Query Processed.", { data: base64Audio, mimeType });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsLoadingMic(true);
    } catch (err) {
      console.error("Microphone access failed", err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ data: reader.result as string, name: file.name, type: file.type });
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
    try {
      const audioData = await generateSpeech(text);
      if (audioData) {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
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
    } catch (err) { setIsSpeaking(false); }
  };

  const handleSend = async (customInput?: string, directAudio?: { data: string; mimeType: string }) => {
    const finalInput = customInput || input;
    if ((!finalInput.trim() && !selectedFile && !directAudio) || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: directAudio ? "Processed Institutional Voice Query 🦅" : (finalInput || `Institutional document provided for discussion.`),
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
        selectedLanguage,
        directAudio
      );
      setMessages(prev => [...prev, { role: 'model', content: result.text, timestamp: new Date(), groundingUrls: result.grounding as any }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "I am recalibrating my market connection. Please share your vision again shortly. 🦅", timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#000814] md:rounded-[40px] shadow-2xl overflow-hidden md:border border-gray-100 dark:border-blue-900/40 transition-all duration-300">
      {/* Small Session Header */}
      <div className="px-4 py-3 bg-[#fcfdfe] dark:bg-blue-950/20 flex items-center justify-between border-b border-gray-100 dark:border-blue-900/40 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#001040] dark:bg-amber-500 rounded-lg flex items-center justify-center text-white dark:text-[#001040] shadow-md">🦅</div>
          <div className="hidden sm:block">
            <h3 className="font-extrabold text-sm md:text-base text-[#001040] dark:text-white uppercase tracking-tighter">
               {brandPhrase}
            </h3>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-600">Active Responsive Node</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="appearance-none bg-white dark:bg-blue-900/50 border border-gray-100 dark:border-blue-800 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#001040] dark:text-white shadow-sm outline-none"
          >
            {INDIAN_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          <button onClick={() => setIsLiveOpen(true)} className="p-2 bg-amber-500 text-[#001040] rounded-lg shadow-sm hover:scale-105 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
        </div>
      </div>

      {/* Massive AI Reading Board - Takes all available space */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-12 py-6 md:py-10 space-y-8 bg-white dark:bg-[#000814] scroll-smooth transition-all">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`w-full ${msg.role === 'user' ? 'max-w-[90%] md:max-w-[70%]' : 'max-w-[100%] md:max-w-[95%]'}`}>
              
              {msg.role === 'model' ? (
                <div className="bg-[#f8fafb] dark:bg-[#000e2e] p-6 md:p-12 rounded-[24px] md:rounded-[48px] border border-gray-50 dark:border-blue-900/40 shadow-sm relative group">
                  <div className="flex items-center space-x-3 mb-6 opacity-40">
                     <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                        {brandPhrase} 🏛️
                     </span>
                     <div className="h-[1px] flex-1 bg-gray-100 dark:bg-blue-900/30"></div>
                  </div>
                  <div className="whitespace-pre-wrap text-[16px] md:text-[22px] leading-relaxed md:leading-[1.75] tracking-tight font-medium text-slate-700 dark:text-blue-100/90 transition-all">
                    {msg.content}
                  </div>
                  
                  {msg.groundingUrls && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-blue-900/30">
                      <p className="text-[8px] font-black uppercase text-emerald-600 tracking-[0.3em] mb-4">Verification Intelligence</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingUrls.map((g, j) => (
                          <a key={j} href={g.web.uri} target="_blank" rel="noreferrer" className="text-[9px] bg-white dark:bg-blue-900/20 px-4 py-2 rounded-full text-blue-800 dark:text-blue-200 border border-gray-100 dark:border-blue-900/50 font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all">{g.web.title}</a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20">{msg.timestamp.toLocaleTimeString()}</span>
                    <button onClick={() => handleSpeak(msg.content)} className={`p-3 rounded-full shadow-sm bg-white dark:bg-blue-900/30 ${isSpeaking ? 'text-emerald-500 animate-pulse' : 'text-gray-300 hover:text-emerald-500'} transition-all`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#001040] text-white p-4 md:p-8 rounded-[24px] md:rounded-[36px] rounded-tr-none shadow-xl inline-block max-w-full float-right">
                  {msg.image && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                      <img src={msg.image} alt="Institutional Asset" className="w-full h-auto max-h-64 object-contain" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-[14px] md:text-[18px] font-bold leading-relaxed">{msg.content}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f8fafb] dark:bg-blue-950/40 p-8 md:p-12 rounded-[24px] md:rounded-[48px] animate-pulse w-full max-w-2xl flex flex-col items-center">
               <div className="h-4 bg-gray-200 dark:bg-blue-900/40 rounded-full w-3/4 mb-6"></div>
               <div className="h-4 bg-gray-200 dark:bg-blue-900/40 rounded-full w-1/2"></div>
               <p className="mt-8 text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Voice Intelligence Processing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Small & Responsive Chat Interaction Area */}
      <div className="p-4 md:p-8 bg-[#fcfdfe] dark:bg-blue-950/40 border-t border-gray-100 dark:border-blue-900/40 flex-shrink-0">
        {!isLoading && (
          <div className="flex space-x-2 md:space-x-4 mb-4 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {discussionThemes.map((theme, i) => (
              <button key={i} onClick={() => handleSend(`Initiate discussion on ${theme.title}.`)} className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-[#001040] border border-gray-100 dark:border-blue-900 rounded-full shadow-sm whitespace-nowrap hover:border-amber-500 transition-all">
                <span className="text-sm">{theme.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#001040] dark:text-blue-100">{theme.title}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3 bg-white dark:bg-[#000814] p-2 md:p-4 rounded-[20px] md:rounded-[40px] border border-gray-100 dark:border-blue-900/50 shadow-inner group">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-300 hover:text-amber-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf" className="hidden" />
          
          <button onClick={handleToggleTranscription} className={`p-2 rounded-xl transition-all ${isTranscribing ? 'bg-red-500 text-white animate-pulse' : 'text-gray-300 hover:text-amber-500'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>

          <input 
            type="text" value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search intelligence or ask your query..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] md:text-[18px] font-medium dark:text-white placeholder:text-gray-300 outline-none"
          />

          <button onClick={() => handleSend()} disabled={isLoading} className="p-3 md:p-5 bg-[#001040] dark:bg-emerald-500 text-white dark:text-[#001040] rounded-2xl md:rounded-[30px] shadow-lg hover:scale-105 active:scale-95 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M13 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      {isLiveOpen && <LiveAudioSession onClose={() => setIsLiveOpen(false)} />}
    </div>
  );
};
