"use client"
import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion';

interface Props {
  children: JSX.Element,
  width?: "fit-content" | "100%"
}

export const Reveal = ({ children, width = "fit-content" }: Props) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const mainControls = useAnimation();
  useEffect(() => {
    if (isInView) {
      mainControls.start('visible')
    }
  }, [isInView])

  return (
    <div ref={ref} style={{ position: 'relative', width, overflow: 'hidden' }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, easings: 'cubicBezier(.5, .05, .1, .3)', delay: 0.25 }}
      >
        {children}
      </motion.div>
    </div>
  )
}