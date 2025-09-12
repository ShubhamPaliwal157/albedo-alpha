const API_BASE = "/api"; // proxy will forward this to backend

export interface Plant {
  _id: string;
  name: string;
}

export async function getPlants() {
  const res = await fetch(`${API_BASE}/plants`);
  if (!res.ok) {
    throw new Error("Failed to fetch plants");
  }
  return res.json();
}
