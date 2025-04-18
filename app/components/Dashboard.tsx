'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabase } from './SupabaseProvider';
import { useDashboard } from './DashboardContext';
import { useAI } from '../hooks/useAI';
import LoopDetail from './LoopDetail';

// Interface for messages
interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

// Interface for loop suggestion
interface LoopSuggestion {
  title: string;
  tasks?: string[];
}

// Interface for loops
interface Loop {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  // Hooks from Supabase and Dashboard context
  const { session, loading, supabase } = useSupabase();
  const { isDashboardVisible, setDashboardVisible } = useDashboard();
  const { isProcessing: aiProcessing, processInput } = useAI();
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Loop suggestion state
  const [loopSuggestion, setLoopSuggestion] = useState<LoopSuggestion | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  // User's loops state
  const [loops, setLoops] = useState<Loop[]>([]);
  const [loadingLoops, setLoadingLoops] = useState(true);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  
  // State for chat expanded
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Auto-scroll chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Set initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Hi there! What\'s on your mind today?',
          isAI: true,
          timestamp: new Date()
        }
      ]);
    }
  }, []);
  
  // Handle chat message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    // Expand chat when user sends a message
    setIsChatExpanded(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isAI: false,
      timestamp: new Date()
    };
    
    const userInput = inputValue.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Get last 5 messages for context
      const recentMessages = [...messages.slice(-5), userMessage];
      
      // Use OpenAI integration with chat history
      const aiResponse = await processInput(userInput, recentMessages);
      
      // Create AI message from response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.reflection,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // If AI suggests coaching advice, add it as a separate message
      if (aiResponse.coaching) {
        setTimeout(() => {
          const coachingMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: aiResponse.coaching,
            isAI: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, coachingMessage]);
        }, 1000);
      }
      
      // Check if AI suggests creating a loop
      if (aiResponse.shouldCreateLoopz && aiResponse.suggestedTitle) {
        setTimeout(() => {
          setLoopSuggestion({
            title: aiResponse.suggestedTitle || "New Loop",
            tasks: aiResponse.tasks
          });
          setShowSuggestion(true);
        }, 1500);
      } else {
        // Clear any existing suggestion
        setShowSuggestion(false);
        setLoopSuggestion(null);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble processing that right now. Can we try a different approach?",
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch user's loops
  useEffect(() => {
    const fetchLoops = async () => {
      if (!session) return;
      
      try {
        setLoadingLoops(true);
        const { data, error } = await supabase
          .from('loops')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setLoops(data || []);
      } catch (error) {
        console.error('Error fetching loops:', error);
      } finally {
        setLoadingLoops(false);
      }
    };
    
    fetchLoops();
    
    // Subscribe to changes
    const loopsSubscription = supabase
      .channel('loops-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'loops',
        filter: `user_id=eq.${session?.user.id}`
      }, (payload) => {
        fetchLoops();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(loopsSubscription);
    };
  }, [session, supabase]);

  // Handle creating a new loop
  const handleCreateLoop = async () => {
    if (!loopSuggestion || !session) return;
    
    try {
      // Insert new loop into Supabase
      const { data, error } = await supabase
        .from('loops')
        .insert([
          {
            title: loopSuggestion.title,
            user_id: session.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      // If there are suggested tasks, add them
      if (loopSuggestion.tasks && loopSuggestion.tasks.length > 0 && data && data[0]) {
        const loopId = data[0].id;
        
        const tasks = loopSuggestion.tasks.map((task, index) => ({
          loop_id: loopId,
          content: task,
          is_completed: false,
          order: index,
          created_at: new Date().toISOString()
        }));
        
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasks);
        
        if (tasksError) console.error('Error creating tasks:', tasksError);
        
        // Show the new loop
        setSelectedLoopId(loopId);
      }
      
      // Clear suggestion and add confirmation message
      setShowSuggestion(false);
      setLoopSuggestion(null);
      
      // Add confirmation message
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        content: `I've created a new loop called "${loopSuggestion.title}" for you.`,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      
    } catch (error) {
      console.error('Error creating loop:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I couldn't create the loop right now. Let's try again later.",
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Toggle chat expanded state
  const handleChatToggle = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  // Focus input when chat is expanded
  useEffect(() => {
    if (isChatExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatExpanded]);

  // Conditional rendering based on loading/session
  if (loading || !session || !isDashboardVisible) { 
    return null;
  }

  return (
    <>
      {/* Dashboard Panel - slides in from left */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed inset-y-0 left-0 w-[85%] bg-white shadow-lg flex flex-col z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Your Loopz</h1>
          <button
            onClick={handleSignOut}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>

        {/* Main Content (Loops) */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="font-medium text-sm text-gray-500 mb-3">My Loops</h2>
          
          {loadingLoops ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : loops.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No loops yet. Start a conversation to create one.</p>
          ) : (
            <div className="space-y-2">
              {loops.map(loop => (
                <div 
                  key={loop.id} 
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedLoopId(loop.id)}
                >
                  <h3 className="font-medium">{loop.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated {new Date(loop.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Chat Section */}
        <div className="border-t border-gray-100">
          {/* Expandable Chat Area */}
          <AnimatePresence>
            {isChatExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-gray-50 overflow-y-auto"
                style={{ maxHeight: '60vh' }}
              >
                <div className="p-4 space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`px-4 py-2 rounded-lg max-w-[85%] ${
                          message.isAI 
                            ? 'bg-white shadow-sm text-gray-800' 
                            : 'bg-black text-white'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Chat Input */}
          <div className="bg-white p-3 flex flex-col">
            <div onClick={handleChatToggle} className="text-center text-gray-400 text-xs mb-2 cursor-pointer">
              {isChatExpanded ? '▼ Collapse Chat' : '▲ Expand Chat'}
            </div>
            
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onClick={() => !isChatExpanded && setIsChatExpanded(true)}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                disabled={isProcessing}
                className="flex-1 p-2 border border-gray-100 rounded-l-lg focus:outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isProcessing}
                className="p-2 px-4 bg-black text-white rounded-r-lg disabled:bg-gray-300"
              >
                {isProcessing ? 'Thinking...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
      
      {/* Overlay to close dashboard - 15% on the right side */}
      <div 
        className="fixed inset-y-0 right-0 w-[15%] z-5 cursor-pointer" 
        onClick={() => setDashboardVisible(false)}
      />
      
      {/* Selected Loop Detail Overlay */}
      <AnimatePresence>
        {selectedLoopId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-20"
          >
            <LoopDetail 
              loopId={selectedLoopId} 
              onClose={() => setSelectedLoopId(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 