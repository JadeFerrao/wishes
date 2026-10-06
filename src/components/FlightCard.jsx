import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import planeImg from '../assets/plane.png';
import indigoLogo from '../assets/indigologo.png';
import indigoTune from '../assets/indigo-tune.mp3';
import picShot from '../assets/picshot.png';

/* ─────────────────────────────────────────
   Cloud SVG helper
───────────────────────────────────────── */
const Cloud = ({ style }) => (
  <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" style={style}>
    <ellipse cx="100" cy="50" rx="90" ry="30" fill="white" fillOpacity="0.85" />
    <ellipse cx="70"  cy="40" rx="50" ry="28" fill="white" fillOpacity="0.9" />
    <ellipse cx="130" cy="42" rx="45" ry="25" fill="white" fillOpacity="0.9" />
    <ellipse cx="100" cy="35" rx="35" ry="22" fill="white" fillOpacity="0.95" />
  </svg>
);

/* ─────────────────────────────────────────
   Star field for tarmac phase
───────────────────────────────────────── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 3,
}));

/* ─────────────────────────────────────────
   Runway lights
───────────────────────────────────────── */
const RunwayLights = () => (
  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 2, pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%',
      background: 'linear-gradient(to top, #1a1a2e 0%, #16213e 60%, transparent 100%)',
    }} />
    {Array.from({ length: 14 }).map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        bottom: `${8 + i * 5}%`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 6,
        height: 24,
        borderRadius: 3,
        background: '#ffe97a',
        boxShadow: '0 0 12px 4px rgba(255,233,122,0.8)',
        opacity: 0.85,
        animation: `pulse ${0.8 + (i % 3) * 0.2}s ease-in-out infinite alternate`,
      }} />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <React.Fragment key={i}>
        <div style={{
          position: 'absolute',
          bottom: `${10 + i * 5}%`,
          left: `${28 - i * 1.5}%`,
          width: 8, height: 8, borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 10px 3px rgba(0,212,255,0.9)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: `${10 + i * 5}%`,
          right: `${28 - i * 1.5}%`,
          width: 8, height: 8, borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 10px 3px rgba(0,212,255,0.9)',
        }} />
      </React.Fragment>
    ))}
  </div>
);

/* ─────────────────────────────────────────
   Boarding Pass
───────────────────────────────────────── */
const BoardingPass = ({ name, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ scaleY: 0, opacity: 0, rotateX: -90 }}
        animate={{ scaleY: 1, opacity: 1, rotateX: 0 }}
        exit={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{
          perspective: 1200,
          transformOrigin: 'top center',
          width: 'min(520px, 92vw)',
          margin: '0 auto',
          zIndex: 30,
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
          borderRadius: 20,
          boxShadow: '0 30px 80px rgba(0,60,120,0.4), 0 0 0 1px rgba(255,255,255,0.3)',
          overflow: 'hidden',
          fontFamily: "'Outfit', sans-serif",
          position: 'relative',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #1a3a8f 0%, #0066cc 50%, #1a3a8f 100%)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <img src={indigoLogo} alt="IndiGo" style={{ height: 66, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <div style={{ color: '#ffe97a', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 3 }}>BOARDING PASS</div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1a3a8f', letterSpacing: -1 }}>BOM</div>
              <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: 2, marginTop: 2 }}>MUMBAI</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: '1.6rem' }}>✈</div>
              <div style={{ width: 80, height: 2, background: 'linear-gradient(90deg, #1a3a8f, #0099ff)' }} />
              <div style={{ fontSize: '0.65rem', color: '#888', letterSpacing: 1 }}>NON-STOP</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0066cc', letterSpacing: -1 }}>SKY</div>
              <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: 2, marginTop: 2 }}>THE WORLD</div>
            </div>
          </div>

          <div style={{ position: 'relative', height: 28, margin: '0 -1px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '2px dashed #cce0ff', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: -14, width: 28, height: 28, borderRadius: '50%', background: 'transparent', boxShadow: '0 0 0 28px white', transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', right: -14, width: 28, height: 28, borderRadius: '50%', background: 'transparent', boxShadow: '0 0 0 28px white', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ padding: '16px 24px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'PASSENGER', value: name || '' },
              { label: 'FLIGHT', value: '6E-2026' },
              { label: 'SEAT', value: '1A' },
              { label: 'CLASS', value: 'FRIENDSHIP' },
              { label: 'GATE', value: 'BESTIEEEE' },
              { label: 'BOARDING', value: 'NOW' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.6rem', color: '#999', letterSpacing: 2, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a3a8f' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#f8faff',
            borderTop: '1px solid #e0eeff',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{
                  width: i % 3 === 0 ? 3 : 2,
                  height: 36,
                  background: '#1a3a8f',
                  opacity: 0.7 + (i % 3) * 0.1,
                }} />
              ))}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: 1 }}>6E 2026 001</div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────
   Main FlightCard
