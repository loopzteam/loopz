'use client'

import { motion } from 'framer-motion'

interface TaskItemProps {
  id: string
  title: string
  isCompleted: boolean
  onToggle: (id: string) => void
}

export function TaskItem({ id, title, isCompleted, onToggle }: TaskItemProps) {
  return (
    <motion.div
      className="flex items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
      layout
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        className={`mr-3 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border ${
          isCompleted ? 'border-black bg-black' : 'border-gray-400'
        }`}
        onClick={() => onToggle(id)}
      >
        {isCompleted && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className={`flex-1 ${isCompleted ? 'text-gray-500 line-through' : ''}`}>
        {title}
      </span>
    </motion.div>
  )
}