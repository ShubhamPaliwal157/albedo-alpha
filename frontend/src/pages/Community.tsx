import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Search, Trophy, Coins, QrCode, 
  MapPin, Calendar, Star, Crown, Shield, 
  ShoppingBag, Camera, Copy, Check, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import QRScanner from '@/components/QRScanner';
import { 
  getUserCommunities, 
  createCommunity, 
  joinCommunity, 
  getCommunity,
  getCurrencyIcons,
  getStoreItems,
  purchaseItem,
  updateCurrency,
  createDustbin,
  getCommunityDustbins,
  getLeaderboard,
  scanDustbin
} from '@/api/plantApi';

interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  admins: string[];
  currency: {
    name: string;
    icon: string;
  };
  memberBalances: Record<string, number>;
  leaderboard: Array<{
    userId: string;
    score: number;
    tecoCoins: number;
    communityCoins: number;
  }>;
}

const Community = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  const [syncing, setSyncing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [showDustbinDialog, setShowDustbinDialog] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [currencyIcons, setCurrencyIcons] = useState<string[]>([]);
  const [storeItems, setStoreItems] = useState<any>({});
  const [dustbins, setDustbins] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Form states
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [joinForm, setJoinForm] = useState({ code: '' });
  const [dustbinForm, setDustbinForm] = useState({ location: '', description: '' });

  useEffect(() => {
    // Load from localStorage first for immediate display
    const savedCommunities = localStorage.getItem('user-communities');
    if (savedCommunities) {
      try {
        const parsed = JSON.parse(savedCommunities);
        setCommunities(parsed);
        if (parsed.length > 0) {
          setSelectedCommunity(parsed[0]);
        }
      } catch (error) {
        console.error('Failed to parse saved communities:', error);
      }
    }

    // Then load fresh data
    loadCommunities(true); // Initial load
    loadCurrencyIcons();
    loadStoreItems();

    // Disable periodic refresh for now since test endpoints don't persist data
    // const interval = setInterval(() => {
    //   loadCommunities(false); // Periodic refresh
    // }, 60000);
    // setRefreshInterval(interval);

    // Cleanup on unmount
    return () => {
      // No cleanup needed since we disabled periodic refresh
    };
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      loadCommunityDetails();
    }
  }, [selectedCommunity]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const loadCommunities = async (isInitialLoad = false) => {
    // For now, prioritize localStorage over server data since test endpoints don't persist
    try {
      const savedCommunities = localStorage.getItem('user-communities');
      if (savedCommunities) {
        const parsed = JSON.parse(savedCommunities);
        setCommunities(parsed);
        
        // Set selected community if none is selected
        if (parsed.length > 0 && !selectedCommunity) {
          setSelectedCommunity(parsed[0]);
        }
        
        // If selected community is no longer in the list, select the first one
        if (selectedCommunity && !parsed.find((c: Community) => c.id === selectedCommunity.id)) {
          setSelectedCommunity(parsed[0] || null);
        }
        
        setLoading(false);
        return; // Use localStorage data primarily
      }
    } catch (error) {
      console.error('Failed to parse saved communities:', error);
    }

    // Fallback to server data only if no localStorage data exists
    try {
      const response = await getUserCommunities();
      const newCommunities = response.communities || [];
      
      setCommunities(newCommunities);
      localStorage.setItem('user-communities', JSON.stringify(newCommunities));
      
      if (newCommunities.length > 0 && !selectedCommunity) {
        setSelectedCommunity(newCommunities[0]);
      }
    } catch (error) {
      console.error('Failed to load communities from server:', error);
      if (loading) {
        toast({
          title: "Error",
          description: "Failed to load communities",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityDetails = async () => {
    if (!selectedCommunity) return;
    
    // For mock communities, use the data that's already in the community object
    try {
      // Use mock data from the community object itself
      setDustbins(selectedCommunity.dustbins || []);
      setLeaderboard(selectedCommunity.leaderboard || []);
      
      // Don't make server calls for mock communities since they don't exist on the server
      console.log('Loaded community details for:', selectedCommunity.name);
    } catch (error) {
      console.error('Failed to load community details:', error);
    }
  };

  const loadCurrencyIcons = async () => {
    try {
      const response = await getCurrencyIcons();
      setCurrencyIcons(response.icons || []);
    } catch (error) {
      console.error('Failed to load currency icons:', error);
    }
  };

  const loadStoreItems = async () => {
    try {
      const response = await getStoreItems();
      setStoreItems(response.items || {});
    } catch (error) {
      console.error('Failed to load store items:', error);
    }
  };

  const handleCreateCommunity = async () => {
    if (!createForm.name.trim()) return;

    setSyncing(true);
    try {
      // Create a mock community for now since backend test endpoints don't persist
      const mockCommunity: Community = {
        id: generateCommunityCode(),
        name: createForm.name,
        description: createForm.description,
        creatorId: 'current-user',
        createdAt: Date.now(),
        members: ['current-user'],
        admins: ['current-user'],
        currency: {
          name: 'EcoCoins',
          icon: '🪙'
        },
        memberBalances: {
          'current-user': 1000
        },
        events: [],
        dustbins: [],
        customTasks: [],
        leaderboard: [
          { userId: 'current-user', score: 0, tecoCoins: 0, communityCoins: 1000 }
        ]
      };

      const newCommunities = [...communities, mockCommunity];
      
      setCommunities(newCommunities);
      setSelectedCommunity(mockCommunity);
      
      // Save to localStorage
      localStorage.setItem('user-communities', JSON.stringify(newCommunities));
      
      setCreateForm({ name: '', description: '' });
      setShowCreateDialog(false);
      toast({
        title: "Success!",
        description: `Community "${mockCommunity.name}" created successfully!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  // Helper function to generate community codes
  const generateCommunityCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure uniqueness by checking existing communities
    const existingCodes = communities.map(c => c.id);
    while (existingCodes.includes(result)) {
      result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    return result;
  };

  const handleJoinCommunity = async () => {
    if (!joinForm.code.trim()) return;

    const codeToJoin = joinForm.code.toUpperCase();
    
    // Check if already a member of this community
    const existingCommunity = communities.find(c => c.id === codeToJoin);
    if (existingCommunity) {
      toast({
        title: "Already a member",
        description: `You're already a member of ${existingCommunity.name}`,
        variant: "destructive"
      });
      setSyncing(false);
      return;
    }

    setSyncing(true);
    try {
      // For demo purposes, create a mock community to join
      const mockCommunity: Community = {
        id: codeToJoin,
        name: `Community ${codeToJoin}`,
        description: 'A demo community for testing',
        creatorId: 'demo-user',
        createdAt: Date.now() - 86400000, // 1 day ago
        members: ['demo-user', 'current-user'],
        admins: ['demo-user'],
        currency: {
          name: 'GreenCoins',
          icon: '🌿'
        },
        memberBalances: {
          'demo-user': 2000,
          'current-user': 500
        },
        events: [],
        dustbins: [],
        customTasks: [],
        leaderboard: [
          { userId: 'demo-user', score: 150, tecoCoins: 300, communityCoins: 2000 },
          { userId: 'current-user', score: 0, tecoCoins: 0, communityCoins: 500 }
        ]
      };

      const newCommunities = [...communities, mockCommunity];
      
      setCommunities(newCommunities);
      setSelectedCommunity(mockCommunity);
      
      // Save to localStorage
      localStorage.setItem('user-communities', JSON.stringify(newCommunities));
      
      setJoinForm({ code: '' });
      setShowJoinDialog(false);
      toast({
        title: "Success!",
        description: `Joined "${mockCommunity.name}" successfully!`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join community",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateDustbin = async () => {
    if (!selectedCommunity || !dustbinForm.location.trim()) return;

    try {
      // Create a mock dustbin for the community
      const mockDustbin = {
        id: `dustbin-${Date.now()}`,
        communityCode: selectedCommunity.id,
        location: dustbinForm.location,
        description: dustbinForm.description,
        createdBy: 'current-user',
        createdAt: Date.now(),
        scannedBy: [],
        dailyScans: {},
        qrCode: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" font-size="8">QR Code</text></svg>`)}`
      };

      // Update the selected community with the new dustbin
      const updatedCommunity = {
        ...selectedCommunity,
        dustbins: [...(selectedCommunity.dustbins || []), mockDustbin.id]
      };

      // Update communities list
      const updatedCommunities = communities.map(c => 
        c.id === selectedCommunity.id ? updatedCommunity : c
      );

      setCommunities(updatedCommunities);
      setSelectedCommunity(updatedCommunity);
      setDustbins([...dustbins, mockDustbin]);
      
      // Save to localStorage
      localStorage.setItem('user-communities', JSON.stringify(updatedCommunities));
      
      setDustbinForm({ location: '', description: '' });
      setShowDustbinDialog(false);
      toast({
        title: "Success!",
        description: "Dustbin created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create dustbin",
        variant: "destructive"
      });
    }
  };

  const handlePurchaseItem = async (category: string, itemId: string) => {
    if (!selectedCommunity) return;

    try {
      // Find the item details from store items
      const item = storeItems[category]?.find((i: any) => i.id === itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      const userBalance = selectedCommunity.memberBalances['current-user'] || 0;
      if (userBalance < item.price) {
        throw new Error('Insufficient community coins');
      }

      // Update community with purchase
      const updatedCommunity = {
        ...selectedCommunity,
        memberBalances: {
          ...selectedCommunity.memberBalances,
          'current-user': userBalance - item.price
        }
      };

      // Update communities list
      const updatedCommunities = communities.map(c => 
        c.id === selectedCommunity.id ? updatedCommunity : c
      );

      setCommunities(updatedCommunities);
      setSelectedCommunity(updatedCommunity);
      
      // Save to localStorage
      localStorage.setItem('user-communities', JSON.stringify(updatedCommunities));

      toast({
        title: "Success!",
        description: `Purchased ${item.name} for ${item.price} ${selectedCommunity.currency.icon}!`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to purchase item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCommunity = async (communityToDelete: Community) => {
    try {
      // Remove community from the list
      const updatedCommunities = communities.filter(c => c.id !== communityToDelete.id);
      
      setCommunities(updatedCommunities);
      
      // If the deleted community was selected, select another one or null
      if (selectedCommunity?.id === communityToDelete.id) {
        setSelectedCommunity(updatedCommunities.length > 0 ? updatedCommunities[0] : null);
      }
      
      // Save to localStorage
      localStorage.setItem('user-communities', JSON.stringify(updatedCommunities));
      
      toast({
        title: "Community Deleted",
        description: `"${communityToDelete.name}" has been removed from your communities.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied!",
      description: "Community code copied to clipboard"
    });
  };

  const getCurrentUserBalance = () => {
    if (!selectedCommunity) return 0;
    // In a real app, you'd get the current user ID from auth context
    const userId = 'current-user'; // This should come from your auth context
    return selectedCommunity.memberBalances[userId] || 0;
  };

  const isAdmin = () => {
    if (!selectedCommunity) return false;
    const userId = 'current-user'; // This should come from your auth context
    return selectedCommunity.admins.includes(userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-2 sm:p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 flex items-center gap-2 sm:gap-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
            Communities
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Join eco-communities, earn rewards, and make a difference together!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="eco" size="lg" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Create Community</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Community Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                />
                <Button onClick={handleCreateCommunity} className="w-full" disabled={syncing}>
                  {syncing ? 'Creating...' : 'Create Community'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Join Community</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter Community Code"
                  value={joinForm.code}
                  onChange={(e) => setJoinForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                />
                <Button onClick={handleJoinCommunity} className="w-full" disabled={syncing}>
                  {syncing ? 'Joining...' : 'Join Community'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            size="lg"
            onClick={() => setShowQRScanner(true)}
            className="w-full sm:w-auto"
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Scan QR</span>
          </Button>
        </div>

        {communities.length === 0 ? (
          <Card className="text-center p-4 sm:p-8">
            <CardContent>
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Communities Yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Create your first community or join an existing one to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Community List - Mobile: Horizontal scroll, Desktop: Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">My Communities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Mobile: Horizontal scrolling */}
                  <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                    {communities.map((community) => (
                      <div key={community.id} className="flex-shrink-0 lg:flex-shrink-0 lg:w-full flex items-center gap-1 min-w-[140px] lg:min-w-0">
                        <Button
                          variant={selectedCommunity?.id === community.id ? "default" : "ghost"}
                          className="flex-1 justify-start"
                          onClick={() => setSelectedCommunity(community)}
                        >
                          <span className="mr-2">{community.currency.icon}</span>
                          <span className="truncate">{community.name}</span>
                        </Button>
                        
                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Community</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{community.name}"? This action cannot be undone and will remove the community from your list.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCommunity(community)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedCommunity && (
                <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
                  <TabsList className={`grid w-full ${isAdmin() ? 'grid-cols-5' : 'grid-cols-4'} text-xs sm:text-sm`}>
                    <TabsTrigger value="overview" className="px-2 sm:px-3">
                      <span className="hidden sm:inline">Overview</span>
                      <span className="sm:hidden">Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="store" className="px-2 sm:px-3">Store</TabsTrigger>
                    <TabsTrigger value="leaderboard" className="px-2 sm:px-3">
                      <span className="hidden sm:inline">Leaderboard</span>
                      <span className="sm:hidden">Ranks</span>
                    </TabsTrigger>
                    <TabsTrigger value="dustbins" className="px-2 sm:px-3">
                      <span className="hidden sm:inline">Dustbins</span>
                      <span className="sm:hidden">QR</span>
                    </TabsTrigger>
                    {isAdmin() && <TabsTrigger value="admin" className="px-2 sm:px-3">Admin</TabsTrigger>}
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                              <span className="text-xl sm:text-2xl">{selectedCommunity.currency.icon}</span>
                              <span className="truncate">{selectedCommunity.name}</span>
                            </CardTitle>
                            {selectedCommunity.description && (
                              <p className="text-sm text-muted-foreground mt-1">{selectedCommunity.description}</p>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(selectedCommunity.id)}
                              className="text-xs"
                            >
                              {copiedCode === selectedCommunity.id ? (
                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              <span className="ml-1">{selectedCommunity.id}</span>
                            </Button>
                            <Badge variant="secondary" className="text-xs">
                              {selectedCommunity.members.length} members
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <Card className="bg-gradient-to-br from-teco/10 to-teco/5">
                            <CardContent className="p-3 sm:p-4 text-center">
                              <Coins className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-teco" />
                              <p className="text-lg sm:text-2xl font-bold text-teco">
                                {getCurrentUserBalance()}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                {selectedCommunity.currency.name}
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                            <CardContent className="p-3 sm:p-4 text-center">
                              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                              <p className="text-lg sm:text-2xl font-bold text-primary">
                                #{leaderboard.findIndex(entry => entry.userId === 'current-user') + 1 || 'N/A'}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Rank</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                            <CardContent className="p-3 sm:p-4 text-center">
                              <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-secondary" />
                              <p className="text-lg sm:text-2xl font-bold text-secondary">
                                {selectedCommunity.members.length}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Members</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Store Tab */}
                  <TabsContent value="store" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingBag className="w-6 h-6" />
                          Community Store
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="avatarDecorations">
                          <TabsList>
                            <TabsTrigger value="avatarDecorations">Avatar</TabsTrigger>
                            <TabsTrigger value="nameplates">Nameplates</TabsTrigger>
                            <TabsTrigger value="plantDecorations">Plant Decor</TabsTrigger>
                          </TabsList>
                          
                          {Object.entries(storeItems).map(([category, items]: [string, any]) => (
                            <TabsContent key={category} value={category}>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {items?.map((item: any) => (
                                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-3 sm:p-4">
                                      <div className="text-center mb-3">
                                        {item.icon && <span className="text-2xl sm:text-3xl">{item.icon}</span>}
                                        {item.color && (
                                          <div 
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mx-auto"
                                            style={{ backgroundColor: item.color }}
                                          />
                                        )}
                                      </div>
                                      <h3 className="font-semibold text-center text-sm sm:text-base">{item.name}</h3>
                                      <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 line-clamp-2">
                                        {item.description}
                                      </p>
                                      <div className="flex items-center justify-between gap-2">
                                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                                          {item.price} {selectedCommunity.currency.icon}
                                        </Badge>
                                        <Button
                                          size="sm"
                                          onClick={() => handlePurchaseItem(category, item.id)}
                                          disabled={getCurrentUserBalance() < item.price}
                                          className="text-xs px-2 sm:px-3"
                                        >
                                          Buy
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Leaderboard Tab */}
                  <TabsContent value="leaderboard">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="w-6 h-6" />
                          Leaderboard
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {leaderboard.map((entry, index) => (
                            <div
                              key={entry.userId}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                index === 1 ? 'bg-gray-50 border border-gray-200' :
                                index === 2 ? 'bg-orange-50 border border-orange-200' :
                                'bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-semibold">{entry.userId}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {entry.tecoCoins} Teco • {entry.communityCoins} {selectedCommunity.currency.name}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{entry.score}</p>
                                <p className="text-sm text-muted-foreground">Total Score</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Dustbins Tab */}
                  <TabsContent value="dustbins">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-6 h-6" />
                          Community Dustbins
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dustbins.map((dustbin) => (
                            <Card key={dustbin.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-semibold">{dustbin.location}</h3>
                                    <p className="text-sm text-muted-foreground">{dustbin.description}</p>
                                  </div>
                                  <QrCode className="w-6 h-6 text-muted-foreground" />
                                </div>
                                {dustbin.qrCode && (
                                  <img 
                                    src={dustbin.qrCode} 
                                    alt="QR Code" 
                                    className="w-full max-w-32 mx-auto"
                                  />
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Admin Tab */}
                  {isAdmin() && (
                    <TabsContent value="admin">
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="w-6 h-6" />
                              Admin Panel
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Dialog open={showDustbinDialog} onOpenChange={setShowDustbinDialog}>
                              <DialogTrigger asChild>
                                <Button>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Dustbin
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Create New Dustbin</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Input
                                    placeholder="Location"
                                    value={dustbinForm.location}
                                    onChange={(e) => setDustbinForm(prev => ({ ...prev, location: e.target.value }))}
                                  />
                                  <Textarea
                                    placeholder="Description"
                                    value={dustbinForm.description}
                                    onChange={(e) => setDustbinForm(prev => ({ ...prev, description: e.target.value }))}
                                  />
                                  <Button onClick={handleCreateDustbin} className="w-full">
                                    Create Dustbin
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              )}
            </div>
          </div>
        )}

        {/* QR Scanner */}
        <QRScanner 
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={(result) => {
            console.log('QR Scan result:', result);
            // Refresh community data if needed
            if (selectedCommunity) {
              loadCommunityDetails();
            }
          }}
        />
      </div>
    </div>
  );
};

export default Community;
