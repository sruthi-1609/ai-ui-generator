import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3.5-flash-lite";

export async function generateWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return response.text;
}