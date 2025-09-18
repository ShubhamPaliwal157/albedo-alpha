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

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-accent/20 to-primary/20 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary animate-pulse-gentle" />
            </div>
            <div>
              <CardTitle className="text-lg">{plantName}</CardTitle>
              <p className="text-sm text-muted-foreground">AI from 2157 • Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(600px-8rem)] px-4"> {/* Adjusted height */}
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
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-secondary text-secondary-foreground'
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
        <div className="p-4 border-t bg-background">
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