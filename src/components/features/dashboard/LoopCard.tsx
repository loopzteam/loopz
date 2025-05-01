'use client'

import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils/date'

interface LoopCardProps {
  id: string
  title: string
  description?: string | null
  progress?: number | null
  totalSteps?: number | null
  completedSteps?: number | null
  createdAt: string
  updatedAt: string
  onClick: (id: string) => void
}

export function LoopCard({
  id,
  title,
  description,
  progress = 0,
  totalSteps = 0,
  completedSteps = 0,
  updatedAt,
  onClick
}: LoopCardProps) {
  return (
    <motion.div 
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      
      {description && (
        <p className="mb-2 line-clamp-2 text-sm text-gray-600">{description}</p>
      )}
      
      {/* Progress bar */}
      <div className="mb-2 mt-3">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{completedSteps} of {totalSteps} tasks</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200">
          <div 
            className="h-full rounded-full bg-black"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="text-right text-xs text-gray-500">
        Updated {formatDate(updatedAt)}
      </div>
    </motion.div>
  )
}