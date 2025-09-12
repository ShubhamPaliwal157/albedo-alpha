import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout, TreePine, Droplets, Coins, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlantCompanionProps {
  plantName: string;
  growth: number; // 0-100
  waterLevel: number; // 0-100
  tecoCoins: number;
  onChatWithPlant: () => void;
  onWaterPlant: () => void;
}

const PlantCompanion: React.FC<PlantCompanionProps> = ({
  plantName,
  growth,
  waterLevel,
  tecoCoins,
  onChatWithPlant,
  onWaterPlant
}) => {
  const [plantMood, setPlantMood] = useState<'happy' | 'thirsty' | 'growing' | 'excited'>('happy');

  useEffect(() => {
    if (waterLevel < 30) {
      setPlantMood('thirsty');
    } else if (growth > 80) {
      setPlantMood('excited');
    } else if (growth % 20 === 0 && growth > 0) {
      setPlantMood('growing');
    } else {
      setPlantMood('happy');
    }
  }, [waterLevel, growth]);

  const getPlantIcon = () => {
    if (growth < 25) return <Sprout className="w-20 h-20 text-secondary" />;
    if (growth < 50) return <TreePine className="w-24 h-24 text-secondary" />;
    if (growth < 75) return <TreePine className="w-28 h-28 text-primary" />;
    return <TreePine className="w-32 h-32 text-primary animate-float" />;
  };

  const getMoodMessage = () => {
    switch (plantMood) {
      case 'thirsty':
        return "I'm feeling a bit thirsty! 💧";
      case 'growing':
        return "I'm growing stronger! 🌱";
      case 'excited':
        return "Look how tall I've grown! 🌳";
      default:
        return "Ready to save the future together! 🌍";
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10 border-primary/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-primary">{plantName}</CardTitle>
        <Badge variant="outline" className="w-fit mx-auto">
          Time Traveler from 2157
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Plant Visual */}
        <div className="flex justify-center items-end min-h-[120px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {getPlantIcon()}
            
            {/* Mood indicator */}
            <motion.div
              animate={{
                y: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2"
            >
              <Star className="w-6 h-6 text-teco fill-current" />
            </motion.div>
          </motion.div>
        </div>

        {/* Plant Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Growth Progress</span>
            <span className="text-sm font-bold text-primary">{growth}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-secondary to-primary h-3 rounded-full"
              style={{ width: `${growth}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${growth}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Water Level</span>
            <span className={`text-sm font-bold ${waterLevel < 30 ? 'text-warning' : 'text-accent'}`}>
              {waterLevel}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${
                waterLevel < 30 
                  ? 'bg-gradient-to-r from-warning to-danger' 
                  : 'bg-gradient-to-r from-accent to-accent'
              }`}
              style={{ width: `${waterLevel}%` }}
              animate={{ width: `${waterLevel}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Mood Message */}
        <div className="text-center p-3 bg-card rounded-lg border border-border">
          <p className="text-sm text-card-foreground italic">"{getMoodMessage()}"</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="future"
            size="sm"
            onClick={onChatWithPlant}
            className="flex-1"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </Button>
          
          <Button
            variant="eco"
            size="sm"
            onClick={onWaterPlant}
            disabled={waterLevel > 80}
            className="flex-1"
          >
            <Droplets className="w-4 h-4" />
            Water
          </Button>
        </div>

        {/* Teco Balance */}
        <div className="flex items-center justify-center gap-2 p-2 bg-teco/10 rounded-lg border border-teco/20">
          <Coins className="w-5 h-5 text-teco" />
          <span className="font-bold text-teco">{tecoCoins} Teco</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantCompanion;