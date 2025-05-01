'use client'

import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/features/auth/auth-provider'
import { AIResponse, ChatMessage, LoopSuggestion } from './ai-types'

export function useAIConversation() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<LoopSuggestion | null>(null)

  // Process a user message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user) return
    
    try {
      setIsProcessing(true)
      setError(null)
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        isAI: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      
      // For now, simulate API call with a delay
      // In a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate AI response
      const aiResponse: AIResponse = {
        reflection: `I understand you're thinking about "${content}". That's an interesting topic to explore.`,
        coaching: "Have you considered breaking this down into smaller steps?",
        shouldCreateLoopz: Math.random() > 0.5,
        suggestedTitle: `Exploring ${content.split(' ').slice(0, 3).join(' ')}...`,
        tasks: [
          "Research more about this topic",
          "Create a simple plan",
          "Consider different approaches"
        ]
      }
      
      // Add AI message to chat
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: `${aiResponse.reflection}\n\n${aiResponse.coaching || ''}`,
        isAI: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Set loop suggestion if AI thinks we should create one
      if (aiResponse.shouldCreateLoopz && aiResponse.suggestedTitle && aiResponse.tasks) {
        setSuggestion({
          title: aiResponse.suggestedTitle,
          tasks: aiResponse.tasks
        })
      }
    } catch (err) {
      console.error('Error in AI conversation:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }, [user])
  
  // Create a loop from the current suggestion
  const createLoop = useCallback(async () => {
    if (!suggestion || !user) return
    
    try {
      setIsProcessing(true)
      
      // For now, simulate API call with a delay
      // In a real app, this would call your API to create a loop
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success! Clear the suggestion
      setSuggestion(null)
      
      // Add a success message
      const successMessage: ChatMessage = {
        id: uuidv4(),
        content: `Great! I've created a loop called "${suggestion.title}" with ${suggestion.tasks.length} tasks.`,
        isAI: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, successMessage])
    } catch (err) {
      console.error('Error creating loop:', err)
      setError(err instanceof Error ? err.message : 'Failed to create loop')
    } finally {
      setIsProcessing(false)
    }
  }, [suggestion, user])
  
  // Clear current suggestion
  const clearSuggestion = useCallback(() => {
    setSuggestion(null)
  }, [])
  
  return {
    messages,
    isProcessing,
    error,
    suggestion,
    sendMessage,
    createLoop,
    clearSuggestion
  }
}