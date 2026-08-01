import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'
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
  const { width, height } = useWindowSize()
  const audioRef = useRef(new Audio(friendshipSong))
  const isMobile = width < 600

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
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Satisfy&family=Outfit:wght@300;400;600;700;800&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .shimmer-text{
          background:linear-gradient(90deg,#FFD700,#FFF,#FFD700,#FFF,#FFD700);
          background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
          animation:shimmer 3s linear infinite;
        }
        .float-anim{animation:floatY 2.5s ease-in-out infinite}
        @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      `}</style>

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
                    audioRef.current.play().catch((e) => console.error('Audio playback failed:', e))
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
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>Scroll down for your message</p>
                  <span style={{ fontSize: '1.5rem' }}>👇</span>
                </motion.div>
              )}
            </div>

            {/* ====== BEAD QUALITY CARDS ====== */}
            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              >
                {/* quality cards section */}
                <div style={{ padding: isMobile ? '40px 16px' : '60px 40px', maxWidth: 900, margin: '0 auto' }}>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ color: '#FFD700', fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}
                  >
                    Every Bead Tells a Story
                  </motion.h2>

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

                {/* ====== LETTER ====== */}
                <div style={{ padding: isMobile ? '40px 16px 20px' : '60px 40px 20px', display: 'flex', justifyContent: 'center' }}>
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
                      Dear Bebo,
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
                      and my best days into core memories. <br /><br />
                      Thank you for seeing me as a good friend in this past 2 months we really grew into buddies and thank you for being my unpaid therapist, my hype person, who never judges me
                      and the only one who truly gets my weird humor. <br /><br />
                      Here's to us — unbreakable, unmatched, and a little unhinged 🤝
                      <br /><br />
                      <span style={{ fontSize: isMobile ? '1.6rem' : '2rem', color: '#FFD700' }}>
                        — Your Forever Buddyyy , jay!
                      </span>
                    </p>
                  </motion.div>
                </div>

                {/* ====== MARQUEE ====== */}
                <div style={{
                  overflow: 'hidden',
                  padding: '30px 0',
                  marginTop: 40,
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

                {/* ====== FRIENDSHIP FACTS TICKER ====== */}
                <div style={{
                  padding: isMobile ? '50px 16px' : '70px 40px',
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
                    marginTop: 16,
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
