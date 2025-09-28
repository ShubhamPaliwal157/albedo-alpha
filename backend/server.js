require('dotenv').config();
const express = require('express');
const cors = require('cors');
const plantAI = require('./services/plantAI');
const stateStore = require('./services/stateStore');
const communityService = require('./services/communityService');
const fetch = require('node-fetch');
const cookieSession = require('cookie-session');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const SERVER_BASE = process.env.SERVER_BASE || `http://localhost:${PORT}`;

// Configure allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://albedo-eco.netlify.app',
  'https://albedo-alpha.vercel.app',
  FRONTEND_ORIGIN
].filter(Boolean);

// test
app.get('/', (req, res) => {
  res.send('Albedo Backend is running');
});

// Debug endpoint to check environment variables
app.get('/debug/config', (req, res) => {
  res.json({
    SERVER_BASE: SERVER_BASE,
    FRONTEND_ORIGIN: FRONTEND_ORIGIN,
    NODE_ENV: process.env.NODE_ENV,
    redirect_uri: `${SERVER_BASE}/auth/google/callback`
  });
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'fallback-secret'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  secure: true, // Always true for cross-domain
  sameSite: 'none', // Required for cross-domain cookies
  domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
}));

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

// Google OAuth - start
app.get('/auth/google/start', (req, res) => {
  console.log('🚀 GOOGLE OAUTH START ENDPOINT HIT');
  console.log('Request origin:', req.get('origin'));
  console.log('Request referer:', req.get('referer'));
  console.log('Request headers:', req.headers);
  console.log('SERVER_BASE:', SERVER_BASE);
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
  
  const redirectUri = `${SERVER_BASE}/auth/google/callback`;
  console.log('Redirect URI:', redirectUri);
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account'
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('🔗 Final Google OAuth URL:', url);
  console.log('🚀 Redirecting to Google...');
  
  res.redirect(url);
});

// Google OAuth - callback
app.get('/auth/google/callback', async (req, res) => {
  console.log('🔄 GOOGLE OAUTH CALLBACK HIT');
  console.log('Query params:', req.query);
  console.log('Session before:', req.session);
  
  try {
    const code = req.query.code;
    const error = req.query.error;
    
    if (error) {
      console.log('❌ OAuth error from Google:', error);
      return res.status(400).send(`OAuth error: ${error}`);
    }
    
    if (!code) {
      console.log('❌ Missing authorization code');
      return res.status(400).send('Missing code');
    }

    console.log('✅ Authorization code received:', code.substring(0, 20) + '...');
    
    const tokenRequestBody = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: `${SERVER_BASE}/auth/google/callback`,
      grant_type: 'authorization_code'
    };
    
    console.log('📡 Token exchange request:', {
      ...tokenRequestBody,
      client_secret: tokenRequestBody.client_secret ? 'Present' : 'Missing'
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenRequestBody)
    });
    
    console.log('📡 Token response status:', tokenRes.status, tokenRes.statusText);
    
    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      console.error('❌ Token exchange failed:', txt);
      return res.status(500).send('OAuth token exchange failed: ' + txt);
    }
    
    const tokenJson = await tokenRes.json();
    console.log('✅ Token response received:', Object.keys(tokenJson));
    
    const idToken = tokenJson.id_token;
    if (!idToken) {
      console.log('❌ No id_token in response');
      return res.status(500).send('No id_token');
    }

    // Decode id_token (JWT) payload (no signature verification here for brevity)
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    console.log('👤 User payload:', payload);
    
    // Save user in session
    req.session.user = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };
    
    console.log('💾 User saved to session:', req.session.user);
    
    // For cross-domain deployments, also create a JWT token and pass it in the URL
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      process.env.SESSION_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    console.log('🔑 JWT token created for cross-domain auth');
    console.log('🔄 Redirecting to frontend with token:', `${FRONTEND_ORIGIN}/dashboard?token=${token}`);

    res.redirect(`${FRONTEND_ORIGIN}/dashboard?token=${token}`);
  } catch (e) {
    console.error('❌ OAuth callback error:', e);
    res.status(500).send('OAuth error: ' + e.message);
  }
});

