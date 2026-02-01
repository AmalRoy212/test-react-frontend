const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function getToken() {
  return localStorage.getItem('token');
}

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const auth = {
  register: (email, password) => api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const mailPlans = {
  list: () => api('/mail-plans'),
  get: (id) => api(`/mail-plans/${id}`),
  create: (body) => api('/mail-plans', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/mail-plans/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => api(`/mail-plans/${id}`, { method: 'DELETE' }),
  activate: (id) => api(`/mail-plans/${id}/activate`, { method: 'POST' }),
};
