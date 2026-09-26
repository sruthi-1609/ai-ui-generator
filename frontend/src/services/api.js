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

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error || "Something went wrong. Please try again."
    );
  }

  return data;
}

export async function generateWebsite(prompt) {
  const data = await apiRequest("/api/generate", {
    prompt,
  });

  try {
    return JSON.parse(data.result);
  } catch (error) {
    throw new Error("The AI returned an invalid website format.");
  }
}

export async function editWebsite(data) {
  const result = await apiRequest("/api/edit", data);

  try {
    return JSON.parse(result.result);
  } catch (error) {
    throw new Error("The AI returned an invalid edited website format.");
  }
}

export async function reviewWebsite(data) {
  const result = await apiRequest("/api/review", data);

  try {
    return JSON.parse(result.result);
  } catch (error) {
    throw new Error("The AI returned an invalid review format.");
  }
}

export async function fixWebsite(data) {
  const result = await apiRequest("/api/fix", data);

  try {
    return JSON.parse(result.result);
  } catch (error) {
    throw new Error("The AI returned an invalid fixed website format.");
  }
}