export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  detail?: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  status: number;
  detail?: any;

  constructor(message: string, status: number, detail?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || (result && result.success === false)) {
      const message = result?.message || result?.detail || `API request failed with status ${response.status}`;
      throw new ApiError(message, response.status, result?.detail);
    }

    return (result && 'data' in result ? result.data : result) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      (error as Error).message || 'Failed to connect to StudyWise backend server.',
      0
    );
  }
}

export default apiClient;
