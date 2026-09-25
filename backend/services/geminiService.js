import { GoogleGenAI } from "@google/genai";
import {
  parseGeminiCodeResponse,
  parseGeminiReviewResponse,
} from "../utils/parseGeminiResponse.js";

const MODEL_NAME = "gemini-3.5-flash-lite";
let genAI = null;

/**
 * Lazily create the GoogleGenerativeAI client so that a missing API key
 * doesn't crash the server at boot — it only fails the specific request.
 */
function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    const err = new Error(
      "Gemini API key is not configured on the server. Add GEMINI_API_KEY to backend/.env."
    );
    err.code = "MISSING_API_KEY";
    throw err;
  }

 if (!genAI) {
  genAI = new GoogleGenAI({
    apiKey: apiKey,
  });
}

return genAI;
}

/**
 * Wraps a Gemini call and converts SDK-level failures into normalized,
 * user-safe errors with a `code` so routes can pick the right HTTP status.
 */
async function callGemini(prompt) {
  const client = getClient();
  try {
  let result;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      result = await client.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      break;
    } catch (err) {
      const status = err?.status || err?.response?.status;

      if (status !== 503 || attempt === 3) {
        throw err;
      }

      console.log(`Gemini busy. Retrying (${attempt}/3)...`);

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 3000)
      );
    }
  }

  return result.text;
  } catch (err) {
    const message = err?.message || "";
    const status = err?.status || err?.response?.status;
    console.error("FULL GEMINI ERROR:", err);
console.error("STATUS:", status);
console.error("MESSAGE:", message);

    const normalized = new Error(message || "Gemini API request failed.");

    if (status === 400 && /API key not valid/i.test(message)) {
      normalized.code = "INVALID_API_KEY";
      normalized.message = "The configured Gemini API key is invalid.";
    } else if (status === 429 || /quota|rate limit/i.test(message)) {
      normalized.code = "RATE_LIMITED";
      normalized.message = "Gemini API rate limit reached. Please try again shortly.";
    } else if (status === 403) {
      normalized.code = "INVALID_API_KEY";
      normalized.message = "The Gemini API key is not authorized for this request.";
    } else if (status >= 500) {
      normalized.code = "GEMINI_SERVER_ERROR";
      normalized.message = "Gemini API is currently unavailable. Please try again.";
    } else {
      normalized.code = "GEMINI_ERROR";
    }

    throw normalized;
  }
}

const CODE_JSON_INSTRUCTIONS = `
You must respond with ONLY a raw JSON object (no markdown fences, no commentary) with EXACTLY these three string keys:
{
  "html": "<!-- full HTML body content, no <html>/<head>/<body> wrapper needed -->",
  "css": "/* full CSS styles */",
  "javascript": "// full JavaScript code"
}
Rules:
- Do not wrap the JSON in markdown code fences.
- Do not include any explanation before or after the JSON.
- Escape any special characters properly so the result is valid JSON.
- The html, css, and javascript values must always be present as strings, even if empty ("").
`;

export async function generateWebsite(prompt) {
  const fullPrompt = `You are an expert frontend web developer. Generate a complete, modern, responsive website based on this request:

"${prompt}"

Use clean semantic HTML, modern CSS (flexbox/grid, good typography, a cohesive color palette), and vanilla JavaScript for any interactivity. Do not use any external libraries or frameworks (no React, no Tailwind CDN, no jQuery).

${CODE_JSON_INSTRUCTIONS}`;

  const raw = await callGemini(fullPrompt);
  return parseGeminiCodeResponse(raw);
}

export async function editWebsite({ instruction, html, css, javascript }) {
  const fullPrompt = `You are an expert frontend web developer. Here is the CURRENT website code:

HTML:
${html}

CSS:
${css}

JavaScript:
${javascript}

The user wants this change applied:
"${instruction}"

Modify the code to apply the requested change while preserving everything else that already works. Return the FULL updated website code (not just the diff).

${CODE_JSON_INSTRUCTIONS}`;

  const raw = await callGemini(fullPrompt);
  return parseGeminiCodeResponse(raw);
}

export async function reviewWebsite({ html, css, javascript }) {
  const fullPrompt = `You are a senior frontend code reviewer. Review the following website code for problems.

HTML:
${html}

CSS:
${css}

JavaScript:
${javascript}

Check for:
- HTML problems (invalid structure, missing tags, bad semantics)
- CSS problems (layout bugs, unused/conflicting rules, poor responsiveness)
- JavaScript problems (bugs, errors, bad practices)
- Missing elements a real site of this kind would need
- Accessibility problems (missing alt text, poor contrast, missing labels, no keyboard support)
- Responsive design problems (fixed widths, missing media queries, overflow issues)

Respond with ONLY a raw JSON object (no markdown fences, no commentary) in EXACTLY this shape:
{
  "status": "issues" or "clean",
  "issues": [
    {
      "severity": "low" | "medium" | "high",
      "file": "index.html" | "style.css" | "script.js",
      "description": "short description of the problem",
      "suggestion": "short actionable suggestion to fix it"
    }
  ]
}
If there are no problems, return "status": "clean" and "issues": [].`;

  const raw = await callGemini(fullPrompt);
  return parseGeminiReviewResponse(raw);
}

export async function fixWebsite({ html, css, javascript, issues }) {
  const issuesText = (issues || [])
    .map(
      (issue, i) =>
        `${i + 1}. [${issue.severity || "medium"}] (${issue.file || "unknown"}) ${
          issue.description || ""
        } -- Suggested fix: ${issue.suggestion || ""}`
    )
    .join("\n");

  const fullPrompt = `You are an expert frontend web developer. Here is the CURRENT website code:

HTML:
${html}

CSS:
${css}

JavaScript:
${javascript}

The following issues were found during review and must be fixed:
${issuesText || "No specific issues listed — do a general quality pass."}

Fix all of these issues while preserving the overall design and functionality. Return the FULL corrected website code.

${CODE_JSON_INSTRUCTIONS}`;

  const raw = await callGemini(fullPrompt);
  return parseGeminiCodeResponse(raw);
}
