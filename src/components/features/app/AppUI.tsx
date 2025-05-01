'use client'

import { useUiState } from '@/features/ui/use-ui-state'
import { LayoutTransition } from '@/components/layout/LayoutTransition'
import { Dashboard } from '@/components/features/dashboard/Dashboard'
import { LandingPage } from '@/components/features/landing/LandingPage'
import { LoopDetail } from '@/components/features/loop/LoopDetail'

export function AppUI() {
  const { currentLayer, goToLanding, goToDashboard, goToDetail, activeLoopId } = useUiState()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <LayoutTransition 
        currentLayer={currentLayer} 
        layers={{
          landing: (
            <LandingPage onGetStarted={goToDashboard} />
          ),
          dashboard: (
            <Dashboard 
              onLoopSelect={goToDetail}
              onSignOut={goToLanding}
            />
          ),
          detail: (
            <LoopDetail 
              loopId={activeLoopId}
              onBack={goToDashboard}
            />
          )
        }}
      />
    </div>
  )
}