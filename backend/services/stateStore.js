const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

// Vercel serverless is read-only. Use in-memory store in production or when FS writes fail.
const USE_MEMORY = process.env.NODE_ENV === 'production' || process.env.USE_MEMORY_STORE === 'true';
let memoryDB = {};

function ensureStore() {
  if (USE_MEMORY) return; // skip FS operations in serverless
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(STATE_FILE)) fs.writeFileSync(STATE_FILE, JSON.stringify({}), 'utf-8');
}

function readAll() {
  if (USE_MEMORY) return memoryDB;
  ensureStore();
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  if (USE_MEMORY) {
    memoryDB = data;
    return;
  }
  ensureStore();
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // If FS write fails (e.g., read-only), fall back to memory
    memoryDB = data;
  }
}

function getClient(clientId) {
  const db = readAll();
  return db[clientId] || { state: {}, memories: [], chats: [], achievements: [] };
}

function saveClient(clientId, clientData) {
  const db = readAll();
  db[clientId] = clientData;
  writeAll(db);
}

module.exports = {
  getState(clientId) {
    const c = getClient(clientId);
    return c.state || {};
  },
  saveState(clientId, state) {
    const c = getClient(clientId);
    c.state = { ...(c.state || {}), ...state };
    saveClient(clientId, c);
    return c.state;
  },
  addMemory(clientId, memory) {
    const c = getClient(clientId);
    c.memories = [memory, ...(c.memories || [])].slice(0, 100);
    saveClient(clientId, c);
    return c.memories;
  },
  getMemories(clientId) {
    const c = getClient(clientId);
    return c.memories || [];
  },
  addChat(clientId, chat) {
    const c = getClient(clientId);
    c.chats = [chat, ...(c.chats || [])].slice(0, 50);
    saveClient(clientId, c);
    return c.chats;
  },
  getChats(clientId) {
    const c = getClient(clientId);
    return c.chats || [];
  },
  getAchievements(clientId) {
    const c = getClient(clientId);
    return c.achievements || [];
  },
  addAchievement(clientId, achievement) {
    const c = getClient(clientId);
    const exists = (c.achievements || []).some(a => a.id === achievement.id);
    if (!exists) {
      c.achievements = [{ ...achievement, timestamp: Date.now() }, ...(c.achievements || [])].slice(0, 100);
      saveClient(clientId, c);
    }
    return c.achievements;
  },
  summarizeMemories(clientId) {
    const memories = this.getMemories(clientId);
    const crucial = memories.filter(m => ['purchase', 'achievement', 'milestone'].includes(m.type)).slice(0, 10);
    return crucial.map(m => `${m.type}: ${m.details}`).join('; ');
  },
  recentChats(clientId, limit = 5) {
    const chats = this.getChats(clientId);
    return chats.slice(0, limit);
  }
};
