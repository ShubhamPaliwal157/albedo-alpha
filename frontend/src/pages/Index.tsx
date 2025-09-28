import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Sparkles, Users, Target, ChevronRight, Leaf, Globe, Zap, Gamepad2, Award, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TreePine className="w-8 h-8" />,
      title: "AI Plant Companion",
      description: "Your personal tree from 2157 that teaches sustainability while growing with you over 2-3 years."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Gamified Learning",
      description: "Earn Teco coins through eco-games, quizzes, and daily environmental challenges."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "School Competitions",
      description: "Compete with classmates and schools nationwide in environmental awareness challenges."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Real-World Impact",
      description: "Track your environmental impact and see how small actions create massive change."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-green-900/20">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-emerald-200/50 dark:border-emerald-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Albedo
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 opacity-20"
          >
            <Leaf className="w-24 h-24 text-emerald-500" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 opacity-20"
          >
            <TreePine className="w-32 h-32 text-green-500" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-1/4"
          >
            <Sparkles className="w-16 h-16 text-teal-500" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="outline" className="mb-8 text-emerald-700 border-emerald-300 bg-emerald-50 px-6 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Environmental Education Platform
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Grow Your Future
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200 text-4xl md:text-5xl lg:text-6xl">
                Save Our Planet
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Meet your AI plant companion from 2157 and embark on an extraordinary journey of environmental discovery. 
              Learn sustainability through <span className="font-semibold text-emerald-600">11 interactive games</span>, 
              earn Teco coins, and make a real impact on our planet's future.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <Button 
                size="lg" 
                onClick={() => {
                  const base = (import.meta as any).env?.VITE_SERVER_BASE || 
                    (window.location.port === '5173' ? 'http://localhost:3000' : 'https://albedo-alpha.vercel.app');
                  const url = base.replace(/\/$/, '') + '/auth/google/start';
                  console.log('Redirecting to Google OAuth:', url);
                  window.location.href = url;
                }}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <TreePine className="w-5 h-5 mr-2" />
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="text-lg px-10 py-4 rounded-2xl border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Explore Games
              </Button>
            </motion.div>

            {/* Enhanced Hero Visual */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="relative mx-auto w-80 h-80 md:w-96 md:h-96"
            >
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-400/20 to-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Main tree */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <TreePine className="w-64 h-64 md:w-80 md:h-80 text-emerald-600" />
                  
                  {/* Floating particles */}
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-8 -right-8"
                  >
                    <Sparkles className="w-16 h-16 text-yellow-400" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-4 -left-6"
                  >
                    <Leaf className="w-12 h-12 text-green-500" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-16 -left-12"
                  >
                    <Heart className="w-8 h-8 text-red-400" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6">
              Why Choose Albedo?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Revolutionary gamified learning that makes environmental education engaging, impactful, and fun for students worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/25 transition-all duration-300"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Showcase */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-green-900/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6">
              11 Interactive Eco Games
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              From Green Wordle to Eco Minesweeper, experience environmental learning through engaging gameplay
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Gamepad2 className="w-8 h-8" />, name: "Green Wordle", color: "from-green-500 to-emerald-500" },
              { icon: <TreePine className="w-8 h-8" />, name: "Garden Sim", color: "from-emerald-500 to-green-600" },
              { icon: <Target className="w-8 h-8" />, name: "Eco Quiz", color: "from-teal-500 to-emerald-500" },
              { icon: <Zap className="w-8 h-8" />, name: "Tetris", color: "from-yellow-500 to-green-500" },
              { icon: <Users className="w-8 h-8" />, name: "Memory", color: "from-blue-500 to-emerald-500" },
              { icon: <Award className="w-8 h-8" />, name: "Village", color: "from-purple-500 to-green-500" }
            ].map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="group cursor-pointer"
              >
                <div className={`w-20 h-20 mx-auto mb-3 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {game.icon}
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {game.name}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Play All Games
              <Star className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6">
              Educational Impact
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Aligned with India's NEP 2020 and UN SDG goals for experiential environmental learning that creates lasting change
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/25 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Globe className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">70%</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">Increase in student engagement with gamified environmental learning</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/25 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: -10 }}
              >
                <Users className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">10,000+</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">Students ready to be reached across schools and colleges nationwide</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-teal-500/25 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Zap className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">2-3 Years</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">Long-term engagement with your growing AI plant companion</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <TreePine className="w-32 h-32 text-white" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Leaf className="w-24 h-24 text-white" />
          </div>
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Plant the Seeds of Change?
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students already growing their AI plant companions and learning to save our planet's future through interactive, gamified education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  const base = (import.meta as any).env?.VITE_SERVER_BASE || 
                    (window.location.port === '5173' ? 'http://localhost:3000' : 'https://albedo-alpha.vercel.app');
                  const url = base.replace(/\/$/, '') + '/auth/google/start';
                  console.log('Redirecting to Google OAuth:', url);
                  window.location.href = url;
                }}
                className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <TreePine className="w-5 h-5 mr-2" />
                Begin Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-12 py-4 rounded-2xl transition-all duration-300 font-semibold"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Explore Games
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Albedo</span>
          </div>
          <p className="text-gray-400 mb-4">Growing the future, one student at a time</p>
          <p className="text-sm text-gray-500">© 2024 Albedo. All rights reserved. Made with 💚 for our planet.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
