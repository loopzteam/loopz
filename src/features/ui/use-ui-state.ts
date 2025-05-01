'use client'

import { create } from 'zustand'

export type UILayer = 'landing' | 'dashboard' | 'detail'

interface UIState {
  currentLayer: UILayer
  activeLoopId: string | undefined
  previousLayer: UILayer | null
  isTransitioning: boolean
  
  // Actions
  goToLanding: () => void
  goToDashboard: () => void
  goToDetail: (loopId: string) => void
  goBack: () => void
  setTransitioning: (isTransitioning: boolean) => void
}

export const useUiState = create<UIState>((set) => ({
  currentLayer: 'landing',
  activeLoopId: undefined,
  previousLayer: null,
  isTransitioning: false,
  
  goToLanding: () => set({
    currentLayer: 'landing',
    previousLayer: 'dashboard',
    activeLoopId: undefined,
    isTransitioning: true,
  }),
  
  goToDashboard: () => set((state) => ({
    currentLayer: 'dashboard',
    previousLayer: state.currentLayer,
    isTransitioning: true,
    ...(state.currentLayer === 'landing' ? {} : { activeLoopId: undefined })
  })),
  
  goToDetail: (loopId) => set((state) => ({
    currentLayer: 'detail',
    previousLayer: state.currentLayer,
    activeLoopId: loopId,
    isTransitioning: true,
  })),
  
  goBack: () => set((state) => {
    if (!state.previousLayer) return state
    
    return {
      currentLayer: state.previousLayer,
      previousLayer: null,
      isTransitioning: true,
      ...(state.previousLayer !== 'detail' ? { activeLoopId: undefined } : {})
    }
  }),
  
  setTransitioning: (isTransitioning) => set({ isTransitioning })
}))