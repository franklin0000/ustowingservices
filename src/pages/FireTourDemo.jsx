import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLenis } from '../hooks/useLenis'

const FALLBACK = {
  hero: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1600&q=80',
  buggy: 'https://picsum.photos/seed/firetour-buggy-adventure/1200/1600',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  party: 'https://picsum.photos/seed/firetour-nightclub-show/1200/1600',
}

const FLYERS = [
  {
    src: '/firetour/flyer-1.jpg',
    fallback: FALLBACK.buggy,
    title: 'Combo Aventura',
    subtitle: 'Buggies off-road + Saona Island',
    price: 'US$ 120',
    accent: 'from-orange-500 to-red-600',
    features: ['Recorrido off-road', 'Cuevas naturales', 'Para parejas y amigos'],
  },
  {
    src: '/firetour/flyer-2.jpg',
    fallback: FALLBACK.beach,
    title: 'Saona Island',
    subtitle: 'Playa, piscina natural y buffet',
    price: 'US$ 95',
    accent: 'from-cyan-500 to-blue-700',
    features: ['Arena blanca', 'Piscina natural', 'Almuerzo incluido'],
  },
  {
    src: '/firetour/flyer-3.jpg',
    fallback: FALLBACK.party,
    title: 'Coco Bongo Show',
    subtitle: 'Show & Disco · Punta Cana',
    price: 'US$ 146',
    accent: 'from-fuchsia-500 to-purple-700',
    features: ['Gold Member', 'Front Row', 'Últimos cupos'],
  },
]

function SmartImage({ src, fallback, alt, className, style }) {
  const handleError = (e) => {
    if (e.currentTarget.dataset.fallbackUsed) return
    e.currentTarget.dataset.fallbackUsed = '1'
    e.currentTarget.src = fallback
  }
  return <img src={src} alt={alt} className={className} style={style} onError={handleError} />
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-50 bg-gradient-to-r from-orange-500 via-fuchsia-500 to-cyan-400"
      style={{ scaleX }}
    />
  )
}

function HeroParallax() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative h-[100vh] overflow-hidden bg-black">
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <SmartImage
          src="/firetour/flyer-2.jpg"
          fallback={FALLBACK.hero}
          alt="Fire Tour DR"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black" />
      </motion.div>

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-orange-400 tracking-[0.4em] uppercase text-xs sm:text-sm mb-6"
        >
          Fire Tour DR · Punta Cana
        </motion.span>

        <StaggerHeadline text="Aventura que deja huellas" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 max-w-xl text-white/80 text-base sm:text-lg"
        >
          Vive experiencias inolvidables. Tú solo disfruta, de lo demás nos encargamos nosotros.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-10 flex flex-col items-center text-white/60"
        >
          <span className="text-xs uppercase tracking-widest mb-3">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-white/40"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

