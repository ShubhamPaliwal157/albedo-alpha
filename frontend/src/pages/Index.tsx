import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Sparkles, Users, Target, ChevronRight, Leaf, Globe, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 text-primary border-primary/30">
              <Leaf className="w-4 h-4 mr-2" />
              Environmental Education Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
              Grow Your
              <span className="block text-secondary"> AI Plant Companion</span>
              <span className="block text-accent"> Save the Future</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Meet your AI tree from 2157, when forests were nearly extinct. Together, you'll learn environmental protection 
              while growing a virtual companion that teaches sustainability through gamified experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                variant="eco"
                onClick={() => navigate('/dashboard')}
                className="text-lg px-8 py-4"
              >
                Start Growing
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>

            {/* Hero Plant Visual */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative mx-auto w-48 h-48 md:w-64 md:h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl"></div>
              <TreePine className="w-full h-full text-primary relative z-10 animate-float" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 z-20"
              >
                <Sparkles className="w-12 h-12 text-teco" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose EcoGrow?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Revolutionary gamified learning that makes environmental education engaging and impactful
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="text-center pb-3">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Educational Impact
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Aligned with India's NEP 2020 and SDG goals for experiential environmental learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-teco/20 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-teco" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">70%</h3>
              <p className="text-muted-foreground">Increase in student engagement with gamified learning</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-muted-foreground">Students ready to be reached across schools</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">2-3 Years</h3>
              <p className="text-muted-foreground">Long-term engagement with your growing AI companion</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Plant the Seeds of Change?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students already growing their AI plant companions and learning to save our planet's future.
            </p>
            <Button 
              size="lg" 
              variant="future"
              onClick={() => navigate('/dashboard')}
              className="text-lg px-12 py-4"
            >
              Begin Your Journey
              <TreePine className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
