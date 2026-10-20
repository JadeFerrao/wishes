import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import planeImg from '../assets/plane.png';
import indigoLogo from '../assets/indigologo.png';
import indigoTune from '../assets/indigo-tune.mp3';
import picShot from '../assets/picshot.png';
import html2canvas from 'html2canvas';
import AircraftCabin3D from './AircraftCabin3D';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
const BoardingPass = ({ name, visible }) => {
  const passRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!passRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(passRef.current, {
        scale: 3, // crisp high resolution
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanName = (name || 'Passenger').replace(/\s+/g, '_');
      link.download = `${cleanName}_IndiGo_BoardingPass.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to download boarding pass:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Ticket Card to Capture */}
          <div
            ref={passRef}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
              borderRadius: 20,
              boxShadow: '0 30px 80px rgba(0,60,120,0.4), 0 0 0 1px rgba(255,255,255,0.3)',
              overflow: 'hidden',
              fontFamily: "'Outfit', sans-serif",
              position: 'relative',
            }}
          >
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
                { label: 'GATE', value: 'CS LINE TRAINER' },
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

          {/* Download Pass Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(0, 102, 204, 0.4)' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDownload}
            disabled={downloading}
            style={{
              marginTop: 18,
              padding: '12px 26px',
              borderRadius: 50,
              background: downloadSuccess
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #1a3a8f 0%, #0066cc 100%)',
              color: 'white',
              border: 'none',
              cursor: downloading ? 'not-allowed' : 'pointer',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: downloadSuccess
                ? '0 8px 25px rgba(16, 185, 129, 0.4)'
                : '0 8px 25px rgba(0, 102, 204, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {downloading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  ⏳
                </motion.span>
                <span>Generating Pass...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <span>✅</span>
                <span>Pass Downloaded!</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem' }}>📥</span>
                <span>Download Boarding Pass</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


/* ─────────────────────────────────────────
   Flight Attendant Praise Flip Cards Section
───────────────────────────────────────── */
const PRAISE_CARDS = [
  {
    id: 1,
    icon: '⏰',
    tag: '01 • SLEEP SACRIFICE',
    frontTitle: 'The Fun & Smiles',
    frontText: 'Being a flight attendant looks like pure fun, glamour, and soaring excitement...',
    backTitle: 'Waking When the World Sleeps',
    backText: '...constantly waking up at ungodly hours when the rest of the world is fast asleep, gathering all your energy to safely fly hundreds of souls.',
    praise: 'Your morning discipline & sheer dedication is unmatched! 🌟',
    badgeColor: '#00d4ff',
  },
  {
    id: 2,
    icon: '🤝',
    tag: '02 • FLEETING BONDS',
    frontTitle: 'New Faces Daily',
    frontText: 'Meeting exciting new crew members and passengers on every single route...',
    backTitle: 'A New Crew, Then Goodbye',
    backText: '...meeting a brand new crew every single day, but after a flight parting ways and not seeing them again. Giving your heart to fleeting moments.',
    praise: 'It takes a special heart to bring genuine warmth to brief hours! 💙',
    badgeColor: '#ffe97a',
  },
  {
    id: 3,
    icon: '🎂',
    tag: '03 • HOLIDAYS & CELEBRATIONS',
    frontTitle: 'The Permanent Holiday Myth',
    frontText: 'Everyone thinks you are always on a holiday living the jetsetter life...',
    backTitle: 'Working While Others Celebrate',
    backText: '...you actually work through festivals, birthdays, and weekends away from loved ones, sacrificing your holidays so others can fly home to theirs.',
    praise: 'A selfless, golden soul who brings families together! ✨',
    badgeColor: '#ff9ebb',
  },
  {
    id: 4,
    icon: '🏨',
    tag: '04 • LAYOVER REALITY',
    frontTitle: 'Luxurious Layovers',
    frontText: 'Layovers are pictured as glamorous vacations in fancy 5-star hotels...',
    backTitle: '24 Hours & Aching Feet',
    backText: '...they are often just 24 hours confined to a quiet hotel room, nursing aching feet and total body exhaustion after standing for hours on end.',
    praise: 'Your silent resilience and physical grit are truly heroic! 🛡️',
    badgeColor: '#70e000',
  },
  {
    id: 5,
    icon: '🤍',
    tag: '05 • PRECIOUS CONNECTIONS',
    frontTitle: 'Dearest Friends',
    frontText: 'Meeting fascinating people everywhere who happen to become close friends...',
    backTitle: 'Missing Those Who Matter Most',
    backText: '...having close friends who mean the absolute world to you, but having so little time to give them because your demanding roster takes it all.',
    praise: 'Distance and crazy schedules will never fade true love! 🫂',
    badgeColor: '#ffd166',
  },
  {
    id: 6,
    icon: '🌍',
    tag: '06 • SEEING THE WORLD',
    frontTitle: 'Breathtaking Destinations',
    frontText: 'Flying across borders and seeing the most beautiful cities from high above...',
    backTitle: 'Beautiful Places, Alone & Tired',
    backText: '...seeing beautiful places, but mostly seeing them all alone and exhausted, running on pure caffeine while missing the comfort of your own bed.',
    praise: 'The bravest, most admirable woman in the skies! 👑',
    badgeColor: '#00b4d8',
  },
];

const FlipCardItem = ({ card, isFlipped, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        perspective: 1200,
        cursor: 'pointer',
        height: 295,
        width: '100%',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── FRONT: What the world sees ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 20,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)',
            boxShadow: '0 15px 35px rgba(0, 70, 150, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
            border: '1px solid rgba(0, 102, 204, 0.15)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(10px)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: 2,
                color: '#0066cc',
                background: 'rgba(0, 102, 204, 0.08)',
                padding: '4px 10px',
                borderRadius: 20,
              }}>
                {card.tag}
              </span>
              <span style={{ fontSize: '1.6rem' }}>{card.icon}</span>
            </div>

            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#8899a6',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              What People Think ✦
            </div>

            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#1a3a8f',
              lineHeight: 1.25,
            }}>
              {card.frontTitle}
            </h3>

            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              color: '#334e68',
              lineHeight: 1.55,
              fontWeight: 500,
            }}>
              {card.frontText}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '1px dashed rgba(0, 102, 204, 0.15)',
          }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0066cc',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>🔄</span> Tap to reveal the reality
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#999',
              background: '#eef5fc',
              padding: '2px 8px',
              borderRadius: 12,
            }}>
              FLIP ⇄
            </span>
          </div>
        </div>

        {/* ── BACK: The Tough Reality & Praise ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 20,
            background: 'linear-gradient(145deg, #0d1b3e 0%, #162a60 60%, #102347 100%)',
            boxShadow: '0 15px 35px rgba(10, 25, 60, 0.4), 0 0 0 1px rgba(255, 233, 122, 0.3) inset',
            border: '1px solid rgba(255, 233, 122, 0.35)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'white',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: 2,
                color: '#ffe97a',
                background: 'rgba(255, 233, 122, 0.15)',
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid rgba(255, 233, 122, 0.3)',
              }}>
                ✦ THE TOUGH REALITY
              </span>
              <span style={{ fontSize: '1.4rem' }}>⭐</span>
            </div>

            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#ffe97a',
              lineHeight: 1.25,
            }}>
              {card.backTitle}
            </h3>

            <p style={{
              margin: 0,
              fontSize: '0.84rem',
              color: '#d6e4ff',
              lineHeight: 1.5,
              fontWeight: 400,
            }}>
              {card.backText}
            </p>
          </div>

          <div>
            {/* Praise pill */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderLeft: '3px solid #ffe97a',
              padding: '6px 10px',
              borderRadius: '0 10px 10px 0',
              marginBottom: 10,
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.35,
            }}>
              {card.praise}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            }}>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#90b4ce',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}>
                <span>↺</span> Tap to flip back
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#ffe97a',
                background: 'rgba(255, 233, 122, 0.18)',
                padding: '2px 8px',
                borderRadius: 12,
              }}>
                BACK
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FlightAttendantPraiseCards = ({ visible }) => {
  const [flippedMap, setFlippedMap] = useState({});

  const toggleSingle = (id) => {
    setFlippedMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            width: '100%',
            maxWidth: 620,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            margin: '10px 0 0',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', padding: '0 10px' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #1a3a8f 0%, #0066cc 100%)',
              borderRadius: 50,
              padding: '6px 18px',
              marginBottom: 10,
              boxShadow: '0 4px 15px rgba(0, 102, 204, 0.25)',
            }}>
              <span style={{ color: '#ffe97a', fontSize: '0.72rem', fontWeight: 800, letterSpacing: 2.5 }}>
                ✦ THE WINGS BEHIND THE SMILE ✦
              </span>
            </div>

            <h2 style={{
              margin: '0 0 8px',
              fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
              fontWeight: 900,
              color: '#1a3a8f',
              letterSpacing: -0.5,
              lineHeight: 1.2,
            }}>
              What It Really Takes ✈️
            </h2>

            <p style={{
              margin: '0 auto',
              maxWidth: 480,
              fontSize: 'clamp(0.85rem, 2.3vw, 0.96rem)',
              color: '#2d5aa0',
              lineHeight: 1.6,
            }}>
              The world only sees the effortless smile and high-flying glamour, but here's to the incredible resilience, sacrifices, and strength you carry every single day:
            </p>

          </div>

          {/* ── Cards Grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            width: '100%',
          }}>
            {PRAISE_CARDS.map(card => (
              <FlipCardItem
                key={card.id}
                card={card}
                isFlipped={!!flippedMap[card.id]}
                onToggle={() => toggleSingle(card.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   In-Flight Airmail / Message Section to Jayden
───────────────────────────────────────── */
const InflightMailSection = ({ visible }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [sentMessage, setSentMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const quickPills = [
    "💙 You're the absolute best jade!",
    "✈️ Proud of you always yaar!",
    "🌟 Loved this surprise, truee bestiee!",
    "🥰 Thank you for always cheering me up!",
  ];

  const handleAddPill = (pillText) => {
    setMessage(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${pillText}` : pillText;
    });
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) {
      alert("Please write a message before sending! ✈️💌");
      return;
    }

    setStatus('sending');
    setErrorMessage('');
    const textToSend = message.trim();

    try {
      // 1. Submit to FormSubmit to deliver straight to tomsnicker007@gmail.com
      const response = await fetch("https://formsubmit.co/ajax/tomsnicker007@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          _subject: "💌 In-flight Letter from Bebo (Trisha Sasha) for Jayden Ferrao",
          Recipient: "Jayden Ferrao",
          Sender: "Trisha Sasha (aka Bebo)",
          Message: textToSend,
          _captcha: "false",
          _template: "table",
        }),
      });

      // 2. Also back up to Firestore database
      try {
        await addDoc(collection(db, "inbox_messages"), {
          to: "Jayden Ferrao",
          from: "Trisha Sasha (aka Bebo)",
          message: textToSend,
          createdAt: serverTimestamp(),
        });
      } catch (fsErr) {
        console.warn("Firestore backup note:", fsErr);
      }

      setSentMessage(textToSend);
      setMessage('');
      setStatus('sent');
    } catch (err) {
      console.error("Error sending message:", err);
      // Fallback: Still attempt firestore backup
      try {
        await addDoc(collection(db, "inbox_messages"), {
          to: "Jayden Ferrao",
          from: "Trisha Sasha (aka Bebo)",
          message: textToSend,
          createdAt: serverTimestamp(),
        });
        setSentMessage(textToSend);
        setMessage('');
        setStatus('sent');
      } catch (fsErr) {
        setStatus('error');
        setErrorMessage("Couldn't send automatically right now. Please try again or open your mail app.");
      }
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="inflight-mail"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{
            width: '100%',
            maxWidth: 620,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 249, 255, 0.95) 100%)',
            backdropFilter: 'blur(16px)',
            borderRadius: 24,
            boxShadow: '0 25px 60px rgba(0, 60, 140, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.9) inset',
            border: '1.5px solid rgba(0, 102, 204, 0.18)',
            overflow: 'hidden',
            margin: '10px 0 20px',
            position: 'relative',
          }}
        >
          {/* Classic Airmail Border Ribbon */}
          <div style={{
            height: 9,
            width: '100%',
            background: 'repeating-linear-gradient(135deg, #0066cc 0px, #0066cc 16px, #ffffff 16px, #ffffff 26px, #d32f2f 26px, #d32f2f 42px, #ffffff 42px, #ffffff 52px)',
          }} />

          <div style={{ padding: '26px 24px 28px' }}>
            {/* Header: Stamp & Title */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 18,
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 200, textAlign: 'left' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(0, 102, 204, 0.08)',
                  color: '#0066cc',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}>
                  <span>✈️</span>
                  <span>In-Flight Dispatch • Airmail</span>
                </div>
                <h3 style={{
                  margin: '4px 0 2px',
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
                  fontWeight: 900,
                  color: '#0d1b3e',
                  letterSpacing: -0.3,
                }}>
                  Send a Letter to Jayden 💌
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.84rem',
                  color: '#4a6b99',
                  lineHeight: 1.4,
                }}>
                  Leave a personal message, secret thought, or warm reply!
                </p>
              </div>

              {/* Vintage Postage Stamp */}
              <div style={{
                border: '2px dashed rgba(0, 102, 204, 0.4)',
                borderRadius: 10,
                padding: '6px 12px',
                background: 'rgba(0, 102, 204, 0.04)',
                textAlign: 'center',
                minWidth: 80,
                alignSelf: 'flex-start',
              }}>
                <div style={{ fontSize: '1.2rem', lineHeight: 1 }}>✈️</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0066cc', letterSpacing: 1, marginTop: 2 }}>
                  PAR AVION
                </div>
                <div style={{ fontSize: '0.52rem', fontWeight: 700, color: '#688db5' }}>
                  PRIORITY 6E
                </div>
              </div>
            </div>

            {/* Letter Header: TO & FROM (Email hidden) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 14,
              padding: '12px 16px',
              border: '1px solid rgba(0, 102, 204, 0.14)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 18,
              textAlign: 'left',
              boxShadow: '0 2px 8px rgba(0, 60, 140, 0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #1a3a8f, #0066cc)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  letterSpacing: 1,
                  padding: '3px 8px',
                  borderRadius: 6,
                  minWidth: 46,
                  textAlign: 'center',
                }}>
                  TO
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0d1b3e' }}>
                  Jayden Ferrao ( aka J / Bestuuu) 💙
                </span>
              </div>

              <div style={{ height: 1, background: 'rgba(0, 102, 204, 0.08)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #ff8c00, #e53935)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  letterSpacing: 1,
                  padding: '3px 8px',
                  borderRadius: 6,
                  minWidth: 46,
                  textAlign: 'center',
                }}>
                  FROM
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0d1b3e' }}>
                  Trisha Sasha (aka Bebo) ✈️✨
                </span>
              </div>
            </div>

            {/* If Already Sent */}
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 248, 237, 0.9) 0%, rgba(240, 253, 244, 0.95) 100%)',
                  borderRadius: 16,
                  border: '1.5px solid rgba(46, 125, 50, 0.25)',
                  padding: '24px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>💌✈️✨</div>
                <h4 style={{
                  margin: '0 0 6px',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#1b5e20',
                }}>
                  Letter Flown to Jayden!
                </h4>
                <p style={{
                  margin: '0 0 16px',
                  fontSize: '0.86rem',
                  color: '#2e7d32',
                  lineHeight: 1.5,
                }}>
                  Your message has been sealed and delivered directly to Jayden.
                </p>

                {sentMessage && (
                  <div style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    color: '#1a3a6c',
                    fontStyle: 'italic',
                    border: '1px solid rgba(46, 125, 50, 0.2)',
                    marginBottom: 16,
                    textAlign: 'left',
                    lineHeight: 1.5,
                  }}>
                    "{sentMessage}"
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStatus('idle')}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 50,
                    border: 'none',
                    background: 'linear-gradient(135deg, #1a3a8f, #0066cc)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.25)',
                  }}
                >
                  Write Another Note ✍️
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} style={{ textAlign: 'left' }}>
                {/* Quick suggestions pills */}
                <div style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginBottom: 10,
                }}>
                  {quickPills.map((pill, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddPill(pill)}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(0, 102, 204, 0.06)',
                        border: '1px solid rgba(0, 102, 204, 0.18)',
                        borderRadius: 20,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#0066cc',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {pill}
                    </button>
                  ))}
                </div>

                {/* Message Textarea */}
                <div style={{ position: 'relative', marginBottom: 14 }}>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your note, warm words, or reply for Jayden here... ✨"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: '1.5px solid rgba(0, 102, 204, 0.22)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.92rem',
                      color: '#0d1b3e',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      minHeight: 110,
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0, 60, 140, 0.03)',
                      transition: 'border 0.2s ease',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0066cc'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 102, 204, 0.22)'}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    color: '#7a94b8',
                    marginTop: 4,
                    padding: '0 4px',
                  }}>
                    <span>Private letter directly to Jayden</span>
                    <span>{message.length} chars</span>
                  </div>
                </div>

                {/* Error notice if needed */}
                {status === 'error' && (
                  <div style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    marginBottom: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span>{errorMessage}</span>
                    <a
                      href={`mailto:tomsnicker007@gmail.com?subject=Inflight%20Message%20from%20Bebo&body=${encodeURIComponent(message)}`}
                      style={{ color: '#c62828', fontWeight: 700, textDecoration: 'underline', marginLeft: 8 }}
                    >
                      Open Mail
                    </a>
                  </div>
                )}

                {/* Action button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: status === 'sending' ? 1 : 1.03 }}
                    whileTap={{ scale: status === 'sending' ? 1 : 0.97 }}
                    style={{
                      background: status === 'sending'
                        ? 'linear-gradient(135deg, #7a94b8, #5a759e)'
                        : 'linear-gradient(135deg, #1a3a8f 0%, #0066cc 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 50,
                      padding: '12px 28px',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      boxShadow: '0 6px 20px rgba(0, 102, 204, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span>{status === 'sending' ? '✈️' : '💌'}</span>
                    <span>{status === 'sending' ? 'Dispatching across skies...' : 'Send Letter to Jayden'}</span>
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   Main FlightCard
───────────────────────────────────────── */
const FlightCard = ({ name = "Trisha Saha" }) => {
  const [phase, setPhase] = useState('tarmac');
  const [showBoardingPass, setShowBoardingPass] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isPlayingTune, setIsPlayingTune] = useState(false);
  const audioRef = useRef(null);
  const { width, height } = useWindowSize();

  const startIndigoTune = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 32;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlayingTune(true))
          .catch((err) => console.warn("Audio playback blocked:", err));
      }
    }
  };

  const toggleTune = () => {
    if (!audioRef.current) return;
    if (isPlayingTune) {
      audioRef.current.pause();
      setIsPlayingTune(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingTune(true)).catch(() => {});
    }
  };

  const handleTakeoff = () => {
    // If not already playing, start tune immediately
    if (audioRef.current && !isPlayingTune) {
      startIndigoTune();
    }
    setPhase('takeoff');
    setTimeout(() => {
      setPhase('sky');
      setShowConfetti(true);
      setTimeout(() => setShowBoardingPass(true), 600);
      setTimeout(() => setShowMessage(true), 1200);
      setTimeout(() => setShowConfetti(false), 7000);
      // Ensure tune is running from 0:32
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.currentTime = 32;
        audioRef.current.play().then(() => setIsPlayingTune(true)).catch(() => {});
      }
    }, 3200);
  };

  const bgStyle = {
    tarmac: 'linear-gradient(to bottom, #0a0a1a 0%, #0d1b3e 40%, #16213e 70%, #1a2a3a 100%)',
    cabin: '#030818',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.07, boxShadow: '0 20px 60px rgba(0,180,255,0.6)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('cabin')}
                style={{
                  padding: '18px 44px',
                  fontSize: 'clamp(0.95rem, 2.8vw, 1.25rem)',
                  fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                  background: 'linear-gradient(135deg, #0066cc 0%, #00d4ff 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 50,
                  cursor: 'pointer',
                  boxShadow: '0 12px 45px rgba(0,130,255,0.6)',
                  letterSpacing: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                Select Your Seat
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 3D AIRCRAFT CABIN & AISLE WALKTHROUGH ── */}
      {phase === 'cabin' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 30,
          width: '100vw',
          height: '100vh',
        }}>
          <AircraftCabin3D
            name={name}
            onStartAudio={startIndigoTune}
            onSeatConfirmed={handleTakeoff}
            onSkip={handleTakeoff}
          />
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

          {/* Praise & Tough Reality Flipping Cards */}
          <FlightAttendantPraiseCards visible={showMessage} />

          {/* Unified Tribute & Message Section */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.92) 100%)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 24,
                  padding: '30px 28px',
                  width: '100%',
                  boxShadow: '0 25px 60px rgba(0, 60, 140, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                  border: '1.5px solid rgba(0, 102, 204, 0.16)',
                  textAlign: 'center',
                }}
              >
                {/* Part 1: Tribute To Her True Strength */}
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>👑✈️💙</div>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#1a3a8f',
                  marginBottom: 8,
                  letterSpacing: -0.3,
                }}>
                  A Tribute To Your True Strength
                </div>
                <p style={{
                  margin: 0,
                  fontSize: 'clamp(0.85rem, 2.2vw, 0.96rem)',
                  color: '#2d5aa0',
                  lineHeight: 1.68,
                  fontStyle: 'italic',
                }}>
                  "Behind every smooth flight and warm greeting is a woman made of pure grit, immense patience, and heart of gold. You make it look so effortless, but we see how hard you work. Never stop being proud of the flight attendant and wonder woman you are!"
                </p>

                {/* Elegant Aviation Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  margin: '22px 0 20px',
                }}>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(0, 102, 204, 0.25))' }} />
                  <span style={{ fontSize: '1rem', color: '#0066cc', transform: 'rotate(45deg)', display: 'inline-block' }}>✈️</span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(0, 102, 204, 0.25))' }} />
                </div>

                {/* Part 2: Heartfelt Personal Wish */}
                <p style={{
                  fontSize: 'clamp(0.88rem, 2.3vw, 1.02rem)',
                  color: '#1a3a6c',
                  lineHeight: 1.8,
                  margin: 0,
                  fontStyle: 'italic',
                  fontWeight: 500,
                }}>
                  "The sky is not the limit always remember that. Thank you for being you. Keep flying high and making every journey magical bebo 🌟"
                </p>
                <div style={{ marginTop: 16, fontWeight: 700, color: '#0066cc', fontSize: '0.92rem' }}>
                  — With lots of love & lots of sky-high wishes 💙✈️
                </div>

                {/* Floating animated emojis */}
                <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', gap: 16 }}>
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

          {/* In-Flight Airmail / Message Section to Jayden */}
          <InflightMailSection visible={showMessage} />

        </div>
      )}

      <audio ref={audioRef} loop>
        <source src={indigoTune} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default FlightCard;
