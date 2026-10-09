const BASE_URL = (import.meta.env.VITE_API_URL || 'https://tech-test-backend.dwsbrazil.io').replace(/\/$/, '');

export class ApiError extends Error {
  public status?: number;

  constructor(
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new ApiError('Network error. Please check your connection.');
  }

  if (!response.ok) {
    throw new ApiError(response.status === 404 ? 'Not found' : `Request failed (${response.status})`, response.status);
  }

  return response.json() as Promise<T>;
}
