import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return res.status(200).json({
      result: response.text,
    });
  } catch (error) {
    console.error("Generate error:", error);

    return res.status(500).json({
      error: error.message || "Failed to generate website",
    });
  }
}