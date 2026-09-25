import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const pager = await ai.models.list();

    console.log("AVAILABLE MODELS:");

    for await (const model of pager) {
      console.log(
        model.name,
        "|",
        model.supportedActions || ""
      );
    }
  } catch (error) {
    console.log("MODEL LIST FAILED");
    console.log("STATUS:", error?.status);
    console.log("ERROR:", error?.message);
  }
}

test();