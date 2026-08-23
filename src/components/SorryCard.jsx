import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Load Google Fonts for clean typography
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Outfit:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  return null;
};

const playChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
    });
  } catch (e) {
    // muted
  }
};

const SorryCard = () => {
  const { width, height } = useWindowSize();
  const [step, setStep] = useState('closed'); // 'closed' | 'opening' | 'read'
  const [response, setResponse] = useState(null); // 'forgiven' | 'hug' | null

  const handleOpenEnvelope = () => {
    if (step !== 'closed') return;
    playChime();
    setStep('opening');
    setTimeout(() => {
      setStep('read');
    }, 1100);
  };

  const handleForgive = () => {
    playChime();
    setResponse('forgiven');
  };

  const handleHug = () => {
    playChime();
    setResponse('hug');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(circle at center, #231221 0%, #0d060c 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <FontLoader />

      {/* Confetti celebration */}
      {response === 'forgiven' && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={220}
          recycle={false}
          gravity={0.2}
          colors={['#ffb3c1', '#72efdd', '#ffd166', '#ff4d6d', '#e2afff']}
        />
      )}

      {/* Ambient Floating Sparkles & Blossoms */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '105vh', opacity: 0, rotate: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.45, 0.45, 0],
              rotate: 360,
              x: Math.sin(i) * 70
            }}
            transition={{
              duration: 9 + (i % 5) * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              left: `${(i * 7.5) % 95}%`,
              fontSize: `${1 + (i % 3) * 0.4}rem`,
              color: 'rgba(255, 179, 193, 0.25)'
            }}
          >
            {i % 2 === 0 ? '✨' : '🌸'}
          </motion.div>
        ))}
      </div>

      {/* Main Centered Container */}
      <div style={{
        zIndex: 10,
        width: '100%',
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        <AnimatePresence mode="wait">
          {/* STEP 1 & 2: ENVELOPE (CLOSED OR OPENING) */}
          {(step === 'closed' || step === 'opening') && (
            <motion.div
              key="envelope-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Centered Heading */}
              <h2 style={{
                color: '#ffccd5',
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '24px',
                textAlign: 'center',
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(255, 179, 193, 0.2)'
              }}>
                A message for my best friend... ✉️
              </h2>

              {/* 3D Envelope Wrapper - Fixed Size & Stable Placement */}
              <div 
                onClick={handleOpenEnvelope}
                style={{
                  position: 'relative',
                  width: '340px',
                  height: '220px',
                  margin: '0 auto',
                  cursor: step === 'closed' ? 'pointer' : 'default',
                  perspective: '1000px'
                }}
              >
                {/* 1. Envelope Back Container */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#f8bbd0',
                  borderRadius: '18px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 179, 193, 0.2)',
                  overflow: 'hidden'
                }}>
                  {/* Inside Shadow */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)'
                  }} />
                </div>

                {/* 2. Letter Peek Inside Envelope */}
                <motion.div
                  animate={step === 'opening' ? { y: -85 } : { y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    left: '20px',
                    right: '20px',
                    height: '175px',
                    background: '#fffdf9',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '16px',
                    boxSizing: 'border-box',
                    zIndex: 2,
                    border: '1px solid #f3d5d8'
                  }}
                >
                  <p style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.4rem',
                    color: '#800f2f',
                    margin: 0,
                    fontWeight: 'bold'
                  }}>
                    Hey Bestie... 🤝
                  </p>
                  <p style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.15rem',
                    color: '#5c3d46',
                    marginTop: '8px',
                    lineHeight: '1.4'
                  }}>
                    I'm so sorry for goofing up... 🌸
                  </p>
                </motion.div>

                {/* 3. Envelope Pocket Flaps (Left, Right, Bottom) */}
                <svg
                  viewBox="0 0 340 220"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 3,
                    pointerEvents: 'none',
                    borderRadius: '18px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Left Flap */}
                  <path d="M 0 0 L 170 120 L 0 220 Z" fill="#f48fb1" />
                  {/* Right Flap */}
                  <path d="M 340 0 L 170 120 L 340 220 Z" fill="#f48fb1" />
                  {/* Bottom Flap */}
                  <path d="M 0 220 L 170 110 L 340 220 Z" fill="#f06292" />
                </svg>

                {/* 4. Envelope Top Flap (3D Flip Animation) */}
                <motion.div
                  animate={step === 'opening' ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 4 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '340px',
                    height: '120px',
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none'
                  }}
                >
                  <svg 
                    viewBox="0 0 340 120" 
                    style={{ width: '100%', height: '100%', display: 'block', borderRadius: '18px 18px 0 0' }}
                  >
                    <path d="M 0 0 L 170 118 L 340 0 Z" fill="#ec407a" />
                  </svg>
                </motion.div>

                {/* 5. Wax Seal Button - Fixed Center Position */}
                {step === 'closed' && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #ff5252 0%, #c62828 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 4px 15px rgba(198, 40, 40, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                      zIndex: 10,
                      border: '2px solid #ff8a80',
                      pointerEvents: 'none'
                    }}
                  >
                    💌
                  </motion.div>
                )}
              </div>

              {/* Tap Subtitle */}
              <p style={{
                marginTop: '24px',
                fontSize: '0.85rem',
                color: '#ffccd5',
                fontStyle: 'italic',
                opacity: 0.85,
                textAlign: 'center'
              }}>
                (Tap envelope to open)
              </p>
            </motion.div>
          )}

          {/* STEP 3: READ FRIENDSHIP APOLOGY LETTER */}
          {step === 'read' && (
            <motion.div
              key="friendship-letter"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                width: '100%',
                background: '#fffdf9',
                borderRadius: '20px',
                padding: '38px 32px 32px 32px',
                boxSizing: 'border-box',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 179, 193, 0.3)',
                position: 'relative',
                border: '1px solid #f3d5d8',
                backgroundImage: 'linear-gradient(rgba(244, 216, 220, 0.3) 1px, transparent 1px)',
                backgroundSize: '100% 30px'
              }}
            >
              {/* Ribbon Badge */}
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #ec407a, #ab47bc)',
                color: '#ffffff',
                padding: '4px 22px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(236, 64, 122, 0.4)'
              }}>
                FOR MY BEST FRIEND 🤝
              </div>

              {/* Letter Heading */}
              <h3 style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '2.3rem',
                color: '#800f2f',
                margin: '0 0 16px 0',
                fontWeight: '700'
              }}>
                Hey Bestie... 🥺
              </h3>

              {/* Friendship Apology Content */}
              <div style={{
                fontFamily: "'Caveat', cursive",
                color: '#3d242b',
                lineHeight: '1.75',
                fontSize: '1.35rem'
              }}>
                <p style={{ margin: '0 0 16px 0' }}>
                  I know ki you may be still annoyed but i really hope ki this friendship really stays strong yaar , and the last thing I ever want to do is mess things up or cause any arguement between us.
                </p>

                <p style={{ margin: '0 0 16px 0' }}>
                  You are one special and genuine friend i happened to make yaar bebo. Our crazy gossips, and bond mean so much to me, and I hate thinking that I hurt you in any way, kabhi aaya nahi ki it would take a turn like this.
                </p>

                <p style={{ margin: '0 0 22px 0', color: '#800f2f', fontWeight: 'bold' }}>
                  I promise to be a better friend, and always have your back. Can we put this behind us abhi pleaseeeee ? 🤝✨
                </p>
              </div>

              {/* Response Buttons */}
              {response === null ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginTop: '10px'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleForgive}
                    style={{
                      padding: '14px 24px',
                      fontSize: '1.15rem',
                      fontFamily: "'Caveat', cursive",
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #ec407a, #ab47bc)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(236, 64, 122, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Forgiven! Besties Forever 🤝✨
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleHug}
                    style={{
                      padding: '12px 24px',
                      fontSize: '1.1rem',
                      fontFamily: "'Caveat', cursive",
                      background: '#fff0f3',
                      color: '#ab47bc',
                      border: '1.5px solid #f48fb1',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Need a Hug & Starbucks Treat 🧋
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    marginTop: '20px',
                    padding: '18px',
                    background: '#fff0f3',
                    borderRadius: '14px',
                    border: '1px solid #ffccd5',
                    textAlign: 'center'
                  }}
                >
                  <p style={{
                    fontSize: '1.4rem',
                    color: '#c2185b',
                    fontWeight: 'bold',
                    margin: '0 0 6px 0',
                    fontFamily: "'Caveat', cursive"
                  }}>
                    {response === 'forgiven' ? 'You are the best friend ever! 🎉🤝' : 'Sending big hugs & starbucks treat soon! 🧋💖'}
                  </p>
                  <p style={{
                    fontSize: '1.15rem',
                    color: '#5c3d46',
                    margin: 0,
                    fontFamily: "'Caveat', cursive"
                  }}>
                    {response === 'forgiven'
                      ? 'Thank you for being so understanding! Food/starbucks on me next time!'
                      : 'Infinite warm hugs coming your way right now! Besties forever!'}
                  </p>
                </motion.div>
              )}

              {/* Close & Re-fold button */}
              <div style={{ marginTop: '26px', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setStep('closed');
                    setResponse(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ab47bc',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontFamily: 'sans-serif',
                    opacity: 0.85
                  }}
                >
                  Close & Re-fold Letter ✉️
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default SorryCard;
