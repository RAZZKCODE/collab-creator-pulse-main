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
  // ✅ Ek hi baar response body ko read karein aur store karein
  let bodyContent: string | null = null;
  let parsedJson: any = null;

  try {
    // Pehle text ke roop mein read karein (yeh hamesha kaam karta hai)
    bodyContent = await res.text();

    // Fir JSON parse karne ki koshish karein
    if (bodyContent && bodyContent.trim()) {
      try {
        parsedJson = JSON.parse(bodyContent);
      } catch {
        // JSON parsing fail hone par text hi use karenge
        parsedJson = null;
      }
    }
  } catch (error) {
    // Agar text bhi nahi read ho paya to status text use karein
    return { error: res.statusText || "Network error" };
  }

  // JSON parsed data se error message nikaalein ya text return karein
  if (parsedJson && typeof parsedJson === 'object') {
    return {
      error: parsedJson.error || parsedJson.message || bodyContent || res.statusText || "Unknown error"
    };
  }

  return { error: bodyContent || res.statusText || "Unknown error" };
}

/**
 * Generic API request helper with auth
 * ✅ FIXED: Better error handling aur response parsing
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

    // ✅ Response ko properly parse karein
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        // Agar JSON parsing fail ho to text return karein
        return await response.text();
      }
    } else {
      // Non-JSON responses ke liye text return karein
      return await response.text();
    }
  } catch (fetchError) {
    // Network errors ke liye proper error handling
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