'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  
  // Zen-inspired quotes
  const quotes = [
    "You're not behind. You're just early to your own clarity.",
    "The moment is already listening.",
    "Clarity comes from letting go, not holding on.",
    "Your thoughts are loops. We help untangle them.",
    "Breathe in possibility. Breathe out limitation.",
    "Each moment is a new beginning."
  ];
  
  // Smoothly cycle through quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteChanging(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsQuoteChanging(false);
      }, 500); // Wait for fade-out animation
    }, 8000); // Change quote every 8 seconds
    
    return () => clearInterval(interval);
  }, [quotes.length]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, -1, 1, -1, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };
  
  const quoteVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      transition: { duration: 0.5, ease: "easeIn" } 
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white overflow-hidden">
      <motion.div 
        className="flex flex-col items-center max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="mb-6 text-3xl font-bold text-center"
          variants={itemVariants}
        >
          Loopz
        </motion.h1>
        
        <motion.div 
          className="relative w-64 h-64 mb-8"
          variants={logoVariants}
          whileHover="hover"
        >
          <Image 
            src="/images/loopz-logo.png" 
            alt="Loopz Logo" 
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
        
        <div className="h-20 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentQuoteIndex}
              className="text-lg text-center text-gray-700"
              variants={quoteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {quotes[currentQuoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <motion.button
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAuth(!showAuth)}
          className="px-8 py-3 font-medium text-white bg-black rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Untangle Your Mind
        </motion.button>
      </motion.div>
      
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0, y: 30, height: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              height: 'auto',
              transition: { 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 30, 
              height: 0,
              transition: { 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            className="w-full max-w-md mt-12"
          >
            <AuthForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage; 