import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Crown, Shield, Zap, Leaf, 
  Users, Recycle, Droplets, Sun, Target,
  Lock, CheckCircle, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'community' | 'environmental' | 'learning' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    target: number;
    current: number;
  };
  rewards: {
    tecoCoins: number;
    communityCoins?: number;
    title?: string;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  hidden?: boolean;
}

const achievements: Achievement[] = [
  // Community Achievements
  {
    id: 'first-community',
    title: 'Community Pioneer',
    description: 'Create your first community',
    icon: <Users className="w-6 h-6" />,
    category: 'community',
    rarity: 'common',
    requirements: { type: 'communities_created', target: 1, current: 0 },
    rewards: { tecoCoins: 100, title: 'Pioneer' },
    unlocked: false
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Have 25 members in your community',
    icon: <Crown className="w-6 h-6" />,
    category: 'community',
    rarity: 'rare',
    requirements: { type: 'community_members', target: 25, current: 5 },
    rewards: { tecoCoins: 500, title: 'Builder' },
    unlocked: false
  },
  {
    id: 'super-admin',
    title: 'Super Admin',
    description: 'Manage 5 different communities as admin',
    icon: <Shield className="w-6 h-6" />,
    category: 'community',
    rarity: 'epic',
    requirements: { type: 'admin_communities', target: 5, current: 1 },
    rewards: { tecoCoins: 1000, title: 'Super Admin' },
    unlocked: false
  },

  // Environmental Achievements
  {
    id: 'first-scan',
    title: 'First Scanner',
    description: 'Scan your first dustbin QR code',
    icon: <Recycle className="w-6 h-6" />,
    category: 'environmental',
    rarity: 'common',
    requirements: { type: 'dustbins_scanned', target: 1, current: 1 },
    rewards: { tecoCoins: 50 },
    unlocked: true,
    unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'recycling-champion',
    title: 'Recycling Champion',
    description: 'Scan 50 dustbin QR codes',
    icon: <Trophy className="w-6 h-6" />,
    category: 'environmental',
    rarity: 'rare',
    requirements: { type: 'dustbins_scanned', target: 50, current: 12 },
    rewards: { tecoCoins: 500, title: 'Champion' },
    unlocked: false
  },
  {
    id: 'eco-warrior',
    title: 'Eco Warrior',
    description: 'Complete 100 environmental actions',
    icon: <Leaf className="w-6 h-6" />,
    category: 'environmental',
    rarity: 'epic',
    requirements: { type: 'eco_actions', target: 100, current: 34 },
    rewards: { tecoCoins: 1500, title: 'Eco Warrior' },
    unlocked: false
  },

  // Learning Achievements
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 10 educational quizzes',
    icon: <Star className="w-6 h-6" />,
    category: 'learning',
    rarity: 'common',
    requirements: { type: 'quizzes_completed', target: 10, current: 7 },
    rewards: { tecoCoins: 200 },
    unlocked: false
  },
  {
    id: 'perfect-score',
    title: 'Perfect Scholar',
    description: 'Get 100% on 5 different quizzes',
    icon: <Target className="w-6 h-6" />,
    category: 'learning',
    rarity: 'rare',
    requirements: { type: 'perfect_quizzes', target: 5, current: 2 },
    rewards: { tecoCoins: 750, title: 'Scholar' },
    unlocked: false
  },

  // Social Achievements
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Join 10 different communities',
    icon: <Users className="w-6 h-6" />,
    category: 'social',
    rarity: 'rare',
    requirements: { type: 'communities_joined', target: 10, current: 3 },
    rewards: { tecoCoins: 400 },
    unlocked: false
  },

  // Special/Hidden Achievements
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'One of the first 100 users on the platform',
    icon: <Zap className="w-6 h-6" />,
    category: 'special',
    rarity: 'legendary',
    requirements: { type: 'user_rank', target: 100, current: 42 },
    rewards: { tecoCoins: 2000, title: 'Early Adopter' },
    unlocked: true,
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'mystery-achievement',
    title: '???',
    description: 'Complete a secret challenge',
    icon: <Lock className="w-6 h-6" />,
    category: 'special',
    rarity: 'legendary',
    requirements: { type: 'secret', target: 1, current: 0 },
    rewards: { tecoCoins: 5000, title: 'Mystery Master' },
    unlocked: false,
    hidden: true
  }
];

const AchievementSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'community': return <Users className="w-4 h-4" />;
      case 'environmental': return <Leaf className="w-4 h-4" />;
      case 'learning': return <Star className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'special': return <Crown className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements.filter(a => !a.hidden)
    : achievements.filter(a => a.category === selectedCategory && !a.hidden);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.filter(a => !a.hidden).length;
  const completionPercentage = (unlockedAchievements.length / totalAchievements) * 100;

  const categories = [
    { id: 'all', name: 'All', count: achievements.filter(a => !a.hidden).length },
    { id: 'community', name: 'Community', count: achievements.filter(a => a.category === 'community').length },
    { id: 'environmental', name: 'Environmental', count: achievements.filter(a => a.category === 'environmental').length },
    { id: 'learning', name: 'Learning', count: achievements.filter(a => a.category === 'learning').length },
    { id: 'social', name: 'Social', count: achievements.filter(a => a.category === 'social').length },
    { id: 'special', name: 'Special', count: achievements.filter(a => a.category === 'special' && !a.hidden).length }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-primary">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{Math.round(completionPercentage)}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">
                {unlockedAchievements.reduce((sum, a) => sum + a.rewards.tecoCoins, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Teco Earned</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {unlockedAchievements.length}/{totalAchievements}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setSelectedCategory(category.id)}
          >
            {getCategoryIcon(category.id)}
            <span className="ml-1">{category.name}</span>
            <span className="ml-1 text-xs">({category.count})</span>
          </Badge>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`${achievement.unlocked ? '' : 'opacity-75'}`}
          >
            <Card className={`h-full ${achievement.unlocked ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.unlocked ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      achievement.icon
                    )}
                  </div>
                  <Badge className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {achievement.title}
                  {achievement.unlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.requirements.current}/{achievement.requirements.target}</span>
                    </div>
                    <Progress 
                      value={(achievement.requirements.current / achievement.requirements.target) * 100} 
                      className="h-2"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Rewards:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      +{achievement.rewards.tecoCoins} Teco
                    </Badge>
                    {achievement.rewards.communityCoins && (
                      <Badge variant="outline" className="text-xs">
                        +{achievement.rewards.communityCoins} Community
                      </Badge>
                    )}
                    {achievement.rewards.title && (
                      <Badge variant="outline" className="text-xs">
                        Title: {achievement.rewards.title}
                      </Badge>
                    )}
                  </div>
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-muted-foreground">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No achievements found</h3>
          <p className="text-muted-foreground">
            Try selecting a different category or start completing challenges!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;
