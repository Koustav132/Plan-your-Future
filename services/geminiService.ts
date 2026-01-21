
import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, UserData } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Removes Markdown symbols to ensure a clean, institutional plain-text output.
 */
const sanitizeOutput = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[*#_~`|>]/g, "")
    .replace(/(\r\n|\n|\r){3,}/g, "\n\n")
    .trim();
};

export const getGeminiProResponse = async (
  messages: Message[],
  userData?: UserData,
  fileData?: { data: string; mimeType: string },
  language: string = "English"
) => {
  const ai = getAI();
  const userContext = userData 
    ? "User Context: Name: " + userData.name + ", Risk Index: " + userData.riskScore + "/60, Total Assets: ₹" + userData.portfolioValue.toLocaleString() + "."
    : "Anonymous Guest Session.";

  const history = messages.slice(-8).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const lastMsg = messages[messages.length - 1];
  const currentParts: any[] = [{ text: lastMsg.content }];

  let documentPrompt = "";
  if (fileData) {
    currentParts.push({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data.split(",")[1]
      }
    });
    
    documentPrompt = `
    INSTRUCTIONS FOR DOCUMENT ANALYSIS:
    The user has provided an institutional document or ledger image. 
    1. PERFORM DESCRIPTIVE ANALYSIS: Extract all key facts, numerical values, and dates from the document.
    2. PERFORM PREDICTIVE ANALYSIS: Based on the extracted data and the user's risk profile, provide logical forecasts or strategic implications.
    3. Use professional, plain text only. Avoid formatting symbols.
    `;
  }

  const languageInstruction = `CRITICAL: The user prefers to communicate in ${language}. 
  Please respond ONLY in ${language}. Maintain the Professional Guruji persona.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Switched to Flash for maximum speed
    contents: [
      ...history.slice(0, -1),
      { role: "user", parts: currentParts }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\n\n" + languageInstruction + "\n\n" + documentPrompt + "\n\nACTIVE SESSION DATA:\n" + userContext,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lowest latency
      temperature: 0.1
    }
  });

  const rawText = response.text || "I am currently processing deep market signals. Please rephrase or try again in a moment. 🦅";
  
  // Extract grounding metadata safely
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  return {
    text: sanitizeOutput(rawText),
    grounding: grounding
  };
};

/**
 * Fetches a market update using Google Search grounding.
 */
export const getMarketUpdate = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Switched to Flash for maximum speed
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\n\nProvide a high-level institutional market summary and strategic update based on current data.",
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lowest latency
      temperature: 0.1
    }
  });

  return {
    text: sanitizeOutput(response.text || "Institutional market data is currently unavailable. 🦅")
  };
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: sanitizeOutput(text) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { 
            prebuiltVoiceConfig: { voiceName: "Puck" }
          }
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (err) {
    console.error("Audio synthesis failed", err);
    return null;
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Accurately transcribe the user's financial query. Return only the transcription text." },
            { inlineData: { data: base64Audio, mimeType: mimeType } }
          ]
        }
      ]
    });
    return response.text?.trim() || "";
  } catch (err) {
    console.error("Transcription service error", err);
    return "";
  }
};
