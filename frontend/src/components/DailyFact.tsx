import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Droplets, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyFactProps {
  onWaterEarned: (amount: number) => void;
}

const environmentalFacts = [
  {
    title: "Ocean Cleanup",
    fact: "A single plastic bottle takes 450 years to decompose in the ocean. By choosing reusable bottles, you're protecting marine life for centuries!",
    waterReward: 25
  },
  {
    title: "Tree Power",
    fact: "One mature tree produces enough oxygen for two people per day and absorbs 48 pounds of CO2 annually. That's like taking a car off the road for 26,000 miles!",
    waterReward: 30
  },
  {
    title: "Energy Efficiency",
    fact: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer. Switching just 5 bulbs can save $40 per year!",
    waterReward: 20
  },
  {
    title: "Water Conservation",
    fact: "A dripping faucet can waste over 3,000 gallons of water per year. That's enough water for 180 showers!",
    waterReward: 35
  },
  {
    title: "Renewable Energy",
    fact: "Solar panels can power your home for 25+ years and reduce carbon emissions by 100,000 pounds over their lifetime!",
    waterReward: 40
  },
  {
    title: "Recycling Magic",
    fact: "Recycling one aluminum can saves enough energy to power a TV for 3 hours. Americans throw away enough aluminum to rebuild our entire commercial fleet every 3 months!",
    waterReward: 25
  },
  {
    title: "Transportation Impact",
    fact: "Biking just 10 miles per week instead of driving saves 500 pounds of CO2 per year - equivalent to planting 6 trees!",
    waterReward: 30
  }
];

const DailyFact: React.FC<DailyFactProps> = ({ onWaterEarned }) => {
  const [todaysFact, setTodaysFact] = useState(environmentalFacts[0]);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // Get today's fact based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const factIndex = dayOfYear % environmentalFacts.length;
    setTodaysFact(environmentalFacts[factIndex]);

    // Check if user has already read today's fact
    const lastReadDate = localStorage.getItem('lastFactRead');
    const todayString = today.toDateString();
    setHasReadToday(lastReadDate === todayString);
  }, []);

  const handleReadFact = () => {
    if (hasReadToday) return;

    setShowReward(true);
    setHasReadToday(true);
    
    // Mark as read today
    localStorage.setItem('lastFactRead', new Date().toDateString());
    
    // Award water drops
    setTimeout(() => {
      onWaterEarned(todaysFact.waterReward);
      setShowReward(false);
    }, 2000);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-teco" />
          Daily Eco-Fact
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-primary mb-2">{todaysFact.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {todaysFact.fact}
          </p>
        </div>

        {!hasReadToday ? (
          <Button 
            onClick={handleReadFact}
            variant="eco"
            className="w-full"
            disabled={showReward}
          >
            <Droplets className="w-4 h-4 mr-2" />
            Read & Earn {todaysFact.waterReward} Water Drops
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 p-3 bg-healthy/10 rounded-lg border border-healthy/20">
            <CheckCircle className="w-5 h-5 text-healthy" />
            <span className="text-sm font-medium text-healthy">
              Fact read today! Come back tomorrow for more.
            </span>
          </div>
        )}

        {/* Water Drop Animation */}
        {showReward && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -50, -100] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-lg">
              <Droplets className="w-5 h-5" />
              <span className="font-bold">+{todaysFact.waterReward}</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyFact;