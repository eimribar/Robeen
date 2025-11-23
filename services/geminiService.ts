import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { LiveServerMessage } from "@google/genai";
import { createPcmBlob, base64ToUint8Array } from '../utils/audioUtils';
import { CryAnalysisResult } from '../types';

// Helper to get a fresh AI client instance
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Retry utility for handling Quota (429) and Server (503) errors
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 2000
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Don't retry if the model is not found (404)
    if (error?.status === 404 || error?.message?.includes('not found')) {
      throw error;
    }

    const isQuotaError = error?.status === 429 || error?.message?.includes('429') || error?.message?.toLowerCase().includes('exhausted');
    const isServerBusy = error?.status === 503;
    
    if (retries > 0 && (isQuotaError || isServerBusy)) {
      console.warn(`Robeen busy, retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

// --- Video Analysis ---
export const analyzeCryVideo = async (
  videoBase64: string,
  mimeType: string,
  babyName: string = "the baby",
  gender: string = "baby"
): Promise<CryAnalysisResult> => {
  return retryWithBackoff(async () => {
    const ai = getAiClient();
    const prompt = `
      Analyze this video of ${babyName} crying. 
      Identify the likely cause of the cry (Hunger, Tiredness, Pain/Gas, Overstimulation, Diaper).
      Provide actionable, step-by-step soothing techniques.
      Return a strictly formatted JSON response.
      Refer to the baby as "${babyName}" in the context and advice.
      The baby is a ${gender}, so please use appropriate pronouns (he/him for boy, she/her for girl) when referring to ${babyName}.
    `;

    // Schema for structured output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        primaryReason: { type: Type.STRING, description: "The most likely reason for crying" },
        confidenceScore: { type: Type.NUMBER, description: "Confidence level 0-100" },
        emotionalState: { type: Type.STRING, description: "Description of the baby's state (e.g., Frantic, Whining)" },
        actionableSteps: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of 3-5 immediate steps for the parent to take"
        },
        medicalDisclaimer: { type: Type.STRING, description: "Standard medical disclaimer if signs of illness are present" },
        analysisContext: { 
          type: Type.STRING, 
          description: "A brief, natural language explanation (max 2 sentences) of why the AI assigned these probabilities." 
        },
        chartData: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER }
            }
          },
          description: "Data for a chart showing probability of different causes (must sum to 100)"
        }
      },
      required: ["primaryReason", "actionableSteps", "chartData", "analysisContext"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: videoBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as CryAnalysisResult;
    }
    throw new Error("No response text generated");
  });
};

// --- Quick Tips ---
export const getQuickTips = async (): Promise<string> => {
  return retryWithBackoff(async () => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Give me 3 universal, safe, and quick tips for soothing a crying baby immediately while I wait for detailed analysis. Keep it under 50 words.",
    });
    return response.text || "Try swaddling, gentle rocking, or checking the diaper.";
  });
};

// --- Chat with Search Grounding ---
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const sendChatMessage = async (
  message: string, 
  history: ChatMessage[],
  systemContext: string = ""
): Promise<{ text: string; sources?: any[] }> => {
  return retryWithBackoff(async () => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Optimized for low latency
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        tools: [{ googleSearch: {} }], // Search Grounding
        systemInstruction: `You are Robeen, a specialized pediatric and parenting assistant. ${systemContext} You MUST ONLY answer questions related to parenting, babies, and children. If asked about unrelated topics, politely decline. Always be proactive: after providing an answer, immediately suggest relevant follow-up questions or specific additional tips.`,
      }
    });

    const text = response.text || "I'm sorry, I couldn't generate a response.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return { text, sources };
  });
};

// --- Streaming Text to Speech ---

/**
 * Eagerly starts the TTS generation. 
 * Returns a Promise that resolves to an async generator yielding raw audio bytes.
 */
export const preloadTTS = async (text: string): Promise<AsyncGenerator<Uint8Array>> => {
  const ai = getAiClient();
  
  // Start the request immediately
  const responsePromise = ai.models.generateContentStream({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Calming voice
        },
      },
    },
  });

  async function* generator() {
    const responseStream = await responsePromise;
    for await (const chunk of responseStream) {
      const base64Audio = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        yield base64ToUint8Array(base64Audio);
      }
    }
  }

  return generator();
};

// --- Live API Connect ---
export const connectLiveParams = (
  callbacks: {
    onOpen: () => void,
    onMessage: (msg: LiveServerMessage) => void,
    onClose: () => void,
    onError: (err: any) => void
  },
  systemInstruction: string = "You are Robeen, a specialized parenting coach. You MUST ONLY discuss parenting, babies, and children. Politely refuse other topics. Be proactive: after giving advice, always suggest a related tip or ask a follow-up question. Keep responses concise, calm, and empathetic."
) => {
    return {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: callbacks.onOpen,
            onmessage: callbacks.onMessage,
            onclose: callbacks.onClose,
            onerror: callbacks.onError,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: systemInstruction,
        }
    };
};

export const getLiveClient = () => {
  const ai = getAiClient();
  return ai.live;
};
