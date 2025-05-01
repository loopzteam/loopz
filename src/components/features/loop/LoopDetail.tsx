'use client'

import { useEffect } from 'react'
import { LoopHeader } from './LoopHeader'
import { TaskList } from './TaskList'
import { ConversationView } from '../conversation/ConversationView'
import { useLoopsStore } from '@/features/loops/use-loops-store'

interface LoopDetailProps {
  loopId?: string
  onBack: () => void
}

export function LoopDetail({ loopId, onBack }: LoopDetailProps) {
  const { getLoopById, fetchLoops, isLoading, error } = useLoopsStore()
  
  useEffect(() => {
    fetchLoops()
  }, [fetchLoops])
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <LoopHeader title="Loading..." onBack={onBack} />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black mx-auto"></div>
            <p>Loading loop details...</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex h-full flex-col">
        <LoopHeader title="Error" onBack={onBack} />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">Failed to load loop details</div>
            <button 
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => fetchLoops()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Not found state
  const loop = loopId ? getLoopById(loopId) : undefined
  if (loopId && !loop) {
    return (
      <div className="flex h-full flex-col">
        <LoopHeader title="Not Found" onBack={onBack} />
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">The loop you&apos;re looking for doesn&apos;t exist</p>
            <button 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              onClick={onBack}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  const loopTitle = loop?.title || 'Loop Details'
  
  return (
    <div className="flex h-full flex-col">
      <LoopHeader title={loopTitle} onBack={onBack} />
      
      <div className="flex h-full flex-col md:flex-row">
        {/* Task list */}
        <div className="border-b border-gray-200 md:w-2/5 md:overflow-y-auto md:border-b-0 md:border-r">
          <TaskList loopId={loopId} />
        </div>
        
        {/* Conversation */}
        <div className="flex-1 md:overflow-y-auto">
          <ConversationView />
        </div>
      </div>
    </div>
  )
}