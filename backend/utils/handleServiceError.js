/**
 * Maps normalized errors thrown by geminiService/parseGeminiResponse into
 * safe HTTP responses. Never leaks stack traces or internal details.
 */
export function handleServiceError(err, res) {
  const code = err?.code;

  const statusByCode = {
    MISSING_API_KEY: 500,
    INVALID_API_KEY: 401,
    RATE_LIMITED: 429,
    GEMINI_SERVER_ERROR: 502,
    GEMINI_ERROR: 502,
  };

  const status = statusByCode[code] || 500;

  const message =
    err?.message && typeof err.message === "string"
      ? err.message
      : "Something went wrong while talking to the AI service.";

  console.error(`[Gemini error] code=${code || "UNKNOWN"} message=${message}`);

  return res.status(status).json({
    error: message,
  });
}
