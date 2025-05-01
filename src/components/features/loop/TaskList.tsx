'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskItem } from './TaskItem'
import { useTasksStore } from '@/features/tasks/use-tasks-store'
import { TaskStatus } from '@/features/tasks/task-types'

interface TaskListProps {
  loopId?: string
}

export function TaskList({ loopId }: TaskListProps) {
  const { 
    isLoading, 
    fetchTasksByLoopId, 
    updateTask,
    getTasksByLoopId,
    error
  } = useTasksStore()
  
  useEffect(() => {
    if (loopId) {
      fetchTasksByLoopId(loopId)
    }
  }, [loopId, fetchTasksByLoopId])
  
  const loopTasks = loopId ? getTasksByLoopId(loopId) : []
  
  // Calculate progress
  const totalTasks = loopTasks.length
  const completedTasks = loopTasks.filter(task => task.status === 'completed').length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Toggle task completion
  const toggleTask = (taskId: string) => {
    const task = loopTasks.find(t => t.id === taskId)
    if (task) {
      const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed'
      updateTask(taskId, undefined, undefined, newStatus)
    }
  }
  
  // Loading state
  if (isLoading && loopTasks.length === 0) {
    return <div className="p-4 text-center">Loading tasks...</div>
  }
  
  // Check for error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Failed to load tasks</div>
        <button 
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => loopId && fetchTasksByLoopId(loopId)}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Empty state
  if (loopTasks.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-60 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-medium text-gray-900 mb-1">No tasks yet</h3>
        <p className="text-gray-500 mb-4">This loop doesn&apos;t have any tasks</p>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Add Task
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <motion.div
            className="h-2 rounded-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </div>
      
      {/* Task list */}
      <h2 className="mb-2 text-lg font-medium">Tasks</h2>
      <motion.div 
        className="space-y-3"
        layout
      >
        <AnimatePresence>
          {loopTasks.map(task => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              isCompleted={task.status === 'completed'}
              onToggle={toggleTask}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}