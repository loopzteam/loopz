export type MessageRole = 'user' | 'assistant' | 'system'
export type MessagePhase = 'reflection' | 'clarification' | 'taskifier' | 'implementor' | 'guide' | 'breakdown' | null

export interface Message {
  id: string
  user_id: string
  loop_id?: string | null
  role: MessageRole
  phase?: MessagePhase
  content: string
  created_at: string
  updated_at?: string
}

export interface ChatMessage {
  id: string
  content: string
  isAI: boolean
  timestamp: Date
}

export interface AIResponse {
  reflection?: string
  coaching?: string
  shouldCreateLoopz?: boolean
  suggestedTitle?: string
  tasks?: string[]
}

export interface LoopSuggestion {
  title: string
  tasks: string[]
}

// Helper functions for converting between Message and ChatMessage
export function messageToChat(message: Message): ChatMessage {
  return {
    id: message.id,
    content: message.content,
    isAI: message.role === 'assistant',
    timestamp: new Date(message.created_at)
  }
}

export function chatToMessage(chat: ChatMessage, userId: string, loopId?: string): Message {
  return {
    id: chat.id,
    loop_id: loopId || null,
    user_id: userId,
    role: chat.isAI ? 'assistant' : 'user',
    phase: chat.isAI ? 'clarification' : 'reflection',
    content: chat.content,
    created_at: chat.timestamp.toISOString()
  }
}