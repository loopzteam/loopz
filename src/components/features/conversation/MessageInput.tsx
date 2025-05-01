'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface MessageInputProps {
  onSend: (message: string) => void
  isDisabled?: boolean
  isLoading?: boolean
  placeholder?: string
}

export function MessageInput({
  onSend,
  isDisabled = false,
  isLoading = false,
  placeholder = "Type your message..."
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isDisabled || isLoading) return
    
    onSend(message)
    setMessage('')
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={isDisabled || isLoading}
        className="flex-1"
      />
      
      <Button
        type="submit"
        disabled={!message.trim() || isDisabled || isLoading}
        isLoading={isLoading}
      >
        Send
      </Button>
    </form>
  )
}