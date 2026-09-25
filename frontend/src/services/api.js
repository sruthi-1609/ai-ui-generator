const API_BASE_URL = "https://ai-ui-generator-qux4.onrender.com";/**
 * Shared fetch wrapper. Throws an Error with a readable, user-facing
 * message on any failure (network error, non-2xx response, bad JSON).
 */
async function apiRequest(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new Error(
      "Unable to reach the backend server. Make sure it is running on http://localhost:5000."
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (parseErr) {
    throw new Error("The server returned an unexpected response.");
  }

  if (!response.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }

  return data;
}

/**
 * Generate a brand new website from a text prompt.
 * @param {string} prompt
 * @returns {Promise<{html: string, css: string, javascript: string}>}
 */
export function generateWebsite(prompt) {
  return apiRequest("/api/generate", { prompt });
}

/**
 * Edit the current website with a natural-language instruction.
 * @param {{instruction: string, html: string, css: string, javascript: string}} data
 * @returns {Promise<{html: string, css: string, javascript: string}>}
 */
export function editWebsite(data) {
  return apiRequest("/api/edit", data);
}

/**
 * Run an AI code review over the current website code.
 * @param {{html: string, css: string, javascript: string}} data
 * @returns {Promise<{status: "clean"|"issues", issues: Array}>}
 */
export function reviewWebsite(data) {
  return apiRequest("/api/review", data);
}

/**
 * Ask the AI to fix a specific set of review issues.
 * @param {{html: string, css: string, javascript: string, issues: Array}} data
 * @returns {Promise<{html: string, css: string, javascript: string}>}
 */
export function fixWebsite(data) {
  return apiRequest("/api/fix", data);
}
