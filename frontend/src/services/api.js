const API_BASE_URL = "https://ai-ui-generator-qux4.onrender.com";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Server error: ${response.status} ${response.statusText}`
    );
  }

  return data;
}

// Generate website
export async function generateWebsite(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw error;
  }
}

// Edit website
export async function editWebsite(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw error;
  }
}

// Review website
export async function reviewWebsite(code) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw error;
  }
}

// Fix website
export async function fixWebsite(code, issue) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        issue,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw error;
  }
}

export { API_BASE_URL };