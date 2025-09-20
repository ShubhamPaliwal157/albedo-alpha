const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const DATA_DIR = path.join(__dirname, '..', 'data');
const COMMUNITY_FILE = path.join(DATA_DIR, 'communities.json');
const DUSTBIN_FILE = path.join(DATA_DIR, 'dustbins.json');
const USER_COMMUNITY_FILE = path.join(DATA_DIR, 'userCommunities.json');

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(COMMUNITY_FILE)) fs.writeFileSync(COMMUNITY_FILE, JSON.stringify({}), 'utf-8');
  if (!fs.existsSync(DUSTBIN_FILE)) fs.writeFileSync(DUSTBIN_FILE, JSON.stringify({}), 'utf-8');
  if (!fs.existsSync(USER_COMMUNITY_FILE)) fs.writeFileSync(USER_COMMUNITY_FILE, JSON.stringify({}), 'utf-8');
}

function readCommunities() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(COMMUNITY_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeCommunities(data) {
  ensureFiles();
  fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function readDustbins() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(DUSTBIN_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeDustbins(data) {
  ensureFiles();
  fs.writeFileSync(DUSTBIN_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function readUserCommunities() {
  ensureFiles();
  try {
    const raw = fs.readFileSync(USER_COMMUNITY_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeUserCommunities(data) {
  ensureFiles();
  fs.writeFileSync(USER_COMMUNITY_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function generateCommunityCode() {
  // Generate a 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Currency icons available for communities
const CURRENCY_ICONS = [
  '🪙', '💰', '🏆', '⭐', '💎', '🔥', '⚡', '🌟', 
  '🎯', '🏅', '💫', '✨', '🎪', '🎨', '🎭', '🎪'
];

// Store items that can be purchased
const STORE_ITEMS = {
  avatarDecorations: [
    { id: 'crown', name: 'Golden Crown', price: 100, icon: '👑', description: 'Show your royal status' },
    { id: 'halo', name: 'Angel Halo', price: 80, icon: '😇', description: 'Pure and divine' },
    { id: 'sunglasses', name: 'Cool Sunglasses', price: 60, icon: '😎', description: 'Stay cool' },
    { id: 'party_hat', name: 'Party Hat', price: 50, icon: '🥳', description: 'Always ready to party' }
  ],
  nameplates: [
    { id: 'eco_warrior', name: 'Eco Warrior', price: 150, color: '#22c55e', description: 'For the environmental champions' },
    { id: 'plant_master', name: 'Plant Master', price: 120, color: '#16a34a', description: 'Master of all plants' },
    { id: 'green_thumb', name: 'Green Thumb', price: 100, color: '#15803d', description: 'Natural plant grower' },
    { id: 'nature_lover', name: 'Nature Lover', price: 80, color: '#166534', description: 'Loves all things natural' }
  ],
  plantDecorations: [
    { id: 'christmas_lights', name: 'Christmas Lights', price: 200, icon: '🎄', description: 'Festive tree lights' },
    { id: 'flower_crown', name: 'Flower Crown', price: 150, icon: '🌸', description: 'Beautiful flower decoration' },
    { id: 'fairy_lights', name: 'Fairy Lights', price: 120, icon: '✨', description: 'Magical twinkling lights' },
    { id: 'wind_chimes', name: 'Wind Chimes', price: 100, icon: '🎐', description: 'Peaceful wind chimes' },
    { id: 'bird_nest', name: 'Bird Nest', price: 80, icon: '🪺', description: 'Cozy bird nest' }
  ]
};

module.exports = {
  // Create a new community
  createCommunity(creatorId, name, description) {
    const communities = readCommunities();
    const userCommunities = readUserCommunities();
    
    let code;
    do {
      code = generateCommunityCode();
    } while (communities[code]); // Ensure unique code
    
    const community = {
      id: code,
      name,
      description,
      creatorId,
      createdAt: Date.now(),
      members: [creatorId],
      admins: [creatorId],
      currency: {
        name: 'EcoCoins',
        icon: '🪙'
      },
      memberBalances: {
        [creatorId]: 1000 // Creator starts with 1000 community coins
      },
      events: [],
      dustbins: [],
      customTasks: [],
      leaderboard: [
        { userId: creatorId, score: 0, tecoCoins: 0, communityCoins: 1000 }
      ]
    };
    
    communities[code] = community;
    writeCommunities(communities);
    
    // Add to user communities
    if (!userCommunities[creatorId]) userCommunities[creatorId] = [];
    userCommunities[creatorId].push(code);
    writeUserCommunities(userCommunities);
    
    return community;
  },

  // Join a community
  joinCommunity(userId, code) {
    const communities = readCommunities();
    const userCommunities = readUserCommunities();
    
    if (!communities[code]) {
      throw new Error('Community not found');
    }
    
    const community = communities[code];
    
    if (community.members.includes(userId)) {
      throw new Error('Already a member of this community');
    }
    
    community.members.push(userId);
    community.memberBalances[userId] = 500; // New members start with 500 community coins
    community.leaderboard.push({
      userId,
      score: 0,
      tecoCoins: 0,
      communityCoins: 500
    });
    
    communities[code] = community;
    writeCommunities(communities);
    
    // Add to user communities
    if (!userCommunities[userId]) userCommunities[userId] = [];
    userCommunities[userId].push(code);
    writeUserCommunities(userCommunities);
    
    return community;
  },

  // Get user's communities
  getUserCommunities(userId) {
    const userCommunities = readUserCommunities();
    const communities = readCommunities();
    
    const userCommunityCodes = userCommunities[userId] || [];
    return userCommunityCodes.map(code => communities[code]).filter(Boolean);
  },

  // Get community by code
  getCommunity(code) {
    const communities = readCommunities();
    return communities[code] || null;
  },

  // Add admin to community
  addAdmin(communityCode, adminId, requesterId) {
    const communities = readCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (community.creatorId !== requesterId) throw new Error('Only creator can add admins');
    if (!community.members.includes(adminId)) throw new Error('User is not a member');
    if (community.admins.includes(adminId)) throw new Error('User is already an admin');
    
    community.admins.push(adminId);
    communities[communityCode] = community;
    writeCommunities(communities);
    
    return community;
  },

  // Remove member from community
  removeMember(communityCode, memberId, requesterId) {
    const communities = readCommunities();
    const userCommunities = readUserCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(requesterId)) throw new Error('Only admins can remove members');
    if (memberId === community.creatorId) throw new Error('Cannot remove creator');
    if (!community.members.includes(memberId)) throw new Error('User is not a member');
    
    // Remove from community
    community.members = community.members.filter(id => id !== memberId);
    community.admins = community.admins.filter(id => id !== memberId);
    delete community.memberBalances[memberId];
    community.leaderboard = community.leaderboard.filter(entry => entry.userId !== memberId);
    
    communities[communityCode] = community;
    writeCommunities(communities);
    
    // Remove from user communities
    if (userCommunities[memberId]) {
      userCommunities[memberId] = userCommunities[memberId].filter(code => code !== communityCode);
      writeUserCommunities(userCommunities);
    }
    
    return community;
  },

  // Update community currency
  updateCurrency(communityCode, currencyName, currencyIcon, requesterId) {
    const communities = readCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(requesterId)) throw new Error('Only admins can update currency');
    if (!CURRENCY_ICONS.includes(currencyIcon)) throw new Error('Invalid currency icon');
    
    community.currency = { name: currencyName, icon: currencyIcon };
    communities[communityCode] = community;
    writeCommunities(communities);
    
    return community;
  },

  // Get available currency icons
  getCurrencyIcons() {
    return CURRENCY_ICONS;
  },

  // Get store items
  getStoreItems() {
    return STORE_ITEMS;
  },

  // Purchase item from community store
  purchaseItem(communityCode, userId, itemCategory, itemId) {
    const communities = readCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (!community.members.includes(userId)) throw new Error('Not a member of this community');
    
    const item = STORE_ITEMS[itemCategory]?.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    
    const userBalance = community.memberBalances[userId] || 0;
    if (userBalance < item.price) throw new Error('Insufficient community coins');
    
    // Deduct coins
    community.memberBalances[userId] -= item.price;
    
    // Add to user's purchased items
    if (!community.purchasedItems) community.purchasedItems = {};
    if (!community.purchasedItems[userId]) community.purchasedItems[userId] = [];
    community.purchasedItems[userId].push({
      category: itemCategory,
      itemId,
      purchasedAt: Date.now()
    });
    
    communities[communityCode] = community;
    writeCommunities(communities);
    
    return { item, newBalance: community.memberBalances[userId] };
  },

  // Create dustbin
  async createDustbin(communityCode, adminId, location, description) {
    const communities = readCommunities();
    const dustbins = readDustbins();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Only admins can create dustbins');
    
    const dustbinId = uuidv4();
    const dustbin = {
      id: dustbinId,
      communityCode,
      location,
      description,
      createdBy: adminId,
      createdAt: Date.now(),
      scannedBy: [], // Track who has scanned this dustbin
      dailyScans: {} // Track daily scans for community members
    };
    
    // Generate QR code data
    const qrData = {
      type: 'dustbin',
      dustbinId,
      communityCode,
      location
    };
    
    try {
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
      dustbin.qrCode = qrCodeDataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
    
    dustbins[dustbinId] = dustbin;
    writeDustbins(dustbins);
    
    // Add to community dustbins list
    community.dustbins.push(dustbinId);
    communities[communityCode] = community;
    writeCommunities(communities);
    
    return dustbin;
  },

  // Scan dustbin
  scanDustbin(dustbinId, userId) {
    const dustbins = readDustbins();
    const communities = readCommunities();
    const dustbin = dustbins[dustbinId];
    
    if (!dustbin) throw new Error('Dustbin not found');
    
    const community = communities[dustbin.communityCode];
    if (!community) throw new Error('Associated community not found');
    
    const today = new Date().toDateString();
    const isFirstTimeScan = !dustbin.scannedBy.includes(userId);
    const isCommunityMember = community.members.includes(userId);
    const isAdmin = community.admins.includes(dustbin.createdBy) && dustbin.createdBy === userId;
    
    let tecoReward = 0;
    let communityReward = 0;
    let message = '';
    
    // First time scan - 100 teco coins for everyone (except admin of their own dustbin)
    if (isFirstTimeScan && !isAdmin) {
      tecoReward = 100;
      dustbin.scannedBy.push(userId);
      message = 'First time scan! You earned 100 Teco coins!';
    }
    
    // Daily scan for community members
    if (isCommunityMember) {
      const dailyKey = `${userId}-${today}`;
      if (!dustbin.dailyScans[dailyKey]) {
        if (!isFirstTimeScan && !isAdmin) {
          tecoReward = 5; // Daily teco reward for members
        }
        communityReward = Math.floor(Math.random() * 51) + 50; // 50-100 community coins
        dustbin.dailyScans[dailyKey] = {
          timestamp: Date.now(),
          tecoReward,
          communityReward
        };
        
        // Update community balance
        community.memberBalances[userId] = (community.memberBalances[userId] || 0) + communityReward;
        
        // Update leaderboard
        const leaderboardEntry = community.leaderboard.find(entry => entry.userId === userId);
        if (leaderboardEntry) {
          leaderboardEntry.tecoCoins += tecoReward;
          leaderboardEntry.communityCoins += communityReward;
          leaderboardEntry.score += tecoReward + communityReward;
        }
        
        if (isFirstTimeScan) {
          message += ` Plus ${communityReward} ${community.currency.name}!`;
        } else {
          message = `Daily scan complete! Earned ${tecoReward} Teco coins and ${communityReward} ${community.currency.name}!`;
        }
      } else {
        message = 'You have already scanned this dustbin today!';
      }
    } else if (!isFirstTimeScan) {
      message = 'You have already scanned this dustbin!';
    }
    
    dustbins[dustbinId] = dustbin;
    writeDustbins(dustbins);
    
    communities[dustbin.communityCode] = community;
    writeCommunities(communities);
    
    return {
      tecoReward,
      communityReward,
      message,
      dustbin: {
        id: dustbin.id,
        location: dustbin.location,
        description: dustbin.description,
        communityName: community.name
      }
    };
  },

  // Get community dustbins
  getCommunityDustbins(communityCode) {
    const communities = readCommunities();
    const dustbins = readDustbins();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    
    return community.dustbins.map(dustbinId => dustbins[dustbinId]).filter(Boolean);
  },

  // Get community leaderboard
  getLeaderboard(communityCode) {
    const communities = readCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    
    return community.leaderboard.sort((a, b) => b.score - a.score);
  },

  // Add community event
  addEvent(communityCode, adminId, title, description, date) {
    const communities = readCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Only admins can create events');
    
    const event = {
      id: uuidv4(),
      title,
      description,
      date,
      createdBy: adminId,
      createdAt: Date.now()
    };
    
    community.events.push(event);
    communities[communityCode] = community;
    writeCommunities(communities);
    
    return event;
  },

  // Add custom task
  addCustomTask(communityCode, adminId, title, description, reward) {
    const communities = readCommunities();
    const community = communities[communityCode];
    
    if (!community) throw new Error('Community not found');
    if (!community.admins.includes(adminId)) throw new Error('Only admins can create tasks');
    
    const task = {
      id: uuidv4(),
      title,
      description,
      reward,
      createdBy: adminId,
      createdAt: Date.now(),
      completedBy: []
    };
    
    community.customTasks.push(task);
    communities[communityCode] = community;
    writeCommunities(communities);
    
    return task;
  }
};
