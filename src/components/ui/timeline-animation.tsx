'use client'
import React, { useRef } from 'react'
import { motion, useInView, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

type TimelineContentProps = {
  as?: string
  animationNum?: number
  timelineRef?: React.RefObject<HTMLElement | null>
  customVariants?: Variants
  className?: string
  children?: React.ReactNode
  [key: string]: unknown
}

export function TimelineContent({
  as: _tag = 'div',
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps) {
  const localRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(
    (timelineRef as React.RefObject<HTMLDivElement | null>) || localRef,
    { once: true, margin: '0px 0px -50px 0px' }
  )

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: i * 0.3, duration: 0.5 },
    }),
  }

  return (
    <motion.div
      ref={localRef}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariants || defaultVariants}
      custom={animationNum}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}
