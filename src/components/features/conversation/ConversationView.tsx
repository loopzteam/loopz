'use client'

import { AnimatePresence } from 'framer-motion'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { LoopSuggestion } from './LoopSuggestion'
import { useAIConversation } from '@/features/ai/use-ai-conversation'

export function ConversationView() {
  const {
    messages,
    isProcessing,
    error,
    suggestion,
    sendMessage,
    createLoop,
    clearSuggestion
  } = useAIConversation()
  
  return (
    <div className="flex h-full flex-col">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      
      {/* Loop suggestion - conditionally shown */}
      <AnimatePresence>
        {suggestion && (
          <div className="border-t border-gray-200 p-4">
            <LoopSuggestion
              suggestion={suggestion}
              onAccept={createLoop}
              onDecline={clearSuggestion}
              isLoading={isProcessing}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <MessageInput
          onSend={sendMessage}
          isLoading={isProcessing}
          isDisabled={false}
          placeholder="Share what's on your mind..."
        />
      </div>
    </div>
  )
}