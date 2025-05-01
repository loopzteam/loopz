'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { LoopSuggestion as LoopSuggestionType } from '@/features/ai/ai-types'

interface LoopSuggestionProps {
  suggestion: LoopSuggestionType
  onAccept: () => void
  onDecline: () => void
  isLoading?: boolean
}

export function LoopSuggestion({ 
  suggestion, 
  onAccept, 
  onDecline,
  isLoading = false
}: LoopSuggestionProps) {
  return (
    <motion.div
      className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h3 className="mb-2 text-lg font-medium">Create a loop for this?</h3>
      
      <div className="mb-4">
        <div className="mb-1 font-medium">Title:</div>
        <div className="rounded bg-white p-2">{suggestion.title}</div>
      </div>
      
      <div className="mb-4">
        <div className="mb-1 font-medium">Tasks:</div>
        <ul className="rounded bg-white p-2">
          {suggestion.tasks.map((task, index) => (
            <li key={index} className="mb-1 flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-black"></div>
              {task}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex space-x-2">
        <Button
          onClick={onAccept}
          className="flex-1"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Loop
        </Button>
        
        <Button
          variant="outline"
          onClick={onDecline}
          className="flex-1"
          disabled={isLoading}
        >
          Not Now
        </Button>
      </div>
    </motion.div>
  )
}