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

// Generate UI from a prompt
export async function generateUI(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    return await handleResponse(response);
  } catch (networkErr) {
    if (networkErr instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw networkErr;
  }
}

// Edit existing UI
export async function editUI(code, instruction) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        instruction,
      }),
    });

    return await handleResponse(response);
  } catch (networkErr) {
    if (networkErr instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw networkErr;
  }
}

// Review UI/code
export async function reviewUI(code) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    return await handleResponse(response);
  } catch (networkErr) {
    if (networkErr instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw networkErr;
  }
}

// Fix UI/code
export async function fixUI(code, issue) {
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
  } catch (networkErr) {
    if (networkErr instanceof TypeError) {
      throw new Error(
        "Unable to reach the backend server. Please try again."
      );
    }

    throw networkErr;
  }
}

export { API_BASE_URL };