'use client'

import { Button } from '@/components/ui/Button'

interface LoopHeaderProps {
  title: string
  onBack: () => void
}

export function LoopHeader({ title, onBack }: LoopHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
    </div>
  )
}