import { Loop } from '@/models/loop'
import { Task } from '@/features/tasks/task-types'

/**
 * Calculate progress percentage for a loop based on completed tasks
 * @param loop The loop object
 * @param tasks Array of tasks for the loop, if not provided in loop.tasks
 * @returns Progress percentage (0-100)
 */
export function calculateLoopProgress(
  loop: Loop | { id: string },
  tasks?: Task[]
): number {
  // If we have total_steps and completed_steps on the loop directly, use those
  if ('total_steps' in loop && 'completed_steps' in loop) {
    if (!loop.total_steps || loop.total_steps === 0) return 0
    return Math.round(((loop.completed_steps || 0) / loop.total_steps) * 100)
  }
  
  // Otherwise calculate from the tasks array
  const loopTasks = tasks || ('tasks' in loop && Array.isArray(loop.tasks) ? loop.tasks : [])
  if (!loopTasks || loopTasks.length === 0) return 0
  
  const totalTasks = loopTasks.length
  const completedTasks = loopTasks.filter(task => 
    'status' in task ? task.status === 'completed' : task.is_completed
  ).length
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
}