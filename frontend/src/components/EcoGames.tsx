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
    },
    {
      id: '3',
      question: 'Which renewable energy source is most widely used globally?',
      options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
      correctAnswer: 2,
      explanation: 'Hydroelectric power is the most widely used renewable energy source worldwide.'
    }
  ],
  'water-conservation': [
    {
      id: '1',
      question: 'How much water can a leaky faucet waste per day?',
      options: ['1 gallon', '10 gallons', '50 gallons', '100 gallons'],
      correctAnswer: 2,
      explanation: 'A single leaky faucet can waste up to 50 gallons of water per day.'
    },
    {
      id: '2',
      question: 'What percentage of Earth\'s water is fresh water?',
      options: ['2.5%', '10%', '25%', '50%'],
      correctAnswer: 0,
      explanation: 'Only 2.5% of Earth\'s water is fresh water, making conservation crucial.'
    }
  ],
  'rapid-eco-mcq': [
    {
      id: '1',
      question: 'What is the most abundant greenhouse gas?',
      options: ['CO2', 'Methane', 'Water Vapor', 'Nitrous Oxide'],
      correctAnswer: 2,
      explanation: 'Water vapor is the most abundant greenhouse gas in the atmosphere.'
    },
    {
      id: '2',
      question: 'How long does plastic take to decompose?',
      options: ['10 years', '100 years', '500+ years', '50 years'],
      correctAnswer: 2,
      explanation: 'Plastic can take 500+ years to decompose, making recycling essential.'
    },
    {
      id: '3',
      question: 'Which country produces the most renewable energy?',
      options: ['USA', 'China', 'Germany', 'India'],
      correctAnswer: 1,
      explanation: 'China is the world\'s largest producer of renewable energy.'
    }
  ]
};

// Game data
const ecoWords = ['SOLAR', 'GREEN', 'PLANT', 'CLEAN', 'EARTH', 'OCEAN', 'TREES', 'RECYCLE', 'ENERGY', 'NATURE'];

const memoryPairs = [
  { type: 'solar', emoji: '☀️' },
  { type: 'wind', emoji: '💨' },
  { type: 'water', emoji: '💧' },
  { type: 'tree', emoji: '🌳' },
  { type: 'recycle', emoji: '♻️' },
  { type: 'leaf', emoji: '🍃' },
  { type: 'earth', emoji: '🌍' },
  { type: 'flower', emoji: '🌸' }
];

const recyclingItems: RecyclingItem[] = [
  { id: 1, name: 'Plastic Bottle', emoji: '🍼', type: 'plastic', bin: 'Plastic Bin' },
  { id: 2, name: 'Newspaper', emoji: '📰', type: 'paper', bin: 'Paper Bin' },
  { id: 3, name: 'Glass Jar', emoji: '🫙', type: 'glass', bin: 'Glass Bin' },
  { id: 4, name: 'Aluminum Can', emoji: '🥤', type: 'metal', bin: 'Metal Bin' },
  { id: 5, name: 'Apple Core', emoji: '🍎', type: 'organic', bin: 'Compost Bin' },
  { id: 6, name: 'Old Phone', emoji: '📱', type: 'electronic', bin: 'E-Waste Bin' },
  { id: 7, name: 'Cardboard Box', emoji: '📦', type: 'paper', bin: 'Paper Bin' },
  { id: 8, name: 'Plastic Bag', emoji: '🛍️', type: 'plastic', bin: 'Plastic Bin' }
];

const EcoGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Game-specific states
  const [wordleState, setWordleState] = useState<WordleState>({
    currentWord: '',
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing'
  });
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [recyclingGameItems, setRecyclingGameItems] = useState<RecyclingItem[]>([]);
  const [sortedItems, setSortedItems] = useState<Record<string, RecyclingItem[]>>({});
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);
  const [tetrisBlocks, setTetrisBlocks] = useState<TetrisBlock[]>([]);
  const [minesweeperGrid, setMinesweeperGrid] = useState<MinesweeperCell[]>([]);
  const [villageBuildings, setVillageBuildings] = useState<string[]>([]);
  
  const { toast } = useToast();

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    // Initialize game-specific states
    switch (game.type) {
      case 'wordle':
        initializeWordleGame();
        break;
      case 'memory':
        initializeMemoryGame();
        break;
      case 'sorting':
        initializeRecyclingGame();
        break;
      case 'garden':
        initializeGardenGame();
        break;
      case 'tetris':
        initializeTetrisGame();
        break;
      case 'minesweeper':
        initializeMinesweeperGame();
        break;
      case 'simulation':
        initializeVillageGame();
        break;
    }
    
    if (game.timeLimit) {
      setTimeLeft(game.timeLimit);
    }
  };

  // Game initialization functions
  const initializeWordleGame = () => {
    const randomWord = ecoWords[Math.floor(Math.random() * ecoWords.length)];
    setWordleState({
      currentWord: randomWord,
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing'
    });
  };

  const initializeMemoryGame = () => {
    const shuffledPairs = [...memoryPairs, ...memoryPairs]
      .map((pair, index) => ({
        id: index,
        type: pair.type,
        emoji: pair.emoji,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);
    setMemoryCards(shuffledPairs);
    setFlippedCards([]);
  };

  const initializeRecyclingGame = () => {
    const shuffledItems = [...recyclingItems].sort(() => Math.random() - 0.5).slice(0, 6);
    setRecyclingGameItems(shuffledItems);
    setSortedItems({
      plastic: [],
      paper: [],
      glass: [],
      metal: [],
      organic: [],
      electronic: []
    });
  };

  const initializeGardenGame = () => {
    setGardenPlants([
      { id: 1, type: 'tomato', emoji: '🍅', watered: false, grown: false, stage: 0 },
      { id: 2, type: 'carrot', emoji: '🥕', watered: false, grown: false, stage: 0 },
      { id: 3, type: 'lettuce', emoji: '🥬', watered: false, grown: false, stage: 0 },
      { id: 4, type: 'pepper', emoji: '🌶️', watered: false, grown: false, stage: 0 }
    ]);
  };

  const initializeTetrisGame = () => {
    setTetrisBlocks([]);
    setScore(0);
  };

  const initializeMinesweeperGame = () => {
    const grid: MinesweeperCell[] = [];
    const gridSize = 8;
    const pollutionCount = 10;
    
    // Create grid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid.push({
          id: y * gridSize + x,
          x,
          y,
          isPolluted: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0
        });
      }
    }
    
    // Add pollution randomly
    const pollutedCells = new Set<number>();
    while (pollutedCells.size < pollutionCount) {
      const randomIndex = Math.floor(Math.random() * grid.length);
      pollutedCells.add(randomIndex);
      grid[randomIndex].isPolluted = true;
    }
    
    // Calculate neighbor counts
    grid.forEach(cell => {
      if (!cell.isPolluted) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cell.x + dx;
            const ny = cell.y + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
              const neighbor = grid[ny * gridSize + nx];
              if (neighbor.isPolluted) count++;
            }
          }
        }
        cell.neighborCount = count;
      }
    });
    
    setMinesweeperGrid(grid);
  };

  const initializeVillageGame = () => {
    setVillageBuildings([]);
    setScore(0);
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
    setTimeLeft(0);
    
    // Reset game-specific states
    setWordleState({
      currentWord: '',
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing'
    });
    setMemoryCards([]);
    setFlippedCards([]);
    setRecyclingGameItems([]);
    setSortedItems({});
    setGardenPlants([]);
    setTetrisBlocks([]);
    setMinesweeperGrid([]);
    setVillageBuildings([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Game-specific handlers
  const handleWordleGuess = () => {
    if (wordleState.currentGuess.length !== 5) return;
    
    const newGuesses = [...wordleState.guesses, wordleState.currentGuess];
    const isCorrect = wordleState.currentGuess === wordleState.currentWord;
    const isGameOver = isCorrect || newGuesses.length >= 6;
    
    setWordleState({
      ...wordleState,
      guesses: newGuesses,
      currentGuess: '',
      gameStatus: isCorrect ? 'won' : isGameOver ? 'lost' : 'playing'
    });
    
    if (isGameOver) {
      setScore(isCorrect ? 100 : 0);
      setTimeout(() => setGameState('completed'), 1000);
    }
  };

  const handleMemoryCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (memoryCards[cardId].matched) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (memoryCards[first].type === memoryCards[second].type) {
        // Match found
        setTimeout(() => {
          setMemoryCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true, flipped: true }
              : card
          ));
          setFlippedCards([]);
          setScore(prev => prev + 10);
          
          // Check if game is complete
          const allMatched = memoryCards.every(card => 
            card.id === first || card.id === second || card.matched
          );
          if (allMatched) {
            setTimeout(() => setGameState('completed'), 500);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleRecyclingSort = (item: RecyclingItem, binType: string) => {
    if (item.type === binType) {
      setSortedItems(prev => ({
        ...prev,
        [binType]: [...prev[binType], item]
      }));
      setRecyclingGameItems(prev => prev.filter(i => i.id !== item.id));
      setScore(prev => prev + 10);
      
      if (recyclingGameItems.length === 1) {
        setTimeout(() => setGameState('completed'), 500);
      }
    } else {
      toast({ title: "Wrong bin!", description: `${item.name} doesn't go in the ${binType} bin.`, variant: "destructive" });
    }
  };

  const handlePlantWater = (plantId: number) => {
    setGardenPlants(prev => prev.map(plant => 
      plant.id === plantId 
        ? { ...plant, watered: true, grown: true, stage: plant.stage + 1 }
        : plant
    ));
    setScore(prev => prev + 20);
    
    if (gardenPlants.every(p => p.id === plantId || p.watered)) {
      setTimeout(() => setGameState('completed'), 500);
    }
  };

  const handleMinesweeperClick = (cellId: number) => {
    const cell = minesweeperGrid[cellId];
    if (cell.isRevealed || cell.isFlagged) return;
    
    if (cell.isPolluted) {
      toast({ title: "💀 Hit pollution!", description: "Game over!", variant: "destructive" });
      setScore(0);
      setTimeout(() => setGameState('completed'), 1000);
    } else {
      setMinesweeperGrid(prev => prev.map(c => 
        c.id === cellId ? { ...c, isRevealed: true } : c
      ));
      setScore(prev => prev + 5);
      
      // Check win condition
      const cleanCells = minesweeperGrid.filter(c => !c.isPolluted);
      const revealedCleanCells = cleanCells.filter(c => c.isRevealed || c.id === cellId);
      if (revealedCleanCells.length === cleanCells.length) {
        toast({ title: "🎉 Forest cleaned!", description: "You won!" });
        setTimeout(() => setGameState('completed'), 1000);
      }
    }
  };

  const handleVillageBuilding = (buildingType: string) => {
    setVillageBuildings(prev => [...prev, buildingType]);
    setScore(prev => prev + 30);
    
    if (villageBuildings.length >= 5) {
      setTimeout(() => setGameState('completed'), 500);
    }
  };

  // Render functions for different game types
  const renderQuizGame = () => {
    const questions = quizQuestions[selectedGame!.id] || [];
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
              {selectedGame!.icon}
              {selectedGame!.title}
            </CardTitle>
            <Button variant="outline" onClick={resetGame}>Exit</Button>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getDifficultyColor(selectedGame!.difficulty)}>
              {selectedGame!.difficulty}
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
  };

  const renderWordleGame = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="w-6 h-6" />
              Green Wordle
            </CardTitle>
            <Button variant="outline" onClick={resetGame}>Exit</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Guess the 5-letter eco-friendly word!
            </p>
          </div>
          
          {/* Previous guesses */}
          <div className="space-y-2">
            {wordleState.guesses.map((guess, index) => (
              <div key={index} className="flex gap-2 justify-center">
                {guess.split('').map((letter, letterIndex) => {
                  let bgColor = 'bg-gray-200';
                  if (wordleState.currentWord[letterIndex] === letter) {
                    bgColor = 'bg-green-500 text-white';
                  } else if (wordleState.currentWord.includes(letter)) {
                    bgColor = 'bg-yellow-500 text-white';
                  }
                  return (
                    <div key={letterIndex} className={`w-12 h-12 border-2 flex items-center justify-center font-bold ${bgColor}`}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Current guess input */}
          {wordleState.gameStatus === 'playing' && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="w-12 h-12 border-2 flex items-center justify-center font-bold bg-white">
                    {wordleState.currentGuess[index] || ''}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  value={wordleState.currentGuess}
                  onChange={(e) => setWordleState(prev => ({ 
                    ...prev, 
                    currentGuess: e.target.value.toUpperCase().slice(0, 5) 
                  }))}
                  className="px-3 py-2 border rounded text-center font-mono"
                  placeholder="Enter word"
                  maxLength={5}
                />
                <Button onClick={handleWordleGuess} disabled={wordleState.currentGuess.length !== 5}>
                  Guess
                </Button>
              </div>
            </div>
          )}
          
          {wordleState.gameStatus !== 'playing' && (
            <div className="text-center space-y-4">
              <div className={`text-lg font-bold ${
                wordleState.gameStatus === 'won' ? 'text-green-600' : 'text-red-600'
              }`}>
                {wordleState.gameStatus === 'won' ? '🎉 You Won!' : '😞 Game Over'}
              </div>
              <div>The word was: <strong>{wordleState.currentWord}</strong></div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMemoryGame = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Eco Memory Match
            </CardTitle>
            <Button variant="outline" onClick={resetGame}>Exit</Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {memoryCards.map((card) => (
              <Button
                key={card.id}
                variant="outline"
                className={`aspect-square text-2xl ${
                  card.flipped || card.matched || flippedCards.includes(card.id)
                    ? 'bg-primary/10' 
                    : 'bg-muted'
                }`}
                onClick={() => handleMemoryCardClick(card.id)}
                disabled={card.matched || flippedCards.includes(card.id)}
              >
                {card.flipped || card.matched || flippedCards.includes(card.id) 
                  ? card.emoji 
                  : '❓'
                }
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRecyclingGame = () => {
    const bins = ['plastic', 'paper', 'glass', 'metal', 'organic', 'electronic'];
    const binEmojis = { plastic: '🍼', paper: '📰', glass: '🫙', metal: '🥤', organic: '🍎', electronic: '📱' };
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="w-6 h-6" />
            Recycling Sorter
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center">Drag items to the correct recycling bins!</p>
          
          {/* Items to sort */}
          <div className="grid grid-cols-3 gap-4">
            {recyclingGameItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg bg-muted text-center">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {bins.slice(0, 4).map(bin => (
                    <Button
                      key={bin}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRecyclingSort(item, bin)}
                      className="text-xs"
                    >
                      {bin}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Recycling bins */}
          <div className="grid grid-cols-3 gap-4">
            {bins.slice(0, 6).map(bin => (
              <div key={bin} className="p-4 border-2 border-dashed rounded-lg text-center">
                <div className="text-2xl mb-2">{binEmojis[bin as keyof typeof binEmojis]}</div>
                <div className="text-sm font-medium capitalize">{bin} Bin</div>
                <div className="text-xs text-muted-foreground">
                  {sortedItems[bin]?.length || 0} items
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGardenGame = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="w-6 h-6" />
            Garden Simulation
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Water your plants to help them grow!</p>
          <div className="grid grid-cols-2 gap-4">
            {gardenPlants.map((plant) => (
              <div key={plant.id} className="p-4 border rounded-lg text-center">
                <div className="text-4xl mb-2">{plant.emoji}</div>
                <div className="text-sm mb-2 capitalize">{plant.type}</div>
                <div className="text-xs text-muted-foreground mb-3">
                  Stage: {plant.stage}/3
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handlePlantWater(plant.id)}
                  disabled={plant.watered}
                >
                  {plant.watered ? '✅ Watered' : '💧 Water'}
                </Button>
              </div>
            ))}
          </div>
          {gardenPlants.every(p => p.watered) && (
            <div className="text-center mt-4">
              <Button onClick={() => setGameState('completed')}>Harvest Garden</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTetrisGame = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Recycling Tetris
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="mb-4">
            <div className="text-6xl mb-2">🎮</div>
            <p>Sort falling waste blocks into recycling categories!</p>
          </div>
          
          {/* Game area */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['♻️ Plastic', '📰 Paper', '🫙 Glass', '🥤 Metal'].map((bin, index) => (
                <div key={index} className="p-4 border-2 border-dashed rounded-lg">
                  <div className="text-sm">{bin}</div>
                </div>
              ))}
            </div>
            
            {/* Falling blocks simulation */}
            <div className="h-32 bg-white rounded border-2 flex items-center justify-center">
              <div className="text-2xl">🍼</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {['Plastic', 'Paper', 'Glass', 'Metal'].map((type, index) => (
              <Button
                key={type}
                onClick={() => {
                  setScore(prev => prev + 20);
                  if (score >= 100) setGameState('completed');
                }}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMinesweeperGame = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="w-6 h-6" />
            Eco Minesweeper
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="mb-4">
            <div className="text-6xl mb-2">🌲</div>
            <p>Clear the forest of pollution without hitting toxic waste!</p>
          </div>
          
          <div className="grid grid-cols-8 gap-1 max-w-xs mx-auto">
            {minesweeperGrid.map((cell) => (
              <Button
                key={cell.id}
                variant="outline"
                className={`aspect-square p-0 text-xs ${
                  cell.isRevealed 
                    ? cell.isPolluted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-100'
                    : 'bg-muted'
                }`}
                onClick={() => handleMinesweeperClick(cell.id)}
                disabled={cell.isRevealed}
              >
                {cell.isRevealed 
                  ? cell.isPolluted 
                    ? '💀' 
                    : cell.neighborCount > 0 
                      ? cell.neighborCount 
                      : '🌱'
                  : '🌿'
                }
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderVillageGame = () => {
    const buildings = [
      { type: 'house', emoji: '🏠', name: 'Eco House' },
      { type: 'solar', emoji: '☀️', name: 'Solar Panel' },
      { type: 'wind', emoji: '💨', name: 'Wind Turbine' },
      { type: 'garden', emoji: '🌱', name: 'Community Garden' },
      { type: 'recycle', emoji: '♻️', name: 'Recycling Center' },
      { type: 'bike', emoji: '🚲', name: 'Bike Path' }
    ];
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            Eco Village Builder
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="mb-4">
            <div className="text-6xl mb-2">🏘️</div>
            <p>Build a sustainable community with renewable resources!</p>
          </div>
          
          {/* Built buildings */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {villageBuildings.map((building, index) => (
              <div key={index} className="p-2 bg-green-100 rounded-lg">
                <div className="text-2xl">
                  {buildings.find(b => b.type === building)?.emoji}
                </div>
              </div>
            ))}
          </div>
          
          {/* Available buildings */}
          <div className="grid grid-cols-3 gap-4">
            {buildings.map((building) => (
              <Button
                key={building.type}
                variant="outline"
                className="aspect-square text-2xl flex-col gap-2"
                onClick={() => handleVillageBuilding(building.type)}
                disabled={villageBuildings.includes(building.type)}
              >
                <div>{building.emoji}</div>
                <div className="text-xs">{building.name}</div>
              </Button>
            ))}
          </div>
          
          {villageBuildings.length >= 5 && (
            <div className="text-center mt-4">
              <Button onClick={() => setGameState('completed')}>Complete Village</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Game rendering
  if (gameState === 'playing' && selectedGame) {
    switch (selectedGame.type) {
      case 'quiz':
        return renderQuizGame();
      case 'wordle':
        return renderWordleGame();
      case 'memory':
        return renderMemoryGame();
      case 'sorting':
        return renderRecyclingGame();
      case 'garden':
        return renderGardenGame();
      case 'tetris':
        return renderTetrisGame();
      case 'minesweeper':
        return renderMinesweeperGame();
      case 'simulation':
        return renderVillageGame();
      default:
        return renderQuizGame();
    }
  }

  if (gameState === 'completed' && selectedGame) {
    const questions = quizQuestions[selectedGame.id] || [];
    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 100;
    const earnedReward = Math.floor((percentage / 100) * selectedGame.tecoReward);
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
          <p className="text-lg mb-4">
            Final Score: {score}/{questions.length || 1} ({Math.round(percentage)}%)
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">+{earnedReward} Teco Coins</span>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => startGame(selectedGame)} variant="outline">
              Play Again
            </Button>
            <Button onClick={resetGame}>Back to Games</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main game menu
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Eco Games</h2>
        <p className="text-muted-foreground">
          Play fun games while learning about environmental sustainability!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ecoGames.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startGame(game)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {game.icon}
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(game.difficulty)}>
                    {game.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-teco" />
                      <span className="text-sm font-medium">{game.tecoReward} Teco</span>
                    </div>
                    {game.timeLimit && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{Math.floor(game.timeLimit / 60)}m</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EcoGames;
