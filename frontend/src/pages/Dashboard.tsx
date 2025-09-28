import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, BookOpen, Store, Trophy, Settings, Play, Clock, Star, X, Users, Bell, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlantCompanion from '@/components/PlantCompanion';
import PlantChat from '@/components/PlantChat';
import DailyFact from '@/components/DailyFact';
import TecoShop from '@/components/TecoShop';
import EcoGames from '@/components/EcoGames';
import AchievementSystem from '@/components/AchievementSystem';
import NotificationCenter from '@/components/NotificationCenter';
import Community from '@/pages/Community';
import { readClientState, saveClientState, addMemoryEvent, getAchievements, addAchievement } from '@/api/plantApi';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence } from 'framer-motion';

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tecoReward: number;
  thumbnail: string;
}

const videoLessons: VideoLesson[] = [
  {
    id: 'biosphere-basics',
    title: 'Understanding Biosphere Basics',
    description: 'Learn the fundamentals of climate change and its impact on our planet.',
    youtubeId: 'VD6xJq8NguY',
    duration: '5:30',
    difficulty: 'beginner',
    category: 'Climate Science',
    tecoReward: 25,
    thumbnail: `https://img.youtube.com/vi/VD6xJq8NguY/maxresdefault.jpg`
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Solutions',
    description: 'Explore solar, wind, and other renewable energy technologies.',
    youtubeId: 'wbR-5mHI6bo',
    duration: '8:15',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/wbR-5mHI6bo/maxresdefault.jpg`
  },
  {
    id: 'climate-change',
    title: 'Is it too late to stop climate change?',
    description: 'Explore Is it too late to stop climate change?',
    youtubeId: 'ipVxxxqwBQw',
    duration: '8:54',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/ipVxxxqwBQw/maxresdefault.jpg`
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Solutions',
    description: 'Explore solar, wind, and other renewable energy technologies.',
    youtubeId: 'wbR-5mHI6bo',
    duration: '8:15',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/wbR-5mHI6bo/maxresdefault.jpg`
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Solutions',
    description: 'Explore solar, wind, and other renewable energy technologies.',
    youtubeId: 'wbR-5mHI6bo',
    duration: '8:15',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/wbR-5mHI6bo/maxresdefault.jpg`
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Solutions',
    description: 'Explore solar, wind, and other renewable energy technologies.',
    youtubeId: 'wbR-5mHI6bo',
    duration: '8:15',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/wbR-5mHI6bo/maxresdefault.jpg`
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Solutions',
    description: 'Explore solar, wind, and other renewable energy technologies.',
    youtubeId: 'wbR-5mHI6bo',
    duration: '8:15',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/wbR-5mHI6bo/maxresdefault.jpg`
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Solutions',
    description: 'Explore solar, wind, and other renewable energy technologies.',
    youtubeId: 'wbR-5mHI6bo',
    duration: '8:15',
    difficulty: 'intermediate',
    category: 'Energy',
    tecoReward: 35,
    thumbnail: `https://img.youtube.com/vi/wbR-5mHI6bo/maxresdefault.jpg`
  },
  {
    id: 'very-important',
    title: 'Very Important Lesson',
    description: 'Simple daily habits that make a big environmental difference.',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '3:33',
    difficulty: 'advanced',
    category: 'Lifestyle',
    tecoReward: 3,
    thumbnail: `https://img.youtube.com/vi/ipVxxxqwBQw/maxresdefault.jpg`
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [plantName, setPlantName] = useState('Sage');
  const [plantType, setPlantType] = useState('oak'); // <-- add plantType state
  const [plantGrowth, setPlantGrowth] = useState(25);
  const [waterLevel, setWaterLevel] = useState(75);
  const [tecoCoins, setTecoCoins] = useState(150);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [backgroundTheme, setBackgroundTheme] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Learn tab state
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [learnFilter, setLearnFilter] = useState<string>('all');

  useEffect(() => {
    // Auth gate: check session
    (async () => {
      console.log('🔐 DASHBOARD AUTH CHECK STARTED');
      console.log('Current URL:', window.location.href);
      console.log('Current port:', window.location.port);
      console.log('Environment variables:', {
        VITE_API_BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL,
        VITE_SERVER_BASE: (import.meta as any).env?.VITE_SERVER_BASE
      });
      
      try {
        // Get the correct API base URL
        const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 
          (window.location.port === '5173' ? 'http://localhost:3000' : 'https://albedo-alpha.vercel.app');
        
        console.log('🌐 Using API base:', apiBase);
        const authUrl = `${apiBase}/api/me`;
        console.log('🔍 Checking auth at:', authUrl);
        
        const res = await fetch(authUrl, { 
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📡 Auth response status:', res.status, res.statusText);
        console.log('📡 Auth response headers:', Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log('❌ Auth check failed - Response body:', errorText);
          throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json();
        console.log('📄 Auth response JSON:', json);
        
        if (!json?.success) {
          console.log('❌ Auth response invalid - success field missing or false');
          throw new Error('Auth response invalid');
        }
        
        console.log('✅ User authenticated successfully:', json.user);
      } catch (error) {
        console.log('🚨 Authentication failed, preparing redirect:', error);
        
        // Get the correct server base URL
        const serverBase = (import.meta as any).env?.VITE_SERVER_BASE || 
          (window.location.port === '5173' ? 'http://localhost:3000' : 'https://albedo-alpha.vercel.app');
        
        const redirectUrl = `${serverBase.replace(/\/$/, '')}/auth/google/start`;
        console.log('🔄 Will redirect to:', redirectUrl);
        console.log('⏱️ Redirecting in 2 seconds to prevent infinite loops...');
        
        // Add a longer delay to prevent rapid redirects and allow logging
        setTimeout(() => {
          console.log('🚀 Redirecting now to Google OAuth...');
          window.location.href = redirectUrl;
        }, 2000);
        return;
      }
      
      // Load saved client state on mount
      try {
        const data = await readClientState();
        const s = data?.state || {};
        if (s.plantType) setPlantType(s.plantType);
        if (s.backgroundTheme) setBackgroundTheme(s.backgroundTheme);
      } catch (e) {
        console.log('Failed to load client state:', e);
      }
      
      try {
        const a = await getAchievements();
        setAchievements(a.achievements || []);
      } catch (e) {
        console.log('Failed to load achievements:', e);
      }
      
      // Load completed videos
      const completed = localStorage.getItem('completedVideos');
      if (completed) setCompletedVideos(new Set(JSON.parse(completed)));
    })();
  }, []);

  const handleWaterPlant = async () => {
    if (waterLevel < 100) {
      const newLevel = Math.min(waterLevel + 20, 100);
      setWaterLevel(newLevel);
      setTecoCoins(prev => prev + 5);
      try { await addMemoryEvent('watering', `Watered to ${newLevel}%`); } catch {}
      // First watering achievement
      try {
        const already = achievements.some(a => a.id === 'first-watering');
        if (!already) {
          await addAchievement('first-watering', 'First Watering', 'Gave your plant its first drink');
        }
        const refreshed = await getAchievements();
        setAchievements(refreshed.achievements || []);
      } catch (e) { console.error('Award watering achievement failed', e); }
    }
  };

  const handleWaterEarned = (amount: number) => {
    setWaterLevel(prev => Math.min(prev + amount, 100));
  };

  const handleShopPurchase = async (item: any) => {
    if (tecoCoins >= item.price) {
      setTecoCoins(prev => prev - item.price);
      
      if (item.category === 'fertilizer') {
        if (item.effect.includes('Instant')) {
          setPlantGrowth(prev => Math.min(prev + 5, 100));
        }
      }
      if (item.category === 'background' && item.backgroundTheme) {
        setBackgroundTheme(item.backgroundTheme);
        try { await saveClientState({ backgroundTheme: item.backgroundTheme }); } catch {}
      }
      if (item.category === 'species' && item.species) {
        setPlantType(item.species);
        try { await saveClientState({ plantType: item.species }); } catch {}
      }
      try { await addMemoryEvent('purchase', `Bought ${item.name}`); } catch {}
      // First purchase achievement
      try {
        const already = achievements.some(a => a.id === 'first-purchase');
        if (!already) {
          await addAchievement('first-purchase', 'First Purchase', 'Bought your first shop item');
        }
        const refreshed = await getAchievements();
        setAchievements(refreshed.achievements || []);
      } catch (e) { console.error('Award purchase achievement failed', e); }
      console.log(`Purchased ${item.name}!`);
    }
  };

  // Simulate plant growth over time
  useEffect(() => {
    const growthInterval = setInterval(() => {
      if (waterLevel > 20) {
        setPlantGrowth(prev => {
          if (prev < 100) {
            return prev + 0.1; // Slow but steady growth
          }
          return prev;
        });
      }
      
      // Water naturally decreases over time
      setWaterLevel(prev => Math.max(prev - 0.5, 0));
    }, 10000); // Every 10 seconds

    return () => clearInterval(growthInterval);
  }, [waterLevel]);

  // Growth milestone achievements
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    for (const m of milestones) {
      if (plantGrowth >= m && !achievements.find(a => a.id === `growth-${m}`)) {
        (async () => {
          try {
            await addAchievement(`growth-${m}`, `Growth ${m}%`, `Reached ${m}% growth`);
            await addMemoryEvent('milestone', `Reached ${m}% growth`);
            const refreshed = await getAchievements();
            setAchievements(refreshed.achievements || []);
          } catch (e) { console.error('Award growth achievement failed', e); }
        })();
      }
    }
  }, [plantGrowth]);

  // Map plantGrowth to growthStage for demo
  const getGrowthStage = (growth: number) => {
    if (growth < 10) return 'seed';
    if (growth < 20) return 'sprout';
    if (growth < 30) return 'seedling';
    if (growth < 40) return 'sapling';
    if (growth < 50) return 'juvenile';
    if (growth < 60) return 'young';
    if (growth < 75) return 'mature';
    if (growth < 85) return 'flowering';
    if (growth < 95) return 'fruiting';
    return 'ancient';
  };

  const categories = ['all', ...Array.from(new Set(videoLessons.map(v => v.category)))];
  const filteredVideos = learnFilter === 'all' ? videoLessons : videoLessons.filter(v => v.category.toLowerCase() === learnFilter.toLowerCase());

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVideoComplete = async (video: VideoLesson) => {
    if (completedVideos.has(video.id)) return;
    setCompletedVideos(prev => {
      const next = new Set(prev);
      next.add(video.id);
      localStorage.setItem('completedVideos', JSON.stringify([...next]));
      return next;
    });
    setTecoCoins(prev => prev + video.tecoReward);
    try { await addMemoryEvent('lesson-completed', `Completed: ${video.title} (+${video.tecoReward} teco)`); } catch {}
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundTheme ? backgroundTheme : 'from-background via-secondary/10 to-primary/5'}`}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 sm:mb-2">
              Albedo
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Growing a sustainable future, one plant at a time
            </p>
          </div>
          
          {/* Notification Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative flex-shrink-0 ml-4"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 sm:mb-8 h-12 sm:h-auto">
            <TabsTrigger value="home" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
              <Home className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
              <Users className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
              <Gamepad2 className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
              <BookOpen className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
              <Store className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
              <Trophy className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Awards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="space-y-6">
            <Community />
          </TabsContent>

          <TabsContent value="home" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Plant Companion - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2">
                <PlantCompanion
                  plantName={plantName}
                  plantType={plantType}
                  growth={Math.round(plantGrowth)}
                  waterLevel={Math.round(waterLevel)}
                  tecoCoins={tecoCoins}
                  onChatWithPlant={() => setShowChat(true)}
                  onWaterPlant={handleWaterPlant}
                  growthStage={getGrowthStage(plantGrowth)} // <-- pass growthStage
                />
              </div>

              {/* Daily Fact */}
              <div className="space-y-3 sm:space-y-4">
                <DailyFact onWaterEarned={handleWaterEarned} />
                {achievements.length > 0 && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Recent Achievements</h4>
                    <ul className="space-y-1 text-sm">
                      {achievements.slice(0, 4).map(a => (
                        <li key={a.id} className="flex items-center gap-2">
                          <span>🏅</span>
                          <span>{a.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4 sm:space-y-6">
            <EcoGames />
          </TabsContent>

          <TabsContent value="learn" className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Learning Modules</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Interactive video lessons. Watch and earn teco.</p>
              {/* Filter */}
              <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={learnFilter === category ? "default" : "outline"}
                    onClick={() => setLearnFilter(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${completedVideos.has(video.id) ? 'ring-2 ring-green-500 bg-green-50' : 'hover:border-primary/40'}`} onClick={() => setSelectedVideo(video)}>
                      <div className="relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-t-lg" />
                        <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        {completedVideos.has(video.id) && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getDifficultyColor(video.difficulty)}>
                            {video.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {video.duration}
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{video.category}</Badge>
                          <div className="flex items-center gap-1 text-sm font-medium text-teco">
                            <Star className="w-4 h-4" />
                            +{video.tecoReward} teco
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
              {selectedVideo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  onClick={() => setSelectedVideo(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                          title={selectedVideo.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-muted-foreground">{selectedVideo.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge className={getDifficultyColor(selectedVideo.difficulty)}>
                            {selectedVideo.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedVideo.duration}
                          </div>
                          <div className="flex items-center gap-1 text-teco font-medium">
                            <Star className="w-4 h-4" />
                            +{selectedVideo.tecoReward} teco reward
                          </div>
                        </div>
                        {!completedVideos.has(selectedVideo.id) && (
                          <Button onClick={() => handleVideoComplete(selectedVideo)} className="w-full" variant="future">
                            Mark as Completed (+{selectedVideo.tecoReward} teco)
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4 sm:space-y-6">
            <TecoShop 
              tecoBalance={tecoCoins}
              onPurchase={handleShopPurchase}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 sm:space-y-6">
            <AchievementSystem />
          </TabsContent>
        </Tabs>

        {/* Plant Chat Modal */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowChat(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PlantChat
                plantName={plantName}
                plantType={plantType} // <-- pass plantType
                onClose={() => setShowChat(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Notification Center */}
        <NotificationCenter 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;