app.post('/auth/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
});

app.get('/api/me', (req, res) => {
  console.log('🔍 AUTH CHECK ENDPOINT HIT');
  console.log('Request origin:', req.get('origin'));
  console.log('Request referer:', req.get('referer'));
  console.log('Session exists:', !!req.session);
  console.log('Session user:', req.session?.user);
  console.log('Session ID:', req.session?.id);
  console.log('Cookies:', req.headers.cookie);
  console.log('Authorization header:', req.headers.authorization);
  
  // First try session-based auth (for same-domain)
  if (req.session && req.session.user) {
    console.log('✅ User authenticated via session - returning user data');
    return res.json({ success: true, user: req.session.user });
  }
  
  // Then try JWT token auth (for cross-domain)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'fallback-secret');
      console.log('✅ User authenticated via JWT token - returning user data');
      return res.json({ success: true, user: decoded });
    } catch (error) {
      console.log('❌ JWT token verification failed:', error.message);
    }
  }
  
  console.log('❌ No valid session or token - returning 401');
  res.status(401).json({ success: false, message: 'No session or user found' });
});

// PlantAI Route (requires auth)
app.post('/api/plantAI', requireAuth, async (req, res) => {
  try {
    const userKey = req.session.user.sub || req.session.user.email;
    const { question, plantInfo } = req.body;

    // Build memory context
    const memorySummary = stateStore.summarizeMemories(userKey);
    const recent = stateStore.recentChats(userKey, 5);

    const response = await plantAI.generateResponse(question, {
      ...plantInfo,
      memorySummary,
      recentInteractions: recent
    });

    // Save chat to store
    stateStore.addChat(userKey, {
      userMessage: question,
      plantResponse: response.reply,
      timestamp: Date.now()
    });

    res.json({
      answer: response.reply,
      mood: response.mood
    });
  } catch (error) {
    console.error('Error in plantAI route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Persist/read simple client state (protected)
app.get('/api/state', requireAuth, (req, res) => {
  try {
    const userKey = req.session.user.sub || req.session.user.email;
    const state = stateStore.getState(userKey);
    res.json({ success: true, state });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to read state' });
  }
});

app.post('/api/state', requireAuth, (req, res) => {
  try {
    const userKey = req.session.user.sub || req.session.user.email;
    const saved = stateStore.saveState(userKey, req.body || {});
    res.json({ success: true, state: saved });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to save state' });
  }
});

// Add memory event (protected)
app.post('/api/memory', requireAuth, (req, res) => {
  try {
    const userKey = req.session.user.sub || req.session.user.email;
    const { type, details } = req.body || {};
    if (!type) return res.status(400).json({ success: false, message: 'type is required' });
    const memories = stateStore.addMemory(userKey, { type, details, timestamp: Date.now() });
    res.json({ success: true, memories });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to add memory' });
  }
});

// Achievements endpoints (protected)
app.get('/api/achievements', requireAuth, (req, res) => {
  try {
    const userKey = req.session.user.sub || req.session.user.email;
    const achievements = stateStore.getAchievements(userKey);
    res.json({ success: true, achievements });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch achievements' });
  }
});

app.post('/api/achievements', requireAuth, (req, res) => {
  try {
    const userKey = req.session.user.sub || req.session.user.email;
    const { id, name, description } = req.body || {};
    if (!id || !name) return res.status(400).json({ success: false, message: 'id and name are required' });
    const achievements = stateStore.addAchievement(userKey, { id, name, description });
    res.json({ success: true, achievements });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to add achievement' });
  }
});

// Test endpoint (no auth required)
app.get('/api/test/community-service', (req, res) => {
  try {
    const icons = communityService.getCurrencyIcons();
    const items = communityService.getStoreItems();
    res.json({ success: true, icons, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Alternative endpoints without auth for testing
app.get('/api/test/currency-icons', (req, res) => {
  try {
    const icons = communityService.getCurrencyIcons();
    res.json({ success: true, icons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/test/store-items', (req, res) => {
  try {
    const items = communityService.getStoreItems();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/test/my-communities', (req, res) => {
  try {
    const communities = communityService.getUserCommunities('test-user');
    res.json({ success: true, communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Community endpoints
// Create community
app.post('/api/community/create', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { name, description } = req.body;
    
    if (!name) return res.status(400).json({ success: false, message: 'Community name is required' });
    
    const community = communityService.createCommunity(userId, name, description || '');
    res.json({ success: true, community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Join community (temporarily without auth for testing)
app.post('/api/community/join', (req, res) => {
  try {
    const userId = req.session?.user?.sub || req.session?.user?.email || 'test-user';
    const { code } = req.body;
    
    if (!code) return res.status(400).json({ success: false, message: 'Community code is required' });
    
    const community = communityService.joinCommunity(userId, code.toUpperCase());
    res.json({ success: true, community });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user's communities (temporarily without auth for testing)
app.get('/api/community/my', (req, res) => {
  try {
    // Use a test user ID when not authenticated
    const userId = req.session?.user?.sub || req.session?.user?.email || 'test-user';
    const communities = communityService.getUserCommunities(userId);
    res.json({ success: true, communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get community details
app.get('/api/community/:code', requireAuth, (req, res) => {
  try {
    const community = communityService.getCommunity(req.params.code);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    res.json({ success: true, community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add admin
app.post('/api/community/:code/admin', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { adminId } = req.body;
    
    const community = communityService.addAdmin(req.params.code, adminId, userId);
    res.json({ success: true, community });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove member
app.delete('/api/community/:code/member/:memberId', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const community = communityService.removeMember(req.params.code, req.params.memberId, userId);
    res.json({ success: true, community });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update currency
app.put('/api/community/:code/currency', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { name, icon } = req.body;
    
    const community = communityService.updateCurrency(req.params.code, name, icon, userId);
    res.json({ success: true, community });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get currency icons (temporarily without auth for testing)
app.get('/api/community/currency-icons', (req, res) => {
  try {
    const icons = communityService.getCurrencyIcons();
    res.json({ success: true, icons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get store items (temporarily without auth for testing)
app.get('/api/community/store-items', (req, res) => {
  try {
    const items = communityService.getStoreItems();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Purchase item
app.post('/api/community/:code/purchase', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { category, itemId } = req.body;
    
    const result = communityService.purchaseItem(req.params.code, userId, category, itemId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create dustbin
app.post('/api/community/:code/dustbin', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { location, description } = req.body;
    
    const dustbin = await communityService.createDustbin(req.params.code, userId, location, description);
    res.json({ success: true, dustbin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get community dustbins
app.get('/api/community/:code/dustbins', requireAuth, (req, res) => {
  try {
    const dustbins = communityService.getCommunityDustbins(req.params.code);
    res.json({ success: true, dustbins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Scan dustbin (temporarily without auth for testing)
app.post('/api/dustbin/:dustbinId/scan', (req, res) => {
  try {
    const userId = req.session?.user?.sub || req.session?.user?.email || 'test-user';
    const result = communityService.scanDustbin(req.params.dustbinId, userId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get leaderboard
app.get('/api/community/:code/leaderboard', requireAuth, (req, res) => {
  try {
    const leaderboard = communityService.getLeaderboard(req.params.code);
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add event
app.post('/api/community/:code/event', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { title, description, date } = req.body;
    
    const event = communityService.addEvent(req.params.code, userId, title, description, date);
    res.json({ success: true, event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add custom task
app.post('/api/community/:code/task', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.sub || req.session.user.email;
    const { title, description, reward } = req.body;
    
    const task = communityService.addCustomTask(req.params.code, userId, title, description, reward);
    res.json({ success: true, task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`GEMINI_API_KEY loaded: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});