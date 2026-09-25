import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: "Say hello in one sentence.",
    });

    console.log("SUCCESS:");
    console.log(response.text);
  } catch (error) {
    console.log("GEMINI TEST FAILED");
    console.log("STATUS:", error?.status);
    console.log("ERROR:", error?.message);
  }
}

test();