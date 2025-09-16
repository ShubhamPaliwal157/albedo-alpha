import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, BookOpen, Store, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlantCompanion from '@/components/PlantCompanion';
import PlantChat from '@/components/PlantChat';
import DailyFact from '@/components/DailyFact';
import TecoShop from '@/components/TecoShop';

const Dashboard = () => {
  const [plantName, setPlantName] = useState('Sage');
  const [plantGrowth, setPlantGrowth] = useState(25);
  const [waterLevel, setWaterLevel] = useState(75);
  const [tecoCoins, setTecoCoins] = useState(150);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleWaterPlant = () => {
    if (waterLevel < 100) {
      setWaterLevel(prev => Math.min(prev + 20, 100));
      setTecoCoins(prev => prev + 5); // Reward for caring
    }
  };

  const handleWaterEarned = (amount: number) => {
    setWaterLevel(prev => Math.min(prev + amount, 100));
  };

  const handleShopPurchase = (item: any) => {
    if (tecoCoins >= item.price) {
      setTecoCoins(prev => prev - item.price);
      
      // Apply item effects
      if (item.category === 'fertilizer') {
        if (item.effect.includes('Instant')) {
          setPlantGrowth(prev => Math.min(prev + 5, 100));
        }
      }
      
      // Show success message (you could add a toast here)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Albedo
          </h1>
          <p className="text-lg text-muted-foreground">
            Growing a sustainable future, one plant at a time
          </p>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plant Companion - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2">
                <PlantCompanion
                  plantName={plantName}
                  growth={Math.round(plantGrowth)}
                  waterLevel={Math.round(waterLevel)}
                  tecoCoins={tecoCoins}
                  onChatWithPlant={() => setShowChat(true)}
                  onWaterPlant={handleWaterPlant}
                />
              </div>

              {/* Daily Fact */}
              <div>
                <DailyFact onWaterEarned={handleWaterEarned} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Games Coming Soon!</h3>
              <p className="text-muted-foreground mb-6">
                Eco-friendly games like Green Wordle, Climate Tetris, and Rapid Eco-Quiz are in development.
              </p>
              <Button variant="eco">Stay Tuned</Button>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Learning Modules</h3>
              <p className="text-muted-foreground mb-6">
                Interactive courses on sustainability, climate science, and green practices coming soon.
              </p>
              <Button variant="eco">Explore Soon</Button>
            </div>
          </TabsContent>

          <TabsContent value="shop" className="space-y-6">
            <TecoShop 
              tecoBalance={tecoCoins}
              onPurchase={handleShopPurchase}
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Achievement System</h3>
              <p className="text-muted-foreground mb-6">
                Earn badges for eco-friendly actions, completing quizzes, and growing your plant.
              </p>
              <Button variant="eco">Coming Soon</Button>
            </div>
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
                onClose={() => setShowChat(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;