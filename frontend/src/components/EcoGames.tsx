import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, Trophy, Star, Clock, Play, 
  Leaf, Recycle, Droplets, Sun, Wind,
  CheckCircle, XCircle, Grid3X3, TreePine,
  Zap, Target, Brain, Shuffle, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
  tecoReward: number;
  timeLimit?: number;
  category: string;
  type: 'quiz' | 'sorting' | 'wordle' | 'tetris' | 'minesweeper' | 'garden' | 'memory' | 'simulation';
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface WordleState {
  currentWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
}

interface MemoryCard {
  id: number;
  type: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

interface RecyclingItem {
  id: number;
  name: string;
  emoji: string;
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'electronic';
  bin: string;
}

interface GardenPlant {
  id: number;
  type: string;
  emoji: string;
  watered: boolean;
  grown: boolean;
  stage: number;
}

interface TetrisBlock {
  id: number;
  type: 'plastic' | 'paper' | 'glass' | 'metal';
  emoji: string;
  x: number;
  y: number;
}

interface MinesweeperCell {
  id: number;
  x: number;
  y: number;
  isPolluted: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const ecoGames: Game[] = [
  // Original 4 games (now working)
  {
    id: 'carbon-quiz',
    title: 'Carbon Footprint Quiz',
    description: 'Test your knowledge about carbon emissions and how to reduce them',
    icon: <Leaf className="w-6 h-6" />,
    difficulty: 'easy',
    tecoReward: 50,
    timeLimit: 300,
    category: 'Climate',
    type: 'quiz'
  },
  {
    id: 'recycling-sort',
    title: 'Recycling Sorter',
    description: 'Sort waste items into the correct recycling categories',
    icon: <Recycle className="w-6 h-6" />,
    difficulty: 'medium',
    tecoReward: 75,
    timeLimit: 180,
    category: 'Waste',
    type: 'sorting'
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation Challenge',
    description: 'Learn about water-saving techniques and their impact',
    icon: <Droplets className="w-6 h-6" />,
    difficulty: 'easy',
    tecoReward: 40,
    timeLimit: 240,
    category: 'Conservation',
    type: 'quiz'
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Match',
    description: 'Match renewable energy sources with their benefits',
    icon: <Sun className="w-6 h-6" />,
    difficulty: 'hard',
    tecoReward: 100,
    timeLimit: 420,
    category: 'Energy',
    type: 'memory'
  },
  
  // New eco-friendly games
  {
    id: 'green-wordle',
    title: 'Green Wordle',
    description: 'Guess the 5-letter eco-friendly word in 6 tries',
    icon: <Grid3X3 className="w-6 h-6" />,
    difficulty: 'medium',
    tecoReward: 60,
    timeLimit: 600,
    category: 'Word Game',
    type: 'wordle'
  },
  {
    id: 'recycling-tetris',
    title: 'Recycling Tetris',
    description: 'Sort falling waste into correct recycling bins',
    icon: <Zap className="w-6 h-6" />,
    difficulty: 'hard',
    tecoReward: 120,
    timeLimit: 300,
    category: 'Arcade',
    type: 'tetris'
  },
  {
    id: 'rapid-eco-mcq',
    title: 'Rapid Eco MCQ',
    description: 'Answer environmental questions as fast as you can',
    icon: <Target className="w-6 h-6" />,
    difficulty: 'medium',
    tecoReward: 80,
    timeLimit: 120,
    category: 'Speed Quiz',
    type: 'quiz'
  },
  {
    id: 'eco-minesweeper',
    title: 'Eco Minesweeper',
    description: 'Clear the forest of pollution without hitting toxic waste',
    icon: <TreePine className="w-6 h-6" />,
    difficulty: 'hard',
    tecoReward: 150,
    timeLimit: 480,
    category: 'Strategy',
    type: 'minesweeper'
  },
  {
    id: 'garden-simulation',
    title: 'Garden Simulation',
    description: 'Grow a sustainable garden by making eco-friendly choices',
    icon: <Leaf className="w-6 h-6" />,
    difficulty: 'medium',
    tecoReward: 90,
    timeLimit: 360,
    category: 'Simulation',
    type: 'garden'
  },
  {
    id: 'eco-memory',
    title: 'Eco Memory Match',
    description: 'Match pairs of environmental concepts and solutions',
    icon: <Brain className="w-6 h-6" />,
    difficulty: 'easy',
    tecoReward: 45,
    timeLimit: 240,
    category: 'Memory',
    type: 'memory'
  },
  {
    id: 'eco-village',
    title: 'Eco Village Builder',
    description: 'Build a sustainable community with renewable resources',
    icon: <Home className="w-6 h-6" />,
    difficulty: 'hard',
    tecoReward: 200,
    timeLimit: 600,
    category: 'Strategy',
    type: 'simulation'
  }
];

const quizQuestions: Record<string, QuizQuestion[]> = {
  'carbon-quiz': [
    {
      id: '1',
      question: 'Which transportation method has the lowest carbon footprint?',
      options: ['Car', 'Airplane', 'Bicycle', 'Bus'],
      correctAnswer: 2,
      explanation: 'Bicycles produce zero emissions and are the most environmentally friendly transportation option.'
    },
    {
      id: '2',
      question: 'What percentage of global greenhouse gas emissions come from agriculture?',
      options: ['10%', '24%', '35%', '50%'],
      correctAnswer: 1,
      explanation: 'Agriculture accounts for approximately 24% of global greenhouse gas emissions.'
    }
  ],
  'water-conservation': [
    {
      id: '1',
      question: 'How much water can a leaky faucet waste per day?',
      options: ['1 gallon', '10 gallons', '50 gallons', '100 gallons'],
      correctAnswer: 2,
      explanation: 'A single leaky faucet can waste up to 50 gallons of water per day.'
    }
  ],
  'rapid-eco-mcq': [
    {
      id: '1',
      question: 'What is the most abundant greenhouse gas?',
      options: ['CO2', 'Methane', 'Water Vapor', 'Nitrous Oxide'],
      correctAnswer: 2,
      explanation: 'Water vapor is the most abundant greenhouse gas in the atmosphere.'
    }
  ]
};

const EcoGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const questions = quizQuestions[selectedGame!.id] || [];
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    const questions = quizQuestions[selectedGame!.id] || [];
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameState('completed');
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameState('menu');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Game rendering for quiz games
  if (gameState === 'playing' && selectedGame) {
    if (selectedGame.type === 'quiz') {
      const questions = quizQuestions[selectedGame.id] || [];
      const question = questions[currentQuestion];
      
      if (!question) {
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Game Coming Soon!</h3>
              <p className="text-muted-foreground mb-4">
                This game is still in development. Check back later!
              </p>
              <Button onClick={resetGame}>Back to Games</Button>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {selectedGame.icon}
                {selectedGame.title}
              </CardTitle>
              <Button variant="outline" onClick={resetGame}>Exit</Button>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(selectedGame.difficulty)}>
                {selectedGame.difficulty}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Question {currentQuestion + 1}/{questions.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">{question.question}</div>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? (index === question.correctAnswer ? "default" : "destructive") : "outline"}
                  className="justify-start p-4 h-auto"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  {selectedAnswer === index && (
                    index === question.correctAnswer ? 
                      <CheckCircle className="w-5 h-5 ml-auto text-green-600" /> :
                      <XCircle className="w-5 h-5 ml-auto text-red-600" />
                  )}
                </Button>
              ))}
            </div>
            
            {showExplanation && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}
            
            {selectedAnswer !== null && (
              <div className="flex justify-center">
                <Button onClick={nextQuestion}>
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Game'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      );
    } else {
      // For other game types, show coming soon message
      return (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{selectedGame.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{selectedGame.title}</h3>
            <p className="text-muted-foreground mb-4">
              This game is coming soon! For now, enjoy our quiz games.
          