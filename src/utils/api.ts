// src/utils/api.ts
// Central API helper: base URL, auth header, and error parsing
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Returns an object you can spread into fetch headers containing Authorization if token exists.
 */
export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Try to parse error body (JSON or plain text). Always returns an object with .error message.
 * ✅ FIXED: Properly handle response body reading without "already read" error
 */
export async function parseError(res: Response) {
  // ✅ एक ही बार response body को read करें और store करें
  let bodyContent: string | null = null;
  let parsedJson: any = null;

  try {
    // पहले text के रूप में read करें (यह हमेशा काम करता है)
    bodyContent = await res.text();

    // फिर JSON parse करने की कोशिश करें
    if (bodyContent && bodyContent.trim()) {
      try {
        parsedJson = JSON.parse(bodyContent);
      } catch {
        // JSON parsing fail होने पर text ही use करेंगे
        parsedJson = null;
      }
    }
  } catch (error) {
    // अगर text भी नहीं read हो पाया तो status text use करें
    return { error: res.statusText || "Network error" };
  }

  // JSON parsed data से error message निकालें या text return करें
  if (parsedJson && typeof parsedJson === 'object') {
    return {
      error: parsedJson.error || parsedJson.message || bodyContent || res.statusText || "Unknown error"
    };
  }

  return { error: bodyContent || res.statusText || "Unknown error" };
}

/**
 * Generic API request helper with auth
 * ✅ FIXED: Better error handling और response parsing
 */
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await parseError(response);
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    // ✅ Response को properly parse करें
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        // अगर JSON parsing fail हो तो text return करें
        return await response.text();
      }
    } else {
      // Non-JSON responses के लिए text return करें
      return await response.text();
    }
  } catch (fetchError) {
    // Network errors के लिए proper error handling
    if (fetchError instanceof Error) {
      throw fetchError;
    }
    throw new Error("Network request failed");
  }
}

/**
 * Helper function for POST requests
 */
export async function apiPost(url: string, data: any) {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Helper function for PUT requests
 */
export async function apiPut(url: string, data: any) {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Helper function for DELETE requests
 */
export async function apiDelete(url: string) {
  return apiRequest(url, {
    method: 'DELETE',
  });
}