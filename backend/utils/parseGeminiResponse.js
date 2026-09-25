/**
 * Safely extracts a JSON object with { html, css, javascript } keys
 * out of raw text returned by Gemini.
 *
 * Gemini sometimes wraps JSON in markdown code fences (```json ... ```),
 * sometimes adds a preamble/postamble, and sometimes returns keys with
 * different casing. This function tries hard to normalize all of that.
 */

/**
 * Strip ```json ... ``` or ``` ... ``` fences from a string.
 */
function stripCodeFences(text) {
  if (typeof text !== "string") return text;
  let cleaned = text.trim();

  // Remove a leading ```json or ``` fence
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  // Remove a trailing ``` fence
  cleaned = cleaned.replace(/\s*```$/i, "");

  return cleaned.trim();
}

/**
 * Attempt to find the first balanced {...} block in a string.
 * Used as a fallback when the model adds extra prose around the JSON.
 */
function extractFirstJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth++;
    if (char === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Normalize key casing so { HTML, Css, JS } etc. all map correctly.
 */
function normalizeKeys(obj) {
  const result = {};
  const keyMap = {
    html: "html",
    css: "css",
    javascript: "javascript",
    js: "javascript",
    script: "javascript",
  };

  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = keyMap[key.toLowerCase()];
    if (normalizedKey) {
      result[normalizedKey] = typeof value === "string" ? value : "";
    }
  }

  return result;
}

/**
 * Main export. Throws an Error with a user-safe message if parsing fails
 * or required fields are missing.
 */
export function parseGeminiCodeResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response from Gemini API.");
  }

  const cleaned = stripCodeFences(rawText);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    // Fallback: try to locate a JSON object anywhere in the text
    const extracted = extractFirstJsonObject(cleaned);
    if (!extracted) {
      throw new Error("Gemini returned a response that could not be parsed as JSON.");
    }
    try {
      parsed = JSON.parse(extracted);
    } catch (err2) {
      throw new Error("Gemini returned malformed JSON.");
    }
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Gemini response was not a JSON object.");
  }

  const normalized = normalizeKeys(parsed);

  const missing = ["html", "css", "javascript"].filter(
    (key) => typeof normalized[key] !== "string"
  );

  if (missing.length > 0) {
    throw new Error(
      `Gemini response is missing required field(s): ${missing.join(", ")}.`
    );
  }

  return {
    html: normalized.html,
    css: normalized.css,
    javascript: normalized.javascript,
  };
}

/**
 * Parses a Gemini review response into { status, issues }.
 */
export function parseGeminiReviewResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response from Gemini API.");
  }

  const cleaned = stripCodeFences(rawText);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    const extracted = extractFirstJsonObject(cleaned);
    if (!extracted) {
      throw new Error("Gemini returned a review response that could not be parsed as JSON.");
    }
    try {
      parsed = JSON.parse(extracted);
    } catch (err2) {
      throw new Error("Gemini returned malformed review JSON.");
    }
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Gemini review response was not a JSON object.");
  }

  const status = parsed.status === "clean" ? "clean" : "issues";
  const issues = Array.isArray(parsed.issues) ? parsed.issues : [];

  const normalizedIssues = issues.map((issue) => ({
    severity: ["low", "medium", "high"].includes(issue.severity)
      ? issue.severity
      : "medium",
    file: typeof issue.file === "string" ? issue.file : "unknown",
    description:
      typeof issue.description === "string" ? issue.description : "No description provided.",
    suggestion:
      typeof issue.suggestion === "string" ? issue.suggestion : "No suggestion provided.",
  }));

  return { status, issues: normalizedIssues };
}
