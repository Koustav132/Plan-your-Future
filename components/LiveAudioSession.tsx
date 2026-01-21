
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Button } from './Button';
import { SYSTEM_INSTRUCTION } from '../constants';

// Manual base64 encode/decode for PCM as per instructions
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
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

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const LiveAudioSession: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Establishing connection...');
  
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    startSession();
    return () => {
      stopSession();
    };
  }, []);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      
      inputCtxRef.current = new AudioCtxClass({ sampleRate: 16000 });
      outputCtxRef.current = new AudioCtxClass({ sampleRate: 24000 });
      
      // Auto-resume contexts (required for browsers)
      if (inputCtxRef.current.state === 'suspended') await inputCtxRef.current.resume();
      if (outputCtxRef.current.state === 'suspended') await outputCtxRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Eagle-Eye Audio Active 🦅');
            setIsActive(true);
            
            // Start streaming from mic to model
            if (inputCtxRef.current) {
              const source = inputCtxRef.current.createMediaStreamSource(stream);
              const scriptProcessor = inputCtxRef.current.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtxRef.current.destination);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioStr = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioStr && outputCtxRef.current) {
              const ctx = outputCtxRef.current;
              // Ensure output context is ready
              if (ctx.state === 'suspended') await ctx.resume();

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(audioStr), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.onended = () => {
                sourcesRef.current.delete(source);
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live session error", e);
            setStatus('Communication error. Check mic.');
          },
          onclose: () => onClose()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION + "\n\nProvide world-class real-time guidance via audio conversation.",
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: 'Puck' } 
            } 
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Access denied. Mic required.');
    }
  };

  const stopSession = () => {
    sessionPromiseRef.current?.then(s => {
      try { s.close(); } catch(e) {}
    });
    inputCtxRef.current?.close();
    outputCtxRef.current?.close();
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
  };

  return (
    <div className="fixed inset-0 bg-[#001040]/98 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-amber-500 rounded-full flex items-center justify-center animate-pulse mb-8 shadow-2xl border-4 border-white/10">
        <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 tracking-tight">Guruji Live <span className="text-emerald-500">Session</span></h2>
      <p className="text-blue-200 mb-10 text-sm font-medium tracking-wide px-4">{status}</p>
      
      <div className="flex flex-col items-center space-y-8 w-full max-w-xs">
        <div className="flex space-x-2 items-end h-12">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-amber-400 rounded-full animate-bounce" 
              style={{ 
                height: `${15 + Math.random() * 30}px`,
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
        
        <button 
          onClick={onClose} 
          className="w-full py-4 bg-white text-[#001040] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-amber-500 hover:text-white transition-all transform active:scale-95 text-[10px]"
        >
          End Consultation 🦅
        </button>
      </div>
      
      <div className="absolute bottom-8 opacity-40">
        <p className="text-[8px] text-white font-black uppercase tracking-[0.4em]">Secure Vision Gateway Active</p>
      </div>
    </div>
  );
};
