const BASE = '/api';

let authToken = localStorage.getItem('gruas_token');

export function setToken(token) {
  authToken = token;
  if (token) localStorage.setItem('gruas_token', token);
  else localStorage.removeItem('gruas_token');
}

export function getToken() {
  return authToken;
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      setToken(null);
      window.location.href = '/';
    }
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Auth ─────────────────────────────────────────────────────
export const auth = {
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (data) => request('POST', '/auth/register', data),
  me: () => request('GET', '/auth/me'),
  updateProfile: (data) => request('PUT', '/auth/profile', data),
  bypassKyc: () => request('POST', '/auth/bypass-kyc'),
  kycUpload: (idDocument, licenseDoc) => request('POST', '/auth/kyc-upload', { idDocument, licenseDoc }),
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await fetch(`${BASE}/auth/profile/avatar`, { method: 'POST', headers, body: formData });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  },
};

// ── Jobs ─────────────────────────────────────────────────────
export const jobs = {
  create: (data) => request('POST', '/jobs', data),
  my: (status) => request('GET', `/jobs/my${status ? `?status=${status}` : ''}`),
  get: (id) => request('GET', `/jobs/${id}`),
  cancel: (id) => request('PUT', `/jobs/${id}/cancel`),
  rate: (id, rating, review) => request('PUT', `/jobs/${id}/rate`, { rating, review }),
  available: () => request('GET', '/jobs/available'),
  accept: (id) => request('PUT', `/jobs/${id}/accept`),
  updateStatus: (id, status) => request('PUT', `/jobs/${id}/status`, { status }),
  proposePrice: (id, amount) => request('POST', `/jobs/${id}/propose-price`, { amount }),
  getChat: (id) => request('GET', `/jobs/${id}/chat`),
  sendChatMessage: (id, message) => request('POST', `/jobs/${id}/chat`, { message }),
  nearbyDrivers: (lat, lng) => request('GET', `/jobs/nearby-drivers?lat=${lat}&lng=${lng}`),
};

// ── Drivers ──────────────────────────────────────────────────
export const drivers = {
  profile: () => request('GET', '/drivers/profile'),
  activeJob: () => request('GET', '/drivers/active-job'),
  updateLocation: (lat, lng) => request('PUT', '/drivers/location', { latitude: lat, longitude: lng }),
  setAvailability: (available) => request('PUT', '/drivers/availability', { available }),
  earnings: () => request('GET', '/drivers/earnings'),
  ratings: () => request('GET', '/drivers/ratings'),
  history: () => request('GET', '/drivers/history'),
  getPayouts: () => request('GET', '/drivers/payouts'),
  requestPayout: (amount) => request('POST', '/drivers/payout', { amount }),
};

// ── Payments ─────────────────────────────────────────────────
export const payments = {
  my: () => request('GET', '/payments/my'),
  getMethods: () => request('GET', '/payments/methods'),
  addMethod: (data) => request('POST', '/payments/methods', data),
  removeMethod: (id) => request('DELETE', `/payments/methods/${id}`),
};

// ── Notifications ────────────────────────────────────────────
export const notifications = {
  list: () => request('GET', '/notifications'),
  markRead: (id) => request('PUT', `/notifications/${id}/read`),
  markAllRead: () => request('PUT', `/notifications/read-all`),
};

// ── Admin ────────────────────────────────────────────────────
export const admin = {
  dashboard: () => request('GET', '/admin/dashboard'),
  jobs: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/admin/jobs${qs ? `?${qs}` : ''}`);
  },
  drivers: () => request('GET', '/admin/drivers'),
  users: (search) => request('GET', `/admin/users${search ? `?search=${search}` : ''}`),
  updateUserStatus: (id, status) => request('PUT', `/admin/users/${id}/status`, { status }),
  updateDriverAvailability: (id, available) => request('PUT', `/admin/drivers/${id}/availability`, { available }),
  updateKycStatus: (id, kycStatus) => request('PUT', `/admin/drivers/${id}/kyc`, { kycStatus }),
  payments: () => request('GET', '/admin/payments'),
  analytics: () => request('GET', '/admin/analytics'),
  settings: () => request('GET', '/admin/settings'),
  updateSettings: (data) => request('PUT', '/admin/settings', data),
  cancelJob: (id) => request('PUT', `/admin/jobs/${id}/cancel`),
  createJob: (data) => request('POST', '/admin/jobs', data),
  assignJob: (id, driverId) => request('PUT', `/admin/jobs/${id}/assign`, { driverId }),
  getPayouts: () => request('GET', '/admin/payouts'),
  processPayout: (id) => request('PUT', `/admin/payouts/${id}/process`),
};

// ── Stripe ───────────────────────────────────────────────────
export const stripe = {
  createSubscriptionCheckout: (plan) => request('POST', '/stripe/create-subscription-checkout', { plan }),
  createJobCheckout: (jobId) => request('POST', '/stripe/create-job-checkout', { jobId }),
  connectAccount: () => request('POST', '/stripe/connect'),
  checkConnectStatus: () => request('GET', '/stripe/connect/status'),
  // DEV BYPASS ROUTES
  bypassSubscription: (plan) => request('POST', '/stripe/bypass-subscription', { plan }),
  bypassJobPayment: (jobId) => request('POST', '/stripe/bypass-job-payment', { jobId }),
};

// ── Pricing ──────────────────────────────────────────────────
export const pricing = {
  getQuote: (params) => {
    const qs = new URLSearchParams({ ...params, _: Date.now() }).toString();
    return request('GET', `/pricing/quote?${qs}`);
  },
  geocode: (query) => request('GET', `/pricing/geocode?q=${encodeURIComponent(query)}&_=${Date.now()}`)
};
