import { z } from 'zod'
import { Database } from '@/types/db'
import { Task } from '@/features/tasks/task-types'

// Base database type
export type DBLoop = Database['public']['Tables']['loops']['Row']

// Loop status enum
export type LoopStatus = 'active' | 'completed' | 'archived'

// Extended domain model
export interface Loop extends Omit<DBLoop, 'updated_at'> {
  tasks?: Task[]
  progress_percentage?: number
  status: LoopStatus
  updated_at?: string
  completed_at?: string
}

// LoopWithProgress adds progress calculations to the Loop type
export interface LoopWithProgress extends Loop {
  progress: number
  totalSteps: number
  completedSteps: number
}

// Validation schema
export const loopSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable(),
  progress: z.number().min(0).max(100).nullable(),
  total_steps: z.number().min(0).nullable(),
  completed_steps: z.number().min(0).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: z.enum(['active', 'completed', 'archived']),
  completed_at: z.string().datetime().nullable().optional()
})

// Create input validation
export const createLoopSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tasks: z.array(z.string().min(1, 'Task title is required')).min(1, 'At least one task is required')
})

export type CreateLoopInput = z.infer<typeof createLoopSchema>

// Update input validation 
export const updateLoopSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional()
})

export type UpdateLoopInput = z.infer<typeof updateLoopSchema> 