function StaggerHeadline({ text }) {
  const words = text.split(' ')
  return (
    <h1 className="text-white font-black uppercase leading-[0.95] tracking-tight text-5xl sm:text-7xl md:text-8xl">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-3">
          <motion.span
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

function HorizontalSticky() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.6%'])

  return (
    <section ref={ref} className="relative h-[300vh] bg-neutral-950">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div style={{ x }} className="flex gap-8 px-[10vw] will-change-transform">
          {FLYERS.map((f, i) => (
            <FlyerPanel key={i} flyer={f} index={i} />
          ))}
        </motion.div>

        <div className="absolute top-10 left-10 text-white/70 text-xs uppercase tracking-[0.3em]">
          {'>>'} Scroll · Tour {(scrollYProgress.get() * FLYERS.length + 1) | 0} / {FLYERS.length}
        </div>
      </div>
    </section>
  )
}

function FlyerPanel({ flyer, index }) {
  return (
    <div className="relative shrink-0 w-[70vw] sm:w-[45vw] md:w-[32vw] h-[85vh] flex flex-col group">
      <div className="flex items-center justify-between text-white/70 text-xs tracking-[0.3em] uppercase mb-3 px-1">
        <span>0{index + 1} / 0{FLYERS.length}</span>
        <span className="opacity-60">{flyer.subtitle}</span>
      </div>
      <div className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <SmartImage
          src={flyer.src}
          fallback={flyer.fallback}
          alt={flyer.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
    </div>
  )
}

function TiltCard({ flyer, index }) {
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { stiffness: 120, damping: 12 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 120, damping: 12 })

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const onLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  const overlay = useMotionTemplate`radial-gradient(circle at ${useTransform(mouseX, (v) => v * 100)}% ${useTransform(
    mouseY,
    (v) => v * 100
  )}%, rgba(255,255,255,0.25), transparent 60%)`

  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el
        inViewRef(el)
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-xl"
    >
      <SmartImage
        src={flyer.src}
        fallback={flyer.fallback}
        alt={flyer.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'translateZ(0)' }}
      />
      <motion.div style={{ background: overlay }} className="absolute inset-0 pointer-events-none mix-blend-overlay" />
    </motion.div>
  )
}

function TiltGrid() {
  return (
    <section className="relative py-32 px-6 bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto">
        <RevealHeading
          eyebrow="Galería"
          title="Tres formas de vivir Punta Cana"
          subtitle="Mueve el mouse sobre cada tarjeta — todo reacciona con física de muelle."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {FLYERS.map((f, i) => (
            <TiltCard key={i} flyer={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RevealHeading({ eyebrow, title, subtitle }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  return (
    <div ref={ref} className="max-w-3xl">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="block text-orange-400 text-xs tracking-[0.4em] uppercase mb-4"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-black uppercase leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-4 text-white/70 text-lg max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

function PinnedReveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const clip = useTransform(scrollYProgress, [0.2, 0.7], [85, 0])
  const clipPath = useMotionTemplate`inset(${clip}% 0% ${clip}% 0%)`

  const textY = useTransform(scrollYProgress, [0.2, 0.6], [60, 0])
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])

  return (
    <section ref={ref} className="relative py-32 px-6 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <span className="text-orange-400 text-xs tracking-[0.4em] uppercase mb-4 block">
            Reserva
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase leading-tight">
            Tu mejor plan,<br />
            <span className="text-orange-400">nosotros lo hacemos realidad.</span>
          </h2>
          <p className="mt-6 text-white/70 text-lg">
            Transporte incluido · Atención personalizada · Cupos limitados · Guías expertos.
          </p>
          <a
            href="https://wa.me/15872257342"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold uppercase tracking-wider rounded-full transition"
          >
            Reservar por WhatsApp
            <span>→</span>
          </a>
        </motion.div>

        <motion.div
          style={{ clipPath }}
          className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
        >
          <SmartImage
            src="/firetour/flyer-1.jpg"
            fallback={FALLBACK.buggy}
            alt="Combo Aventura"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}

function MarqueeBand() {
  return (
    <section className="relative py-16 bg-orange-500 text-black overflow-hidden border-y-4 border-black">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 whitespace-nowrap text-5xl sm:text-7xl font-black uppercase"
      >
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="flex gap-12">
            <span>Buggies</span>
            <span>★</span>
            <span>Saona Island</span>
            <span>★</span>
            <span>Coco Bongo</span>
            <span>★</span>
            <span>Punta Cana</span>
            <span>★</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black text-white/60 py-16 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em]">Fire Tour DR</p>
      <p className="mt-3 text-sm">@firetourdr · www.firetourdr.com · +1 587-225-7342</p>
    </footer>
  )
}

export default function FireTourDemo() {
  useLenis()

  return (
    <main className="bg-black text-white">
      <ScrollProgressBar />
      <HeroParallax />
      <HorizontalSticky />
      <MarqueeBand />
      <TiltGrid />
      <PinnedReveal />
      <Footer />
    </main>
  )
}
