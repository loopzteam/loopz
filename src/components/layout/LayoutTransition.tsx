'use client'

import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { UILayer } from '@/features/ui/use-ui-state'

interface LayoutTransitionProps {
  currentLayer: UILayer
  layers: {
    landing: ReactNode
    dashboard: ReactNode
    detail: ReactNode
  }
  onAnimationComplete?: (layer: UILayer) => void
}

export function LayoutTransition({
  currentLayer,
  layers,
  onAnimationComplete
}: LayoutTransitionProps) {
  // Animation variants for each layer
  const variants = {
    dashboard: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    detail: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Landing layer (always present in background) */}
      <div className="absolute inset-0 z-0">
        {layers.landing}
      </div>

      {/* Dashboard layer (slides in from left) */}
      <AnimatePresence>
        {(currentLayer === 'dashboard' || currentLayer === 'detail') && (
          <motion.div
            className="absolute inset-y-0 left-0 z-10 w-full max-w-md border-r border-gray-200 bg-white shadow-lg"
            variants={variants.dashboard}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            onAnimationComplete={() => onAnimationComplete?.('dashboard')}
          >
            {layers.dashboard}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail layer (slides in from right) */}
      <AnimatePresence>
        {currentLayer === 'detail' && (
          <motion.div
            className="absolute inset-0 z-20 bg-white"
            variants={variants.detail}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            onAnimationComplete={() => onAnimationComplete?.('detail')}
          >
            {layers.detail}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}