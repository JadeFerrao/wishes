import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import html2canvas from 'html2canvas'
import friendshipSong from '../assets/frienship.mp3'

const BEADS = [
  { id: 1, emoji: '😂', quality: 'Humor', color: '#FF6B6B', desc: 'Making every moment hilarious' },
  { id: 2, emoji: '💪', quality: 'Strength', color: '#4ECDC4', desc: 'My rock in every storm' },
  { id: 3, emoji: '🤪', quality: 'Craziness', color: '#FFE66D', desc: 'Partner in every crime' },
  { id: 4, emoji: '❤️', quality: 'Loyalty', color: '#FF8A5C', desc: 'Always having my back' },
  { id: 5, emoji: '✨', quality: 'Kindness', color: '#A8E6CF', desc: 'The purest soul ever' },
  { id: 6, emoji: '🎯', quality: 'Honesty', color: '#DDA0DD', desc: 'Real talk, always' },
  { id: 7, emoji: '🔥', quality: 'Energy', color: '#FF4757', desc: 'Unforgettable vibes only' },
  { id: 8, emoji: '🌈', quality: 'Joy', color: '#7ED6DF', desc: 'Pure happiness personified' },
]

// Quadratic bezier point calculator
const bezier = (t, a, b, c) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c

export default function FriendshipCard() {
  const [phase, setPhase] = useState('intro') // intro | building | complete
  const [visibleBeads, setVisibleBeads] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [braceletGlow, setBraceletGlow] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  
  // Interactive features state
  const [highFiveCount, setHighFiveCount] = useState(0)
  const [hugCount, setHugCount] = useState(0)
  const [popups, setPopups] = useState([])
  const [shakeScreen, setShakeScreen] = useState(false)
  const [hugGlowActive, setHugGlowActive] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const [downloadingCert, setDownloadingCert] = useState(false)

  const { width, height } = useWindowSize()
  const audioRef = useRef(new Audio(friendshipSong))
  const certRef = useRef(null)
  const isMobile = width < 600

  // Dynamic parameters support
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const recipientName = searchParams.get('name') || 'Mik'
  const senderName = searchParams.get('from') || 'Jay'

  const svgW = isMobile ? 320 : 480
  const svgH = isMobile ? 180 : 240
  // Bezier control points for the "U" shaped thread
  const P0 = { x: 20, y: 20 }
  const P1 = { x: svgW / 2, y: svgH + 60 }
  const P2 = { x: svgW - 20, y: 20 }

  const getBeadPos = (i) => {
    const t = (i + 0.5) / BEADS.length
    return {
      x: bezier(t, P0.x, P1.x, P2.x),
      y: bezier(t, P0.y, P1.y, P2.y),
    }
  }

  useEffect(() => {
    if (phase !== 'building') return
    if (visibleBeads < BEADS.length) {
      const id = setTimeout(() => setVisibleBeads((v) => v + 1), 1100)
      return () => clearTimeout(id)
    }
    // all beads placed
    const id = setTimeout(() => {
      setBraceletGlow(true)
      setShowConfetti(true)
      setPhase('complete')
      setTimeout(() => setShowConfetti(false), 7000)
    }, 600)
    return () => clearTimeout(id)
  }, [phase, visibleBeads])

  // Sync audio ending state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => setIsPlayingAudio(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlayingAudio) {
      audioRef.current.pause()
      setIsPlayingAudio(false)
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch((e) => console.error('Audio play error:', e))
    }
  }

  const triggerHighFive = () => {
    setHighFiveCount((prev) => prev + 1)
    setShakeScreen(true)
    setTimeout(() => setShakeScreen(false), 400)

    const newPopup = {
      id: Date.now() + Math.random(),
      type: 'highfive',
      emoji: ['✋', '💥', '⚡', '💯', '🔥', '👏'][Math.floor(Math.random() * 6)],
      x: (Math.random() - 0.5) * 160,
    }
    setPopups((prev) => [...prev, newPopup])
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== newPopup.id))
    }, 1200)
  }

  const triggerHug = () => {
    setHugCount((prev) => prev + 1)
    setHugGlowActive(true)
    setTimeout(() => setHugGlowActive(false), 1500)

    const newPopup = {
      id: Date.now() + Math.random(),
      type: 'hug',
      emoji: ['💖', '🤗', '🌸', '💕', '✨', '🫂'][Math.floor(Math.random() * 6)],
      x: (Math.random() - 0.5) * 160,
    }
    setPopups((prev) => [...prev, newPopup])
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== newPopup.id))
    }, 1200)
  }

  const downloadCertificate = async () => {
    if (!certRef.current || downloadingCert) return
    setDownloadingCert(true)
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: '#0c0c1d',
        useCORS: true,
        logging: false,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${recipientName}_Friendship_Certificate.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Certificate download error:', err)
    } finally {
      setDownloadingCert(false)
    }
  }

  /* ---------- tiny reusable pieces ---------- */

  const Sparkles = () => (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(25)].map((_, i) => {
        const hue = Math.random() * 60 + 30
        return (
          <motion.div
            key={i}
            initial={{ x: Math.random() * width, y: Math.random() * height, opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [null, Math.random() * height - 150] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
            style={{
              position: 'absolute', width: 4, height: 4, borderRadius: '50%',
              background: `hsl(${hue},100%,75%)`,
              boxShadow: `0 0 6px 2px hsl(${hue},100%,75%)`,
            }}
          />
        )
      })}
    </div>
  )

  /* ---------- render ---------- */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Satisfy&family=Outfit:wght@300;400;600;700;800&family=Cinzel:wght@600;700;800&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes vinylSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .shimmer-text{
          background:linear-gradient(90deg,#FFD700,#FFF,#FFD700,#FFF,#FFD700);
          background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
          animation:shimmer 3s linear infinite;
        }
        .float-anim{animation:floatY 2.5s ease-in-out infinite}
        .vinyl-spinning{animation:vinylSpin 4s linear infinite}
        @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      `}</style>

      {/* Hug warmth screen overlay */}
      <AnimatePresence>
        {hugGlowActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
              background: 'radial-gradient(circle at center, rgba(255, 105, 180, 0.25) 0%, rgba(255, 182, 193, 0.1) 60%, transparent 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* confetti */}
      {showConfetti && (
        <ReactConfetti
          width={width} height={height} recycle numberOfPieces={280}
          colors={BEADS.map((b) => b.color)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#0c0c1d 0%,#1a1a3e 25%,#2d1b4e 50%,#1a1a3e 75%,#0c0c1d 100%)',
        fontFamily: "'Outfit',sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        overflowY: phase === 'complete' ? 'auto' : 'hidden',
        transform: shakeScreen ? 'translate(4px, -4px)' : 'none',
        transition: 'transform 0.05s ease-in-out',
      }}>
        <Sparkles />

        {/* ====== INTRO ====== */}
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.8 }}
              style={{
                height: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 10, padding: 20, gap: 28,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: isMobile ? '4rem' : '6rem' }}
              >📿</motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="shimmer-text"
                style={{ fontSize: isMobile ? '2.4rem' : '3.8rem', fontWeight: 800, margin: 0, textAlign: 'center', lineHeight: 1.2 }}
              >Happy Friendship Day</motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: isMobile ? '1rem' : '1.25rem', margin: 0, textAlign: 'center', maxWidth: 480, lineHeight: 1.7 }}
              >
                Every friendship is made of special moments, inside jokes, and unbreakable bonds.<br />
                Let's weave those into something beautiful.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,215,0,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0
                    audioRef.current.play()
                      .then(() => setIsPlayingAudio(true))
                      .catch((e) => console.error('Audio playback failed:', e))
                  }
                  setPhase('building')
                }}
                style={{
                  padding: isMobile ? '16px 38px' : '18px 50px',
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                  border: 'none', borderRadius: 60,
                  background: 'linear-gradient(135deg,#FFD700,#FFA500,#FF6B6B)',
                  color: '#1a1a2e', cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(255,215,0,0.3)',
                }}
              >Start Weaving 🧵</motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== BUILDING / COMPLETE — first viewport ====== */}
        {(phase === 'building' || phase === 'complete') && (
          <>
            <div style={{
              height: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 10, padding: 20,
            }}>
              {/* heading */}
              <motion.h2
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                style={{ color: '#FFD700', fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}
              >
                {phase === 'complete' ? '✨ Your Friendship Bracelet ✨' : 'Weaving Your Bracelet...'}
              </motion.h2>

              {/* current bead label */}
              <div style={{ height: 36, marginBottom: 16 }}>
                <AnimatePresence mode="wait">
                  {phase === 'building' && visibleBeads > 0 && visibleBeads <= BEADS.length && (
                    <motion.p
                      key={visibleBeads}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      style={{ margin: 0, color: BEADS[visibleBeads - 1].color, fontWeight: 600, fontSize: isMobile ? '0.95rem' : '1.15rem', textAlign: 'center' }}
                    >
                      Adding {BEADS[visibleBeads - 1].quality}... {BEADS[visibleBeads - 1].emoji}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* SVG bracelet */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ position: 'relative', width: svgW, height: svgH + 80 }}
              >
                <svg width={svgW} height={svgH + 80} viewBox={`0 0 ${svgW} ${svgH + 80}`} style={{ overflow: 'visible' }}>
                  {/* thread */}
                  <motion.path
                    d={`M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
                    fill="none"
                    stroke={braceletGlow ? '#FFD700' : 'rgba(255,215,0,0.35)'}
                    strokeWidth={braceletGlow ? 4 : 3}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    style={{ filter: braceletGlow ? 'drop-shadow(0 0 12px rgba(255,215,0,0.7))' : 'none' }}
                  />

                  {/* clasp ends */}
                  {[P0, P2].map((p, i) => (
                    <motion.circle key={i} cx={p.x} cy={p.y} r={6}
                      fill="#FFD700" initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}
                    />
                  ))}
                </svg>

                {/* Beads overlay — absolutely positioned on top of SVG */}
                {BEADS.map((bead, i) => {
                  const pos = getBeadPos(i)
                  const isVisible = i < visibleBeads
                  const beadSize = isMobile ? 40 : 52
                  return (
                    <AnimatePresence key={bead.id}>
                      {isVisible && (
                        <motion.div
                          initial={{ y: -200, opacity: 0, scale: 0.3 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                          style={{
                            position: 'absolute',
                            left: pos.x - beadSize / 2,
                            top: pos.y - beadSize / 2,
                            width: beadSize, height: beadSize,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at 35% 35%, ${bead.color}dd, ${bead.color}88)`,
                            border: `2px solid ${bead.color}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: isMobile ? '1.1rem' : '1.4rem',
                            boxShadow: braceletGlow
                              ? `0 0 18px ${bead.color}aa, inset 0 0 10px rgba(255,255,255,0.25)`
                              : `0 4px 14px ${bead.color}55, inset 0 0 10px rgba(255,255,255,0.2)`,
                            cursor: 'default',
                            transition: 'box-shadow 0.6s ease',
                          }}
                        >
                          {bead.emoji}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )
                })}
              </motion.div>

              {/* progress dots */}
              <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                {BEADS.map((b, i) => (
                  <motion.div
                    key={b.id}
                    animate={{ scale: i < visibleBeads ? 1 : 0.6, background: i < visibleBeads ? b.color : 'rgba(255,255,255,0.15)' }}
                    style={{ width: 10, height: 10, borderRadius: '50%', transition: 'all 0.3s ease' }}
                  />
                ))}
              </div>

              {/* scroll indicator after complete */}
              {phase === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="float-anim"
                  style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                >
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>Scroll down to experience your story</p>
                  <span style={{ fontSize: '1.5rem' }}>👇</span>
                </motion.div>
              )}
            </div>

            {/* ====== STORY JOURNEY (ALL SCROLLABLE SECTIONS) ====== */}
            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ position: 'relative', zIndex: 20 }}
              >
                {/* ---------------------------------------------------- */}
                {/* STORY CHAPTER 1: RETRO VINYL MUSIC PLAYER            */}
                {/* ---------------------------------------------------- */}
                <div style={{ padding: isMobile ? '40px 16px' : '60px 40px', maxWidth: 700, margin: '0 auto' }}>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background: 'linear-gradient(145deg, rgba(30, 25, 55, 0.7), rgba(15, 12, 35, 0.8))',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 28,
                      padding: isMobile ? '24px 20px' : '36px 40px',
                      border: '1px solid rgba(255, 215, 0, 0.25)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <span style={{
                        background: 'rgba(255,215,0,0.15)', color: '#FFD700',
                        fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.5,
                        padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase'
                      }}>
                        Chapter 1 • The Soundtrack
                      </span>
                      <h3 style={{ color: '#FFF', fontSize: isMobile ? '1.4rem' : '1.8rem', margin: '10px 0 4px', fontWeight: 700 }}>
                        The Friendship Anthem 🎧
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>
                        Every iconic bond deserves a signature soundtrack spin
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: 'center',
                      justify: 'center',
                      gap: isMobile ? 24 : 36,
                      marginTop: 10,
                    }}>
                      {/* Vinyl Turntable Graphic */}
                      <div style={{ position: 'relative', width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Vinyl Disc */}
                        <div
                          className={isPlayingAudio ? 'vinyl-spinning' : ''}
                          style={{
                            width: 160, height: 160, borderRadius: '50%',
                            background: 'radial-gradient(circle, #2a2a2a 0%, #111 40%, #222 55%, #050505 100%)',
                            boxShadow: isPlayingAudio ? '0 0 25px rgba(255,215,0,0.35)' : '0 8px 20px rgba(0,0,0,0.6)',
                            position: 'relative',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '3px solid #333',
                          }}
                        >
                          {/* vinyl groove rings */}
                          <div style={{
                            position: 'absolute', inset: 12, borderRadius: '50%',
                            border: '1px dashed rgba(255,255,255,0.08)',
                          }} />
                          <div style={{
                            position: 'absolute', inset: 28, borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.05)',
                          }} />

                          {/* Center sticker */}
                          <div style={{
                            width: 58, height: 58, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF6B6B, #FFD700)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)',
                            position: 'relative',
                          }}>
                            <span style={{ fontSize: '1.4rem' }}>📿</span>
                            {/* center spindle hole */}
                            <div style={{
                              position: 'absolute', width: 10, height: 10, borderRadius: '50%',
                              background: '#0c0c1d', border: '1px solid rgba(255,255,255,0.4)',
                            }} />
                          </div>
                        </div>

                        {/* Vinyl Tonearm Needle */}
                        <motion.div
                          animate={{ rotate: isPlayingAudio ? 22 : 0 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            position: 'absolute', top: 5, right: 10,
                            width: 70, height: 8, originX: 0.9, originY: 0.2,
                            pointerEvents: 'none', zIndex: 5,
                          }}
                        >
                          <div style={{
                            width: 60, height: 4, background: '#FFD700', borderRadius: 2,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.5)', position: 'relative',
                          }}>
                            <div style={{
                              position: 'absolute', left: 0, top: -2, width: 8, height: 8,
                              background: '#FFF', borderRadius: '50%',
                            }} />
                          </div>
                        </motion.div>
                      </div>

                      {/* Controls & Track Details */}
                      <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: isMobile ? 'center' : 'flex-start',
                        gap: 12, flex: 1,
                      }}>
                        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                          <h4 style={{ margin: 0, color: '#FFD700', fontSize: '1.1rem', fontWeight: 700 }}>
                            Unbreakable Bond FM
                          </h4>
                          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            Dedicated to {recipientName} • Mixed by {senderName}
                          </p>
                        </div>

                        {/* Animated Visualizer Soundbars */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 30, padding: '4px 0' }}>
                          {[18, 30, 14, 26, 36, 16, 28, 20].map((baseH, idx) => (
                            <motion.div
                              key={idx}
                              animate={{
                                height: isPlayingAudio ? [8, baseH, 10, baseH + 4, 6] : 6,
                              }}
                              transition={{
                                duration: 0.6 + idx * 0.1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                              }}
                              style={{
                                width: 5, borderRadius: 3,
                                background: `hsl(${idx * 40 + 40}, 100%, 65%)`,
                              }}
                            />
                          ))}
                        </div>

                        {/* Play/Pause Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleAudio}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 24px', borderRadius: 30, border: 'none',
                            background: isPlayingAudio
                              ? 'linear-gradient(135deg, #FF4757, #FF6B6B)'
                              : 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: '#1a1a2e', fontWeight: 800, fontSize: '0.95rem',
                            cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                          }}
                        >
                          <span>{isPlayingAudio ? '⏸️ Pause Track' : '▶️ Play Vinyl Track'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STORY CHAPTER 2: BEAD QUALITY CARDS                   */}
                {/* ---------------------------------------------------- */}
                <div style={{ padding: isMobile ? '30px 16px' : '50px 40px', maxWidth: 900, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <span style={{
                      background: 'rgba(255,215,0,0.15)', color: '#FFD700',
                      fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.5,
                      padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase'
                    }}>
                      Chapter 2 • The Elements
                    </span>
                    <h2 style={{ color: '#FFD700', fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 700, marginTop: 8 }}>
                      Every Bead Tells a Story
                    </h2>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: isMobile ? 16 : 24,
                  }}>
                    {BEADS.map((bead, i) => (
                      <motion.div
                        key={bead.id}
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(12px)',
                          borderRadius: 20,
                          padding: isMobile ? '20px' : '28px',
                          border: `1px solid ${bead.color}33`,
                          display: 'flex', alignItems: 'center', gap: 18,
                          cursor: 'default',
                          transition: 'border-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = bead.color + '88'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = bead.color + '33'}
                      >
                        <div style={{
                          width: 56, height: 56, minWidth: 56, borderRadius: '50%',
                          background: `radial-gradient(circle at 35% 35%, ${bead.color}cc, ${bead.color}66)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem',
                          boxShadow: `0 4px 20px ${bead.color}44`,
                        }}>
                          {bead.emoji}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 4px', color: bead.color, fontSize: '1.1rem', fontWeight: 700 }}>
                            {bead.quality}
                          </h3>
                          <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
                            {bead.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STORY CHAPTER 3: HANDWRITTEN LETTER                  */}
                {/* ---------------------------------------------------- */}
                <div style={{ padding: isMobile ? '40px 16px' : '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    background: 'rgba(255,215,0,0.15)', color: '#FFD700',
                    fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.5,
                    padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase', marginBottom: 16
                  }}>
                    Chapter 3 • A Personal Note
                  </span>

                  <motion.div
                    initial={{ y: 60, opacity: 0, rotateX: 15 }}
                    whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 28,
                      padding: isMobile ? '32px 24px' : '48px 44px',
                      maxWidth: 560,
                      width: '100%',
                      border: '1px solid rgba(255,215,0,0.2)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* decorative corner */}
                    <div style={{
                      position: 'absolute', top: -30, right: -30,
                      width: 100, height: 100, borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,215,0,0.15), transparent)',
                    }} />

                    <h2 style={{
                      fontFamily: "'Satisfy', cursive",
                      fontSize: isMobile ? '2.4rem' : '3.2rem',
                      color: '#FFD700',
                      margin: '0 0 20px',
                      textAlign: 'center',
                    }}>
                      Dear {recipientName},
                    </h2>

                    <p style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: isMobile ? '1.3rem' : '1.6rem',
                      color: 'rgba(255,255,255,0.8)',
                      textAlign: 'center',
                      lineHeight: 1.8,
                      margin: 0,
                    }}>
                      If our friendship were a bracelet, it would be the kind that never breaks —
                      no matter how much we pull, stretch, or test it. <br /><br />
                      You will definetely be my person that can surely and will turn my worst days into inside jokes
                      and my best days into core memories. I know you have been going through a lot as well, i hope this lightens it more and you will comeback stronger toooo !<br /><br />
                      Thank you for seeing me as a good friend in this past 2 months we really grew into good friends and thank you for being my unpaid therapist, moi crazy ambulance too and who never judges me
                      and the only one who truly gets my weird humor. <br /><br />
                      Here's to us — unbreakable, unmatched, and a little unhinged 🤝
                      <br /><br />
                      <span style={{ fontSize: isMobile ? '1.6rem' : '2rem', color: '#FFD700' }}>
                        — Your Forever Buddyyy , {senderName}!
                      </span>
                    </p>
                  </motion.div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STORY CHAPTER 4: VIRTUAL HIGH-FIVE & HUG SQUEEZE     */}
                {/* ---------------------------------------------------- */}
                <div style={{ padding: isMobile ? '40px 16px' : '60px 40px', maxWidth: 800, margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <span style={{
                      background: 'rgba(255,215,0,0.15)', color: '#FFD700',
                      fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.5,
                      padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase'
                    }}>
                      Chapter 4 • Instant Vibe Boost
                    </span>
                    <h2 style={{ color: '#FFD700', fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 700, marginTop: 8 }}>
                      Send Some Love Right Now ⚡
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
                      Tap the buttons below to trigger live interactive boosts!
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: 20,
                    position: 'relative',
                  }}>
                    {/* Floating particle animations overlay */}
                    {popups.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 1, y: 0, scale: 0.5, x: p.x }}
                        animate={{ opacity: 0, y: -140, scale: 1.8 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{
                          position: 'absolute', top: '30%', left: '50%',
                          fontSize: '2.5rem', pointerEvents: 'none', zIndex: 100,
                        }}
                      >
                        {p.emoji}
                      </motion.div>
                    ))}

                    {/* High Five Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.15), rgba(255, 107, 107, 0.05))',
                        border: '1px solid rgba(255, 71, 87, 0.4)',
                        borderRadius: 24, padding: '28px 24px',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div style={{ fontSize: '3rem' }}>🖐️</div>
                      <h3 style={{ margin: 0, color: '#FF4757', fontSize: '1.3rem', fontWeight: 700 }}>
                        Virtual High-Five!
                      </h3>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' }}>
                        Smash the button for a high-energy snap!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={triggerHighFive}
                        style={{
                          padding: '14px 28px', borderRadius: 30, border: 'none',
                          background: 'linear-gradient(135deg, #FF4757, #FF6B6B)',
                          color: '#FFF', fontWeight: 800, fontSize: '1rem',
                          cursor: 'pointer', boxShadow: '0 6px 20px rgba(255, 71, 87, 0.4)',
                          marginTop: 6,
                        }}
                      >
                        ✋ High-Five ({highFiveCount})
                      </motion.button>
                    </motion.div>

                    {/* Hug Squeeze Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(168, 230, 207, 0.05))',
                        border: '1px solid rgba(255, 105, 180, 0.4)',
                        borderRadius: 24, padding: '28px 24px',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div style={{ fontSize: '3rem' }}>🤗</div>
                      <h3 style={{ margin: 0, color: '#FF69B4', fontSize: '1.3rem', fontWeight: 700 }}>
                        Squeeze Hug Station
                      </h3>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' }}>
                        Send warm glowing vibes & instant comfort!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={triggerHug}
                        style={{
                          padding: '14px 28px', borderRadius: 30, border: 'none',
                          background: 'linear-gradient(135deg, #FF69B4, #FFA07A)',
                          color: '#FFF', fontWeight: 800, fontSize: '1rem',
                          cursor: 'pointer', boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4)',
                          marginTop: 6,
                        }}
                      >
                        🫂 Warm Hug ({hugCount})
                      </motion.button>
                    </motion.div>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STORY CHAPTER 5: MARQUEE & STATS                     */}
                {/* ---------------------------------------------------- */}
                <div style={{
                  overflow: 'hidden',
                  padding: '30px 0',
                  marginTop: 20,
                  borderTop: '1px solid rgba(255,215,0,0.1)',
                  borderBottom: '1px solid rgba(255,215,0,0.1)',
                }}>
                  <div style={{
                    display: 'flex', whiteSpace: 'nowrap',
                    animation: 'marqueeScroll 20s linear infinite',
                    width: 'max-content',
                  }}>
                    {[...Array(2)].map((_, rep) => (
                      <span key={rep} style={{
                        fontSize: isMobile ? '1.2rem' : '1.6rem',
                        color: 'rgba(255,215,0,0.4)',
                        fontWeight: 600,
                        letterSpacing: 2,
                        paddingRight: 60,
                      }}>
                        Friends who slay together stay together ✦ Real ones don't need a reason to show up ✦
                        You're stuck with me forever ✦ Cheers to the chaos we call friendship ✦
                        My favorite notification is you ✦ We're basically a two-person cult ✦{' '}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Friendship Stats */}
                <div style={{
                  padding: isMobile ? '40px 16px' : '50px 40px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                }}>
                  <motion.h2
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    style={{ color: '#FFD700', fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 700, textAlign: 'center', margin: 0 }}
                  >
                    Our Friendship in Numbers
                  </motion.h2>

                  <div style={{
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: isMobile ? 16 : 28,
                    marginTop: 12,
                  }}>
                    {[
                      { num: '∞', label: 'Inside Jokes' },
                      { num: '24/7', label: 'Availability' },
                      { num: '100%', label: 'Trust Level' },
                      { num: '0', label: 'Judgement' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.7, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12, type: 'spring' }}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 20, padding: isMobile ? '20px 24px' : '28px 36px',
                          textAlign: 'center', minWidth: isMobile ? 130 : 150,
                          border: '1px solid rgba(255,215,0,0.12)',
                        }}
                      >
                        <div style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: 800, color: '#FFD700' }}>
                          {stat.num}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: 4 }}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* STORY CHAPTER 6: GRAND FINALE CERTIFICATE             */}
                {/* ---------------------------------------------------- */}
                <div style={{ padding: isMobile ? '50px 16px 80px' : '70px 40px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <span style={{
                      background: 'rgba(255,215,0,0.15)', color: '#FFD700',
                      fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.5,
                      padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase'
                    }}>
                      Chapter 5 • The Grand Finale
                    </span>
                    <h2 style={{ color: '#FFD700', fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 800, marginTop: 8 }}>
                      Official Certificate of Friendship 📜
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: 0 }}>
                      Sealed permanently under the laws of lifelong best friends
                    </p>
                  </div>

                  {/* Certificate Canvas Node */}
                  <motion.div
                    ref={certRef}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background: 'linear-gradient(135deg, #151328 0%, #0d0b1a 100%)',
                      border: '3px solid #FFD700',
                      borderRadius: 24,
                      padding: isMobile ? '32px 20px' : '50px 44px',
                      maxWidth: 680,
                      width: '100%',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,215,0,0.15)',
                      position: 'relative',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Inner ornamental border */}
                    <div style={{
                      border: '1px dashed rgba(255,215,0,0.4)',
                      borderRadius: 16,
                      padding: isMobile ? '20px 14px' : '30px 24px',
                      textAlign: 'center',
                      position: 'relative',
                    }}>
                      {/* Corner Accents */}
                      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            top: corner.includes('top') ? 6 : 'auto',
                            bottom: corner.includes('bottom') ? 6 : 'auto',
                            left: corner.includes('left') ? 6 : 'auto',
                            right: corner.includes('right') ? 6 : 'auto',
                            color: '#FFD700', fontSize: '1.2rem', opacity: 0.7,
                          }}
                        >
                          ✦
                        </div>
                      ))}

                      {/* Header Badge */}
                      <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏆</div>
                      <h2 style={{
                        fontFamily: "'Cinzel', serif",
                        color: '#FFD700',
                        fontSize: isMobile ? '1.4rem' : '2.1rem',
                        letterSpacing: 2,
                        margin: '0 0 6px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}>
                        Certificate of Friendship
                      </h2>

                      <p style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.8rem',
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        margin: '0 0 24px',
                      }}>
                        Official Unbreakable Bond Registry • ID #BFF-2026-999
                      </p>

                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '0.95rem' : '1.1rem', margin: '0 0 8px' }}>
                        This certifies that
                      </p>

                      <h3 style={{
                        fontFamily: "'Satisfy', cursive",
                        color: '#FF6B6B',
                        fontSize: isMobile ? '2.2rem' : '3rem',
                        margin: '0 0 12px',
                        textShadow: '0 2px 10px rgba(255,107,107,0.3)',
                      }}>
                        {recipientName}
                      </h3>

                      <p style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: isMobile ? '0.9rem' : '1.05rem',
                        lineHeight: 1.7,
                        maxWidth: 500,
                        margin: '0 auto 28px',
                      }}>
                        is officially designated as the Best Friend For Life of <strong>{senderName}</strong>.
                        Granted full privileges of unhinged laughter, midnight emergency calls, shared brain cells, and eternal loyalty without expiration.
                      </p>

                      {/* Signature Lines Block */}
                      <div style={{
                        display: 'flex',
                        justify: 'space-around',
                        alignItems: 'flex-end',
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: '1px solid rgba(255,215,0,0.2)',
                        gap: 16,
                      }}>
                        {/* Sender signature */}
                        <div style={{ textAlign: 'center' }}>
                          <p style={{
                            fontFamily: "'Satisfy', cursive",
                            color: '#FFD700', fontSize: isMobile ? '1.2rem' : '1.6rem',
                            margin: '0 0 2px',
                          }}>
                            {senderName} ✍️
                          </p>
                          <div style={{ width: 120, height: 1, background: 'rgba(255,215,0,0.5)', margin: '0 auto 4px' }} />
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Issued By</span>
                        </div>

                        {/* Recipient signature / interactive sign */}
                        <div style={{ textAlign: 'center' }}>
                          {isSigned ? (
                            <motion.p
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{
                                fontFamily: "'Satisfy', cursive",
                                color: '#A8E6CF', fontSize: isMobile ? '1.2rem' : '1.6rem',
                                margin: '0 0 2px',
                              }}
                            >
                              {recipientName} ✨
                            </motion.p>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setIsSigned(true)
                                setShowConfetti(true)
                                setTimeout(() => setShowConfetti(false), 5000)
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                border: 'none', borderRadius: 16, padding: '6px 14px',
                                color: '#1a1a2e', fontWeight: 800, fontSize: '0.8rem',
                                cursor: 'pointer', marginBottom: 4,
                              }}
                            >
                              Sign Here ✍️
                            </motion.button>
                          )}
                          <div style={{ width: 120, height: 1, background: 'rgba(255,215,0,0.5)', margin: '0 auto 4px' }} />
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                            {isSigned ? 'Signed & Sealed' : 'Tap to Sign'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Certificate Action Buttons */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadCertificate}
                      style={{
                        padding: '14px 28px', borderRadius: 30, border: 'none',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B6B)',
                        color: '#1a1a2e', fontWeight: 800, fontSize: '1rem',
                        cursor: 'pointer', boxShadow: '0 8px 25px rgba(255,215,0,0.3)',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      <span>{downloadingCert ? '⏳ Generating PNG...' : '📜 Save Certificate PNG'}</span>
                    </motion.button>
                  </div>
                </div>

                {/* footer */}
                <div style={{
                  textAlign: 'center', padding: '30px 20px 50px',
                  color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem',
                }}>
                  Made with ❤️ by your best friend!
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  )
}

