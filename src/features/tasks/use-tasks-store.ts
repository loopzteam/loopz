'use client'

import { create } from 'zustand'
import { Task, TaskStatus } from './task-types'
import { v4 as uuidv4 } from 'uuid'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  
  // Actions
  createTask: (loopId: string, title: string, description?: string) => Promise<string>
  updateTask: (id: string, title?: string, description?: string, status?: TaskStatus) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  getTasksByLoopId: (loopId: string) => Task[]
  reorderTasks: (loopId: string, taskIds: string[]) => Promise<void>
  fetchTasksByLoopId: (loopId: string) => Promise<void>
}

export const useTasksStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  createTask: async (loopId, title, description) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      const existingTasks = get().tasks.filter(task => task.loop_id === loopId)
      const newTask: Task = {
        id: uuidv4(),
        loop_id: loopId,
        user_id: 'current-user', // This will be replaced with the actual user ID
        title,
        description: description || '',
        status: 'pending',
        order: existingTasks.length,
        created_at: new Date().toISOString(),
      }
      
      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }))
      
      return newTask.id
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  updateTask: async (id, title, description, status) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id 
            ? { 
                ...task, 
                title: title ?? task.title, 
                description: description ?? task.description, 
                status: status ?? task.status,
                updated_at: new Date().toISOString(),
                ...(status === 'completed' && task.status !== 'completed' 
                  ? { completed_at: new Date().toISOString() } 
                  : {})
              } 
            : task
        ),
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  deleteTask: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  getTasksByLoopId: (loopId) => {
    return get().tasks
      .filter(task => task.loop_id === loopId)
      .sort((a, b) => a.order - b.order)
  },
  
  reorderTasks: async (loopId, taskIds) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      set(state => ({
        tasks: state.tasks.map(task => 
          task.loop_id === loopId 
            ? { 
                ...task, 
                order: taskIds.indexOf(task.id),
                updated_at: new Date().toISOString()
              } 
            : task
        ),
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  fetchTasksByLoopId: async (loopId) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      // For now, just use dummy data based on the loop ID
      const dummyTasks: Task[] = []
      
      if (loopId === '1') { // Plan vacation to Japan
        dummyTasks.push(
          {
            id: '101',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Research best time to visit Japan',
            status: 'completed' as TaskStatus,
            order: 0,
            created_at: new Date(Date.now() - 9000000).toISOString(),
            completed_at: new Date(Date.now() - 8000000).toISOString()
          },
          {
            id: '102',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Create budget for the trip',
            status: 'completed' as TaskStatus,
            order: 1,
            created_at: new Date(Date.now() - 8500000).toISOString(),
            completed_at: new Date(Date.now() - 7000000).toISOString()
          },
          {
            id: '103',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Research transportation options',
            status: 'in_progress' as TaskStatus,
            order: 2,
            created_at: new Date(Date.now() - 8000000).toISOString()
          },
          {
            id: '104',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Book flights',
            status: 'pending' as TaskStatus,
            order: 3,
            created_at: new Date(Date.now() - 7500000).toISOString()
          },
          {
            id: '105',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Research accommodations',
            status: 'pending' as TaskStatus,
            order: 4,
            created_at: new Date(Date.now() - 7000000).toISOString()
          },
          {
            id: '106',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Book accommodations',
            status: 'pending' as TaskStatus,
            order: 5,
            created_at: new Date(Date.now() - 6500000).toISOString()
          },
          {
            id: '107',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Create itinerary',
            status: 'pending' as TaskStatus,
            order: 6,
            created_at: new Date(Date.now() - 6000000).toISOString()
          },
          {
            id: '108',
            loop_id: '1',
            user_id: 'current-user',
            title: 'Pack for the trip',
            status: 'pending' as TaskStatus,
            order: 7,
            created_at: new Date(Date.now() - 5500000).toISOString()
          }
        )
      } else if (loopId === '2') { // Learn TypeScript
        dummyTasks.push(
          {
            id: '201',
            loop_id: '2',
            user_id: 'current-user',
            title: 'Complete TypeScript basics tutorial',
            status: 'completed' as TaskStatus,
            order: 0,
            created_at: new Date(Date.now() - 19000000).toISOString(),
            completed_at: new Date(Date.now() - 15000000).toISOString()
          },
          {
            id: '202',
            loop_id: '2',
            user_id: 'current-user',
            title: 'Learn about TypeScript interfaces and types',
            status: 'completed' as TaskStatus,
            order: 1,
            created_at: new Date(Date.now() - 18000000).toISOString(),
            completed_at: new Date(Date.now() - 10000000).toISOString()
          },
          {
            id: '203',
            loop_id: '2',
            user_id: 'current-user',
            title: 'Practice with generics and utility types',
            status: 'completed' as TaskStatus,
            order: 2,
            created_at: new Date(Date.now() - 17000000).toISOString(),
            completed_at: new Date(Date.now() - 5000000).toISOString()
          },
          {
            id: '204',
            loop_id: '2',
            user_id: 'current-user',
            title: 'Build a small project with TypeScript',
            status: 'in_progress' as TaskStatus,
            order: 3,
            created_at: new Date(Date.now() - 16000000).toISOString()
          },
          {
            id: '205',
            loop_id: '2',
            user_id: 'current-user',
            title: 'Learn TypeScript with React',
            status: 'pending' as TaskStatus,
            order: 4,
            created_at: new Date(Date.now() - 15000000).toISOString()
          }
        )
      } else if (loopId === '3') { // Redesign personal website
        dummyTasks.push(
          {
            id: '301',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Analyze current website strengths and weaknesses',
            status: 'completed' as TaskStatus,
            order: 0,
            created_at: new Date(Date.now() - 29000000).toISOString(),
            completed_at: new Date(Date.now() - 25000000).toISOString()
          },
          {
            id: '302',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Research design trends for personal websites',
            status: 'in_progress' as TaskStatus,
            order: 1,
            created_at: new Date(Date.now() - 28000000).toISOString()
          },
          {
            id: '303',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Create wireframes for new design',
            status: 'pending' as TaskStatus,
            order: 2,
            created_at: new Date(Date.now() - 27000000).toISOString()
          },
          {
            id: '304',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Decide on technology stack',
            status: 'pending' as TaskStatus,
            order: 3,
            created_at: new Date(Date.now() - 26000000).toISOString()
          },
          {
            id: '305',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Design visual style (colors, typography, etc.)',
            status: 'pending' as TaskStatus,
            order: 4,
            created_at: new Date(Date.now() - 25000000).toISOString()
          },
          {
            id: '306',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Create high-fidelity mockups',
            status: 'pending' as TaskStatus,
            order: 5,
            created_at: new Date(Date.now() - 24000000).toISOString()
          },
          {
            id: '307',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Set up development environment',
            status: 'pending' as TaskStatus,
            order: 6,
            created_at: new Date(Date.now() - 23000000).toISOString()
          },
          {
            id: '308',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Implement new design',
            status: 'pending' as TaskStatus,
            order: 7,
            created_at: new Date(Date.now() - 22000000).toISOString()
          },
          {
            id: '309',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Optimize for performance and accessibility',
            status: 'pending' as TaskStatus,
            order: 8,
            created_at: new Date(Date.now() - 21000000).toISOString()
          },
          {
            id: '310',
            loop_id: '3',
            user_id: 'current-user',
            title: 'Launch new website',
            status: 'pending' as TaskStatus,
            order: 9,
            created_at: new Date(Date.now() - 20000000).toISOString()
          }
        )
      }
      
      // Merge with existing tasks from other loops
      const otherTasks = get().tasks.filter(task => task.loop_id !== loopId)
      set({ 
        tasks: [...otherTasks, ...dummyTasks],
        isLoading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  }
}))