export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface Task {
  id: string
  loop_id: string
  user_id: string
  title: string
  description?: string
  status: TaskStatus
  order: number
  created_at: string
  updated_at?: string
  completed_at?: string
}

export interface CreateTaskInput {
  loop_id: string
  title: string
  description?: string
  order?: number
}

export interface UpdateTaskInput {
  id: string
  title?: string
  description?: string
  status?: TaskStatus
  order?: number
}

export interface ReorderTasksInput {
  loop_id: string
  taskIds: string[] // Array of task IDs in the new order
}