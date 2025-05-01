'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoopCard } from './LoopCard'
import { useLoopsStore } from '@/features/loops/use-loops-store'
import { useTasksStore } from '@/features/tasks/use-tasks-store'
import { calculateLoopProgress } from '@/features/loops/loop-utils'

interface LoopListProps {
  onSelectLoop: (loopId: string) => void
}

export function LoopList({ onSelectLoop }: LoopListProps) {
  const { loops, isLoading: isLoopsLoading, fetchLoops, error } = useLoopsStore()
  const { getTasksByLoopId } = useTasksStore()
  
  useEffect(() => {
    fetchLoops()
  }, [fetchLoops])
  
  // Animation variants for staggered list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }
  
  // Calculate progress for each loop
  const loopsWithProgress = loops.map(loop => {
    const loopTasks = getTasksByLoopId(loop.id)
    const totalSteps = loopTasks.length
    const completedSteps = loopTasks.filter(task => task.status === 'completed').length
    const progress = calculateLoopProgress({ id: loop.id }, loopTasks)
    
    return {
      ...loop,
      progress,
      totalSteps,
      completedSteps
    }
  })
  
  // Error state
  if (isLoopsLoading && loops.length === 0) {
    return <div className="p-4 text-center">Loading loops...</div>
  }
  
  // Check for error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Failed to load loops</div>
        <button 
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => fetchLoops()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Empty state
  if (loops.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-60 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="font-medium text-gray-900 mb-1">No loops yet</h3>
        <p className="text-gray-500 mb-4">Create your first loop to get started</p>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Create Loop
        </button>
      </div>
    );
  }
  
  return (
    <motion.div
      className="space-y-4 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loopsWithProgress.map(loop => (
        <motion.div
          key={loop.id}
          variants={itemVariants}
        >
          <LoopCard
            id={loop.id}
            title={loop.title}
            description={loop.description}
            progress={loop.progress}
            totalSteps={loop.totalSteps}
            completedSteps={loop.completedSteps}
            createdAt={loop.created_at}
            updatedAt={loop.updated_at || loop.created_at}
            onClick={onSelectLoop}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}