'use client'

import { LoopList } from './LoopList'
import { Button } from '@/components/ui/Button'

interface DashboardProps {
  onLoopSelect: (loopId: string) => void
  onSignOut: () => void
}

export function Dashboard({ onLoopSelect, onSignOut }: DashboardProps) {
  // Temporarily bypass authentication
  // const { signOut } = useAuth()
  
  const handleSignOut = () => {
    // signOut()
    onSignOut()
  }
  
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold">Your Loops</h1>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Loop List */}
      <div className="flex-1 overflow-y-auto">
        <LoopList onSelectLoop={onLoopSelect} />
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <Button className="w-full">
          Start New Conversation
        </Button>
      </div>
    </div>
  )
}