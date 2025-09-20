import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coins, Zap, Shield, Palette, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  category: 'fertilizer' | 'decoration' | 'protection' | 'background' | 'species';
  effect: string;
  backgroundTheme?: string; // tailwind gradient classes for backgrounds
  species?: string; // species name to unlock/switch to
}

interface TecoShopProps {
  tecoBalance: number;
  onPurchase: (item: ShopItem) => void;
}

const shopItems: ShopItem[] = [
  {
    id: 'super-fertilizer',
    name: 'Super Fertilizer',
    description: 'Boosts plant growth by 10%',
    price: 50,
    icon: <Zap className="w-6 h-6" />,
    category: 'fertilizer',
    effect: '+10% Growth Speed'
  },
  {
    id: 'eco-pesticide',
    name: 'Eco Pesticide',
    description: 'Protects against virtual pests',
    price: 75,
    icon: <Shield className="w-6 h-6" />,
    category: 'protection',
    effect: 'Pest Protection'
  },
  {
    id: 'rainbow-pot',
    name: 'Rainbow Pot',
    description: 'Beautiful colorful decoration',
    price: 100,
    icon: <Palette className="w-6 h-6" />,
    category: 'decoration',
    effect: 'Visual Enhancement'
  },
  {
    id: 'growth-booster',
    name: 'Growth Booster',
    description: 'Instant 5% growth boost',
    price: 80,
    icon: <Heart className="w-6 h-6" />,
    category: 'fertilizer',
    effect: '+5% Instant Growth'
  },
  {
    id: 'future-soil',
    name: 'Future Soil',
    description: 'Advanced soil from 2157',
    price: 120,
    icon: <Zap className="w-6 h-6" />,
    category: 'fertilizer',
    effect: '+15% Growth Speed'
  },
  {
    id: 'holographic-leaves',
    name: 'Holographic Leaves',
    description: 'Shimmering leaf decoration',
    price: 90,
    icon: <Palette className="w-6 h-6" />,
    category: 'decoration',
    effect: 'Holographic Effect'
  },
  // Backgrounds
  {
    id: 'bg-aurora',
    name: 'Aurora Sky',
    description: 'Ethereal gradients inspired by polar lights',
    price: 110,
    icon: <Palette className="w-6 h-6" />,
    category: 'background',
    effect: 'Aurora Gradient',
    backgroundTheme: 'from-fuchsia-100 to-cyan-100'
  },
  {
    id: 'bg-forest',
    name: 'Forest Glade',
    description: 'Deep greens and soft sunlight',
    price: 100,
    icon: <Palette className="w-6 h-6" />,
    category: 'background',
    effect: 'Forest Gradient',
    backgroundTheme: 'from-emerald-50 to-lime-100'
  },
  // Species unlocks
  {
    id: 'species-willow',
    name: 'Willow Species',
    description: 'Unlock the graceful Willow',
    price: 130,
    icon: <Palette className="w-6 h-6" />,
    category: 'species',
    effect: 'Unlock Willow',
    species: 'willow'
  },
  {
    id: 'species-cactus',
    name: 'Cactus Species',
    description: 'Unlock the resilient Cactus',
    price: 120,
    icon: <Palette className="w-6 h-6" />,
    category: 'species',
    effect: 'Unlock Cactus',
    species: 'cactus'
  }
];

const TecoShop: React.FC<TecoShopProps> = ({ tecoBalance, onPurchase }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fertilizer': return 'bg-secondary text-secondary-foreground';
      case 'decoration': return 'bg-accent text-accent-foreground';
      case 'protection': return 'bg-earth text-earth-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const canAfford = (price: number) => tecoBalance >= price;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-teco/20 to-accent/20">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <ShoppingBag className="w-7 h-7 text-teco" />
          Teco Shop
        </CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Coins className="w-5 h-5 text-teco" />
          <span className="text-lg font-bold text-teco">{tecoBalance} Teco</span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`h-full transition-all duration-200 hover:shadow-lg ${
                canAfford(item.price) ? 'border-teco/30' : 'opacity-60'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                      {item.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Zap className="w-4 h-4 text-teco" />
                    <span className="text-xs font-medium">{item.effect}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-teco" />
                      <span className="font-bold text-teco">{item.price}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={canAfford(item.price) ? "teco" : "outline"}
                      disabled={!canAfford(item.price)}
                      onClick={() => onPurchase(item)}
                    >
                      {canAfford(item.price) ? 'Buy' : 'Not enough Teco'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TecoShop;