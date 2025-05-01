'use client'

import { create } from 'zustand'
import { Loop, LoopStatus, LoopWithProgress } from '@/models/loop'
import { v4 as uuidv4 } from 'uuid'
import { calculateLoopProgress } from './loop-utils'

interface LoopState {
  loops: Loop[]
  isLoading: boolean
  error: string | null
  
  // Actions
  createLoop: (title: string, description?: string) => Promise<string>
  updateLoop: (id: string, title?: string, description?: string, status?: LoopStatus) => Promise<void>
  deleteLoop: (id: string) => Promise<void>
  getLoopById: (id: string) => Loop | undefined
  getLoopWithProgress: (id: string) => LoopWithProgress | undefined
  fetchLoops: () => Promise<void>
}

export const useLoopsStore = create<LoopState>((set, get) => ({
  loops: [],
  isLoading: false,
  error: null,
  
  createLoop: async (title, description) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      const newLoop: Loop = {
        id: uuidv4(),
        user_id: 'current-user', // This will be replaced with the actual user ID
        title,
        description: description || '',
        status: 'active',
        progress: 0,
        total_steps: 0,
        completed_steps: 0,
        created_at: new Date().toISOString(),
      }
      
      set(state => ({
        loops: [...state.loops, newLoop],
        isLoading: false
      }))
      
      return newLoop.id
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  updateLoop: async (id, title, description, status) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      set(state => ({
        loops: state.loops.map(loop => 
          loop.id === id 
            ? { 
                ...loop, 
                title: title ?? loop.title, 
                description: description ?? loop.description, 
                status: status ?? loop.status,
                updated_at: new Date().toISOString()
              } 
            : loop
        ),
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  deleteLoop: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      set(state => ({
        loops: state.loops.filter(loop => loop.id !== id),
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  
  getLoopById: (id) => {
    return get().loops.find(loop => loop.id === id)
  },
  
  getLoopWithProgress: (id) => {
    const loop = get().loops.find(loop => loop.id === id)
    if (!loop) return undefined
    
    // Get tasks for this loop from the tasks store
    // In a real app, we'd get this from the tasks store
    const taskCount = loop.id === '1' ? 8 : loop.id === '2' ? 5 : 10;
    const completedCount = loop.id === '1' ? 2 : loop.id === '2' ? 3 : 1;
    
    return {
      ...loop,
      progress: calculateLoopProgress({ id: loop.id, total_steps: taskCount, completed_steps: completedCount }),
      totalSteps: taskCount,
      completedSteps: completedCount 
    }
  },
  
  fetchLoops: async () => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with actual API call
      // For now, just use dummy data
      const dummyLoops: Loop[] = [
        {
          id: '1',
          user_id: 'current-user',
          title: 'Plan vacation to Japan',
          description: 'Research and plan a two week trip to Japan in the spring',
          status: 'active' as LoopStatus,
          progress: 25,
          total_steps: 8,
          completed_steps: 2,
          created_at: new Date(Date.now() - 10000000).toISOString(),
          updated_at: new Date(Date.now() - 5000000).toISOString()
        },
        {
          id: '2',
          user_id: 'current-user',
          title: 'Learn TypeScript',
          description: 'Complete TypeScript course and build a small project',
          status: 'active' as LoopStatus,
          progress: 60,
          total_steps: 5,
          completed_steps: 3,
          created_at: new Date(Date.now() - 20000000).toISOString(),
          updated_at: new Date(Date.now() - 2000000).toISOString()
        },
        {
          id: '3',
          user_id: 'current-user',
          title: 'Redesign personal website',
          description: 'Create new design and implement it with modern tech stack',
          status: 'active' as LoopStatus,
          progress: 10,
          total_steps: 10,
          completed_steps: 1,
          created_at: new Date(Date.now() - 30000000).toISOString(),
          updated_at: new Date(Date.now() - 9000000).toISOString()
        }
      ]
      
      set({ loops: dummyLoops, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  }
}))