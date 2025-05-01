'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/features/ai/ai-types'

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold">Welcome to Loopz</h2>
        <p className="mt-2 text-gray-600">
          Share what&apos;s on your mind, and I&apos;ll help organize your thoughts into action.
        </p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col space-y-4 p-4">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isAI 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-black text-white'
              }`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}