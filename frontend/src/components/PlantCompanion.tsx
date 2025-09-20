import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sprout, TreePine, Droplets, Coins, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlantCompanionProps {
  plantName: string;
  plantType: string;
  growth: number; // 0-100
  waterLevel: number; // 0-100
  tecoCoins: number;
  onChatWithPlant: () => void;
  onWaterPlant: () => void;
  growthStage?: string;
  mood?: string; // <-- add mood
}

const PlantCompanion: React.FC<PlantCompanionProps> = ({
  plantName,
  plantType,
  growth,
  waterLevel,
  tecoCoins,
  onChatWithPlant,
  onWaterPlant,
  growthStage = 'seed',
  mood = 'happy',
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

  // Map growth stages to icons/emojis
  const growthStageIcons: Record<string, string> = {
    seed: '🌱',
    sprout: '🌿',
    seedling: '🪴',
    sapling: '🌳',
    juvenile: '🌲',
    young: '🌴',
    mature: '🌲',
    flowering: '🌸',
    fruiting: '🍎',
    ancient: '🎋',
  };
  // Map species to emojis (sample)
  const speciesEmojis: Record<string, string> = {
    oak: '🌳', maple: '🍁', banyan: '🌳', redwood: '🌲', cherry: '🌸',
    pine: '🌲', willow: '🌿', cactus: '🌵', bonsai: '🪴', sunflower: '🌻',
    fern: '🌿', baobab: '🌳', bamboo: '🎋', rose: '🌹', mangrove: '🌳',
    apple: '🍏', peach: '🍑', fig: '🍈', olive: '🫒', palm: '🌴',
    spruce: '🌲', cedar: '🌲', birch: '🌳', sequoia: '🌲', acacia: '🌳',
    lotus: '🌸', tulip: '🌷', daisy: '🌼', lavender: '💜', sage: '🌿'
  };
  const stageIcon = growthStageIcons[growthStage] || '🌱';
  const speciesIcon = speciesEmojis[plantType] || '🪴';

  const getPlantIcon = () => {
    if (growth < 25) return <Sprout className="w-20 h-20 text-secondary" />;
    if (growth < 50) return <TreePine className="w-24 h-24 text-secondary" />;
    if (growth < 75) return <TreePine className="w-28 h-28 text-primary" />;
    return <TreePine className="w-32 h-32 text-primary animate-float" />;
  };

  const moodEmoji = (m: string) => {
    switch ((m || '').toLowerCase()) {
      case 'thirsty': return '💧';
      case 'excited': return '✨';
      case 'growing': return '🌱';
      case 'wise': return '🪵';
      case 'playful': return '😄';
      case 'lonely': return '🌫️';
      case 'grateful': return '💚';
      case 'worried': return '⚠️';
      default: return '🌿';
    }
  };
  const moodBg = (m: string) => {
    switch ((m || '').toLowerCase()) {
      case 'thirsty': return 'from-sky-50 to-sky-100';
      case 'excited': return 'from-amber-50 to-amber-100';
      case 'growing': return 'from-green-50 to-green-100';
      case 'wise': return 'from-emerald-50 to-emerald-100';
      case 'playful': return 'from-pink-50 to-pink-100';
      case 'lonely': return 'from-slate-50 to-slate-100';
      case 'grateful': return 'from-lime-50 to-lime-100';
      case 'worried': return 'from-orange-50 to-orange-100';
      default: return 'from-secondary/20 to-primary/10';
    }
  };

  const getMoodMessage = () => {
    switch ((mood || '').toLowerCase()) {
      case 'thirsty':
        return "I'm feeling a bit thirsty! 💧 Could we top up soon?";
      case 'growing':
        return "I'm growing stronger! 🌱 I remember the last watering helped a lot.";
      case 'excited':
        return "Look how tall I've grown! 🌳 That fertilizer you used was amazing!";
      case 'wise':
        return "Each ring tells a story. Let's choose actions that age well.";
      case 'playful':
        return "Leaf me a message! I promise not to bark up the wrong tree. 🌿";
      case 'lonely':
        return "I miss our chats. Even a drop of hello helps me bloom.";
      case 'grateful':
        return "Thank you for your care. I won't forget your kind actions. 💚";
      case 'worried':
        return "I'm a bit concerned—let's check water and health together.";
      default:
        return "Ready to save the future together! 🌍";
    }
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${moodBg(mood)} border-primary/20`}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          {speciesIcon} {plantName} <span className="text-xl">{moodEmoji(mood)}</span>
        </CardTitle>
        <div className="flex flex-col gap-1 items-center">
          <Badge variant="outline" className="w-fit mx-auto">
            {plantType.charAt(0).toUpperCase() + plantType.slice(1)} Species
          </Badge>
          <Badge variant="outline" className="w-fit mx-auto mt-1">
            Growth Stage: {growthStage.charAt(0).toUpperCase() + growthStage.slice(1)} {stageIcon}
          </Badge>
          <Badge variant="outline" className="w-fit mx-auto mt-1">
            Time Traveler from 2157
          </Badge>
        </div>
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
            <span className="text-[64px]">{stageIcon}</span>
            
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