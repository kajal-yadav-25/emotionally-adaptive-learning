// Configure your Node.js API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiCall<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
}

// Auth API helpers
export const authApi = {
  signUp: (email: string, password: string, displayName?: string) =>
    apiCall('/auth/signup', { method: 'POST', body: { email, password, displayName } }),

  signIn: (email: string, password: string) =>
    apiCall<{ token: string; user: any }>('/auth/login', { method: 'POST', body: { email, password } }),

  signOut: () => apiCall('/auth/logout', { method: 'POST' }),

  getMe: () => apiCall<{ user: any }>('/auth/me'),
};




// Learning path API helpers (for future use)
export const learningApi = {
  createPath: (data: any) => apiCall('/learning-paths', { method: 'POST', body: data }),
  getPaths: () => apiCall('/learning-paths'),
  getPath: (id: string) => apiCall(`/learning-paths/${id}`),
  deletePath: (id: string) => apiCall(`/learning-paths/${id}`, { method: 'DELETE' }),
  completeModule: (pathId: string, moduleData: any) =>
    apiCall(`/learning-paths/${pathId}/modules/complete`, { method: 'POST', body: moduleData }),
};
