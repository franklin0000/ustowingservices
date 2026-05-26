import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IMAGES = [
  '/auth_hero_bg.png',
  '/auth_hero_bg_2.png',
  '/auth_hero_bg_3.png'
]

export default function BackgroundSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % IMAGES.length)
    }, 6000) // Change every 6 seconds
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence>
        <motion.img
          key={index}
          src={IMAGES[index]}
          alt="Towing Service Background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 2, ease: "easeInOut" }, // Smooth crossfade
            scale: { duration: 8, ease: "linear" }       // Slow Ken Burns zoom out
          }}
        />
      </AnimatePresence>
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/95"></div>
    </div>
  )
}
