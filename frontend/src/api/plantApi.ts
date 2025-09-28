const apiBaseEnv = (import.meta as any).env?.VITE_API_BASE_URL;
const DEFAULT_DEV_BASE = "/api";
const PRODUCTION_BASE = "https://albedo-alpha.vercel.app";
const LOCAL_FALLBACK_BASE = "http://localhost:3000";

// Important: when developing on Vite (5173), prefer direct backend to preserve session cookies
const API_BASE = apiBaseEnv
  ? `${apiBaseEnv}/api`
  : (typeof window !== 'undefined' && window.location && window.location.port === '5173')
    ? `${LOCAL_FALLBACK_BASE}/api`
    : `${PRODUCTION_BASE}/api`;

export interface Plant {
  _id: string;
  name: string;
}

const defaultHeaders = (clientId?: string) => ({
  'Content-Type': 'application/json',
  ...(clientId ? { 'X-Client-Id': clientId } : {})
});

async function fetchWithFallback(path: string, init?: RequestInit) {
  const primaryUrl = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  // Always include credentials so session cookie is sent
  const baseInit: RequestInit = { credentials: 'include' };
  let res = await fetch(primaryUrl, { ...baseInit, ...init });
  // If running on 5173 without proxy forwarding, retry directly to localhost:3000
  if (res.status === 404 && API_BASE === DEFAULT_DEV_BASE) {
    const fallbackUrl = `${LOCAL_FALLBACK_BASE}/api${path.startsWith('/') ? '' : '/'}${path}`;
    res = await fetch(fallbackUrl, { ...baseInit, ...init });
  }
  return res;
}

export async function getPlants() {
  const res = await fetchWithFallback('/plants');
  if (!res.ok) {
    throw new Error("Failed to fetch plants");
  }
  return res.json();
}

export async function readClientState(clientId?: string) {
  const res = await fetchWithFallback('/state', { headers: defaultHeaders(clientId) });
  if (!res.ok) throw new Error('Failed to read state');
  return res.json();
}

export async function saveClientState(state: any, clientId?: string) {
  const res = await fetchWithFallback('/state', {
    method: 'POST',
    headers: defaultHeaders(clientId),
    body: JSON.stringify(state)
  });
  if (!res.ok) throw new Error('Failed to save state');
  return res.json();
}

export async function addMemoryEvent(type: string, details?: string, clientId?: string) {
  const res = await fetchWithFallback('/memory', {
    method: 'POST',
    headers: defaultHeaders(clientId),
    body: JSON.stringify({ type, details })
  });
  if (!res.ok) throw new Error('Failed to add memory');
  return res.json();
}

export async function getAchievements(clientId?: string) {
  const res = await fetchWithFallback('/achievements', { headers: defaultHeaders(clientId) });
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

export async function addAchievement(id: string, name: string, description?: string, clientId?: string) {
  const res = await fetchWithFallback('/achievements', {
    method: 'POST',
    headers: defaultHeaders(clientId),
    body: JSON.stringify({ id, name, description })
  });
  if (!res.ok) throw new Error('Failed to add achievement');
  return res.json();
}

export interface PlantInfoPayload {
  plantName: string;
  plantType: string;
  ownerName?: string;
  plantMood?: string;
  plantAge?: string;
  growthStage?: string;
}

export async function askPlantAI(question: string, plantInfo: PlantInfoPayload) {
  const res = await fetchWithFallback('/plantAI', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ question, plantInfo })
  });
  if (!res.ok) {
    let message = 'Failed to get response';
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

// Community API functions
export async function createCommunity(name: string, description?: string) {
  const res = await fetchWithFallback('/community/create', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ name, description })
  });
  if (!res.ok) throw new Error('Failed to create community');
  return res.json();
}

export async function joinCommunity(code: string) {
  const res = await fetchWithFallback('/community/join', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ code })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to join community');
  }
  return res.json();
}

export async function getUserCommunities() {
  // Temporarily use test endpoint
  const res = await fetchWithFallback('/test/my-communities', {
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch communities');
  return res.json();
}

export async function getCommunity(code: string) {
  const res = await fetchWithFallback(`/community/${code}`, {
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch community');
  return res.json();
}

export async function getCurrencyIcons() {
  // Temporarily use test endpoint
  const res = await fetchWithFallback('/test/currency-icons', {
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch currency icons');
  return res.json();
}

export async function getStoreItems() {
  // Temporarily use test endpoint
  const res = await fetchWithFallback('/test/store-items', {
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch store items');
  return res.json();
}

export async function purchaseItem(communityCode: string, category: string, itemId: string) {
  const res = await fetchWithFallback(`/community/${communityCode}/purchase`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ category, itemId })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to purchase item');
  }
  return res.json();
}

export async function updateCurrency(communityCode: string, name: string, icon: string) {
  const res = await fetchWithFallback(`/community/${communityCode}/currency`, {
    method: 'PUT',
    headers: defaultHeaders(),
    body: JSON.stringify({ name, icon })
  });
  if (!res.ok) throw new Error('Failed to update currency');
  return res.json();
}

export async function createDustbin(communityCode: string, location: string, description: string) {
  const res = await fetchWithFallback(`/community/${communityCode}/dustbin`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ location, description })
  });
  if (!res.ok) throw new Error('Failed to create dustbin');
  return res.json();
}

export async function getCommunityDustbins(communityCode: string) {
  const res = await fetchWithFallback(`/community/${communityCode}/dustbins`, {
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch dustbins');
  return res.json();
}

export async function scanDustbin(dustbinId: string) {
  const res = await fetchWithFallback(`/dustbin/${dustbinId}/scan`, {
    method: 'POST',
    headers: defaultHeaders()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to scan dustbin');
  }
  return res.json();
}

export async function getLeaderboard(communityCode: string) {
  const res = await fetchWithFallback(`/community/${communityCode}/leaderboard`, {
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function addCommunityEvent(communityCode: string, title: string, description: string, date: string) {
  const res = await fetchWithFallback(`/community/${communityCode}/event`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ title, description, date })
  });
  if (!res.ok) throw new Error('Failed to add event');
  return res.json();
}

export async function addCustomTask(communityCode: string, title: string, description: string, reward: number) {
  const res = await fetchWithFallback(`/community/${communityCode}/task`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ title, description, reward })
  });
  if (!res.ok) throw new Error('Failed to add task');
  return res.json();
}
