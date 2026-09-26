const API_BASE_URL = "";

async function apiRequest(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      "Unable to reach the backend server. Please try again."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Something went wrong. Please try again."
    );
  }

  return data;
}

export function generateWebsite(prompt) {
  return apiRequest("/api/generate", { prompt });
}

export function editWebsite(data) {
  return apiRequest("/api/edit", data);
}

export function reviewWebsite(data) {
  return apiRequest("/api/review", data);
}

export function fixWebsite(data) {
  return apiRequest("/api/fix", data);
}