import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'plant';
  timestamp: Date;
}

interface PlantChatProps {
  plantName: string;
  onClose: () => void;
}

const PlantChat: React.FC<PlantChatProps> = ({ plantName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${plantName}, your AI companion from the year 2157. In my time, trees have become nearly extinct due to climate change. I've traveled back to this era to help you learn about environmental protection. Together, we can change the future! 🌍✨`,
      sender: 'plant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate AI responses for demo (replace with actual GPT integration)
  const plantResponses = [
    "That's a great question! Did you know that a single tree can absorb up to 48 pounds of CO2 per year? 🌳",
    "In my time, we learned that small actions like recycling and using renewable energy made huge differences! ♻️",
    "The future depends on young eco-warriors like you! Every sustainable choice you make ripples through time. 🌊",
    "Want to earn some Teco coins? Try completing the water conservation quiz in the activities section! 💧",
    "I've seen the beauty of a restored Earth in my timeline. With your help, we can make it reality! 🌱",
    "Remember, even the smallest seed can grow into the mightiest tree. Just like your environmental actions! 🌰"
  ];

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    // edit, now replaced with actual API call
    try {
    const res = await fetch("/api/plantAI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: inputValue })
    });

    const data = await res.json();

    const plantResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: data.answer || "Sorry, I couldn't think of a response 🌱",
      sender: 'plant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, plantResponse]);
  } catch (err) {
    console.error("Error fetching AI response:", err);
  } finally {
    setIsTyping(false);
  }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch("/api/plantAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: inputValue,
          plantInfo: {
            plantName: plantName,
            plantType: "Future Tree",
            ownerName: "Caretaker",
            plantMood: "neutral",
            plantAge: "0",
            growthStage: "seedling"
          }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();

      const plantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "Sorry, I couldn't think of a response 🌱",
        sender: 'plant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, plantResponse]);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I'm having trouble connecting to my future knowledge. Can we try again? 🌱",
        sender: 'plant',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[80vh] max-h-[600px] flex flex-col"> {/* Updated height */}
      <CardHeader className="bg-gradient-to-r from-accent/20 to-primary/20 border-b py-3"> {/* Reduced padding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"> {/* Reduced size */}
              <Bot className="w-4 h-4 text-primary animate-pulse-gentle" />
            </div>
            <div>
              <CardTitle className="text-base">{plantName}</CardTitle> {/* Reduced text size */}
              <p className="text-xs text-muted-foreground">AI from 2157 • Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'plant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Bot className="w-4 h-4" />
                <span>Thinking...</span>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about environmental protection..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              variant="future"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantChat;