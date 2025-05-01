'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6 text-6xl font-bold text-indigo-600"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Loopz
        </motion.div>
        <motion.p
          className="mb-8 text-xl text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Complete tasks faster with AI-powered loops.
          <br />
          Break down your goals and let AI guide you through each step.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}