───────────────────────────────────────── */
const FlightCard = ({ name = "Trisha Saha" }) => {
  const [phase, setPhase] = useState('tarmac');
  const [showBoardingPass, setShowBoardingPass] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const audioRef = useRef(null);
  const { width, height } = useWindowSize();

  const handleTakeoff = () => {
    setPhase('takeoff');
    setTimeout(() => {
      setPhase('sky');
      setShowConfetti(true);
      setTimeout(() => setShowBoardingPass(true), 600);
      setTimeout(() => setShowMessage(true), 1200);
      setTimeout(() => setShowConfetti(false), 7000);
      // Auto-play IndiGo tune from 0:32
      if (audioRef.current) {
        audioRef.current.currentTime = 32;
        audioRef.current.play().catch(() => {});
      }
    }, 3200);
  };

  const bgStyle = {
    tarmac: 'linear-gradient(to bottom, #0a0a1a 0%, #0d1b3e 40%, #16213e 70%, #1a2a3a 100%)',
    takeoff: 'linear-gradient(to bottom, #0d1b3e 0%, #1a3a7a 30%, #2d6ab5 70%, #4a9fd4 100%)',
    sky: 'linear-gradient(to bottom, #87ceeb 0%, #b8e4f7 30%, #d4f1ff 60%, #e8f8ff 100%)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: bgStyle[phase],
      transition: 'background 2.5s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');
        @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }
        @keyframes float-cloud { from { transform: translateX(110vw); } to { transform: translateX(-120vw); } }
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float-emoji { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-200px) rotate(20deg); opacity: 0; } }
        @keyframes engine-glow { 0%,100% { box-shadow: 0 0 20px 8px rgba(120,200,255,0.5); } 50% { box-shadow: 0 0 40px 15px rgba(120,200,255,0.9); } }
      `}</style>

      {/* Stars */}
      {phase === 'tarmac' && STARS.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          background: 'white',
          animation: `twinkle ${2 + s.delay}s ease-in-out infinite`,
          animationDelay: `${s.delay}s`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      ))}

      {/* Runway */}
      {phase === 'tarmac' && <RunwayLights />}

      {/* Animated clouds (sky) */}
      {phase === 'sky' && [
        { top: '8%', size: 300, speed: '32s', delay: '0s' },
        { top: '22%', size: 200, speed: '46s', delay: '-14s' },
        { top: '50%', size: 340, speed: '38s', delay: '-8s' },
        { top: '65%', size: 190, speed: '52s', delay: '-25s' },
        { top: '38%', size: 250, speed: '40s', delay: '-20s' },
      ].map((c, i) => (
        <Cloud key={i} style={{
          position: 'fixed',
          top: c.top,
          left: 0,
          width: c.size,
          opacity: 0.8,
          animation: `float-cloud ${c.speed} linear infinite`,
          animationDelay: c.delay,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      ))}

      {/* TAKEOFF animation — left → right */}
      {phase === 'takeoff' && (
        <motion.div
          initial={{ x: '-60vw', y: '20vh', rotate: -8, scale: 0.7 }}
          animate={{ x: '110vw', y: '-10vh', rotate: -8, scale: 1.0 }}
          transition={{ duration: 3.2, ease: [0.2, 0.8, 0.6, 1] }}
          style={{
            position: 'fixed',
            top: '30%',
            left: 0,
            zIndex: 50,
            pointerEvents: 'none',
            width: 'min(600px, 80vw)',
            filter: 'drop-shadow(0 20px 40px rgba(0,100,255,0.5))',
          }}
        >
          {/* contrail behind the plane (to the left) */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.55, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 2.5 }}
            style={{
              position: 'absolute',
              right: '96%',
              top: '42%',
              width: 320,
              height: 8,
              background: 'linear-gradient(to left, rgba(255,255,255,0.95), transparent)',
              borderRadius: 10,
              transformOrigin: 'right center',
              filter: 'blur(4px)',
            }}
          />
          <img src={planeImg} alt="IndiGo plane" style={{ width: '100%', mixBlendMode: 'screen' }} />
        </motion.div>
      )}

      {/* SKY: plane flies left → right continuously */}
      {phase === 'sky' && (
        <motion.div
          initial={{ x: '-30vw' }}
          animate={{ x: '110vw', y: [0, -12, 6, 0] }}
          transition={{
            x: { duration: 18, ease: 'linear', repeat: Infinity, repeatDelay: 4 },
            y: { duration: 6, ease: 'easeInOut', repeat: Infinity },
          }}
          style={{
            position: 'fixed',
            top: '6vh',
            left: 0,
            width: 'min(260px, 38vw)',
            zIndex: 5,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 10px 30px rgba(0,60,180,0.25))',
          }}
        >
          {/* contrail to the left of plane */}
          <div style={{
            position: 'absolute',
            right: '96%', top: '48%',
            width: 130, height: 4,
            background: 'linear-gradient(to left, rgba(255,255,255,0.85), transparent)',
            borderRadius: 4,
            filter: 'blur(2px)',
          }} />
          <img src={planeImg} alt="plane" style={{ width: '100%', mixBlendMode: 'screen' }} />
        </motion.div>
      )}

      {/* Confetti */}
      {showConfetti && (
        <>
          <Confetti width={width} height={height} numberOfPieces={260} recycle={false}
            colors={['#1a3a8f', '#0099ff', '#ffe97a', '#ffffff', '#00d4ff', '#ff6bac']}
            gravity={0.25} initialVelocityY={15} />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              position: 'fixed',
              left: `${5 + i * 9}%`,
              bottom: '-20px',
              fontSize: '1.4rem',
              animation: `float-emoji ${2 + i * 0.3}s ease-out forwards`,
              animationDelay: `${i * 0.2}s`,
              zIndex: 100,
              pointerEvents: 'none',
            }}>✈️</div>
          ))}
        </>
      )}

      {/* ── TARMAC CONTENT ── */}
      {phase === 'tarmac' && (
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div style={{
              border: '2px solid rgba(0,212,255,0.4)',
              borderRadius: 12,
              padding: '8px 24px',
              display: 'inline-block',
              marginBottom: 24,
              background: 'rgba(0,212,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ color: '#00d4ff', letterSpacing: 5, fontSize: '0.75rem', fontWeight: 600 }}>
                ✦ SPECIAL DEPARTURE LOUNGE ✦
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 900,
              color: 'white',
              margin: '0 0 12px',
              textShadow: '0 0 40px rgba(0,150,255,0.6)',
              letterSpacing: -1,
            }}>
              Your Flight is Ready ✈️
            </h1>
            <p style={{
              color: 'rgba(180,210,255,0.85)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
              margin: '0 auto 40px',
              maxWidth: 420,
              lineHeight: 1.6,
            }}>
              A very special card is cleared for takeoff.<br />
              Ready to board?
            </p>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginBottom: 40 }}
            >
              <img src={planeImg} alt="plane on tarmac"
                style={{
                  width: 'min(380px, 80vw)',
                  filter: 'drop-shadow(0 20px 40px rgba(0,100,255,0.6)) brightness(1.05)',
                  mixBlendMode: 'screen',
                }}
              />
              <div style={{
                width: 60, height: 12, borderRadius: 6,
                background: 'rgba(120,200,255,0.3)',
                margin: '-10px auto 0',
                animation: 'engine-glow 1.5s ease-in-out infinite',
              }} />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.07, boxShadow: '0 20px 60px rgba(0,180,255,0.6)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleTakeoff}
              style={{
                padding: '18px 48px',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                background: 'linear-gradient(135deg, #0066cc 0%, #00a8ff 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 50,
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,130,255,0.5)',
                letterSpacing: 1,
              }}
            >
              🛫 Open the Card
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ── SKY CONTENT ── */}
      {phase === 'sky' && (
        <div style={{
          position: 'relative', zIndex: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '20px 16px 60px',
          width: '100%',
          maxWidth: 620,
          gap: 28,
        }}>


          {/* ── Person photo ── */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                key="photo"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
                style={{ position: 'relative', flexShrink: 0 }}
              >
                {/* spinning conic ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    inset: -5,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #0066cc, #00d4ff, #ffe97a, #0066cc)',
                    zIndex: 0,
                  }}
                />
                {/* white gap */}
                <div style={{
                  position: 'absolute', inset: -2,
                  borderRadius: '50%', background: 'white', zIndex: 1,
                }} />
                {/* photo */}
                <img
                  src={picShot}
                  alt="Trisha Saha"
                  style={{
                    width: 110, height: 110,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: '0 8px 30px rgba(0,80,200,0.35)',
                  }}
                />
                {/* ✈ badge */}
                <div style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a3a8f, #0099ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', zIndex: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  border: '2px solid white',
                }}>✈</div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showMessage && (
              <motion.div
                key="heading"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #1a3a8f, #0099ff)',
                  borderRadius: 50,
                  padding: '6px 20px',
                  marginBottom: 14,
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 3 }}>
                    ✦ CONGRATULATIONS ✦
                  </span>
                </div>

                <motion.h1
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.4 }}
                  style={{
                    fontSize: 'clamp(2rem, 7vw, 3.5rem)',
                    fontWeight: 900,
                    color: '#1a2a6c',
                    margin: '0 0 10px',
                    lineHeight: 1.1,
                    textShadow: '0 4px 20px rgba(0,60,180,0.15)',
                  }}
                >
                  Soaring to New Heights! ✈️
                </motion.h1>

                <p style={{
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
                  color: '#2d5aa0',
                  lineHeight: 1.7,
                  maxWidth: 480,
                  margin: '0 auto 8px',
                }}>
                  To the most amazing flight attendant, myyy bestieee & bebo — your kindness, grace, and smile surely lights up every cabin you walk into. Here's to you and your incredible journey ahead!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Golden badge */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                key="badge"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, type: 'spring', bounce: 0.5 }}
                style={{
                  background: 'linear-gradient(135deg, #ffd700, #ffb300, #ff8c00)',
                  borderRadius: '50%',
                  width: 110, height: 110,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 6px white, 0 0 0 8px #ffd700, 0 20px 50px rgba(255,180,0,0.5)',
                  textAlign: 'center',
                  padding: 10,
                  animation: 'spin-slow 20s linear infinite',
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: '2rem' }}>✈️</div>
                <div style={{ fontSize: '0.48rem', fontWeight: 800, color: 'white', letterSpacing: 1, lineHeight: 1.3 }}>
                  FLIGHT<br />ATTENDANT<br />OF THE YEAR
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boarding Pass */}
          <BoardingPass name={name} visible={showBoardingPass} />

          {/* Message card */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 20,
                  padding: '24px 28px',
                  width: '100%',
                  boxShadow: '0 20px 60px rgba(0,60,120,0.2)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>💙</div>
                <p style={{
                  fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
                  color: '#1a3a6c',
                  lineHeight: 1.8,
                  margin: 0,
                  fontStyle: 'italic',
                }}>
                  "The sky is not the limit always remember that. Thank you for being you. Keep flying high and making every journey magical bebo 🌟"
                </p>
                <div style={{ marginTop: 16, fontWeight: 700, color: '#0066cc', fontSize: '0.9rem' }}>
                  — With lots of love & lots of sky-high wishes 💙✈️
                </div>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16 }}>
                  {['✈️', '⭐', '🌤️', '💙', '🛫'].map((emoji, i) => (
                    <motion.span key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ fontSize: '1.4rem' }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Music button removed — tune auto-plays on sky entry */}
        </div>
      )}

      <audio ref={audioRef} loop>
        <source src={indigoTune} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default FlightCard;
