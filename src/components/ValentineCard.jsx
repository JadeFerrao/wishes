import { useState, useRef, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowSize } from 'react-use'
import teddyBear from '../assets/valentine_teddy_bear.png'
import song from '../assets/pretty_woman.mp3'

export default function ValentineCard() {
    const [isCelebrated, setIsCelebrated] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const { width, height } = useWindowSize()
    const audioRef = useRef(new Audio(song))

    // Define mobile breakpoint
    const isMobile = width < 600

    const handleYesClick = () => {
        setIsCelebrated(true)
        setIsFlipped(true)
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e))
    }

    // Floating hearts animation variants (existing)
    const heartVariants = {
        hidden: { opacity: 0, y: 0, scale: 0 },
        visible: (i) => ({
            opacity: [1, 1, 0],
            y: -500,
            scale: [1, 1.5, 1],
            x: Math.random() * 200 - 100,
            transition: {
                duration: 3 + Math.random() * 2,
                ease: "easeOut",
                repeat: Infinity,
                delay: i * 0.2
            }
        })
    }

    // Swinging heart component
    const HangingHeart = ({ delay, left, height = '150px' }) => (
        <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay
            }}
            style={{
                position: 'absolute',
                top: -20,
                left: left,
                transformOrigin: 'top center',
                zIndex: 5
            }}
        >
            <div style={{
                width: '2px',
                height: height,
                background: 'rgba(214, 48, 49, 0.5)',
                margin: '0 auto'
            }} />
            <div style={{
                fontSize: isMobile ? '1.5rem' : '2rem', // Responsive heart size
                marginTop: '-10px',
                filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.1))'
            }}>
                💖
            </div>
        </motion.div>
    )

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', // Light red/pink gradient
            fontFamily: "'Outfit', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            perspective: '1000px',
            padding: '20px', // Add padding to ensure card never touches edges
            boxSizing: 'border-box'
        }}>
            {/* Corner Decorations */}
            <div style={{ position: 'absolute', top: 20, left: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(-15deg)' }}>💌</div>
            <div style={{ position: 'absolute', top: 20, right: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(15deg)' }}>🎀</div>
            <div style={{ position: 'absolute', bottom: 20, left: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(15deg)' }}>🏹</div>
            <div style={{ position: 'absolute', bottom: 20, right: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(-15deg)' }}>🧸</div>

            {/* Ambient Hanging Hearts */}
            <HangingHeart left="10%" delay={0} height="120px" />
            <HangingHeart left="20%" delay={0.5} height="160px" />
            <HangingHeart left="30%" delay={1.2} height="140px" />
            <HangingHeart left="70%" delay={0.8} height="130px" />
            <HangingHeart left="80%" delay={1} height="170px" />
            <HangingHeart left="90%" delay={0.2} height="150px" />
            <HangingHeart left="50%" delay={1.5} height="180px" />

            {isCelebrated && <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />}

            {/* Falling Roses Animation */}
            {isCelebrated && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`rose-${i}`}
                            initial={{ y: -50, x: i % 2 === 0 ? -50 : width + 50, opacity: 1, rotate: 0 }}
                            animate={{
                                y: height + 100,
                                x: i % 2 === 0 ? Math.random() * width * 0.4 : width - (Math.random() * width * 0.4),
                                rotate: 360
                            }}
                            transition={{
                                duration: 5 + Math.random() * 3,
                                ease: "linear",
                                delay: Math.random() * 2,
                                repeat: Infinity
                            }}
                            style={{
                                position: 'absolute',
                                fontSize: isMobile ? '1.5rem' : '2rem'
                            }}
                        >
                            🌹
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Floating Hearts Background (Original) */}
            {isCelebrated && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={heartVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                bottom: '-50px',
                                fontSize: `${Math.random() * 20 + 20}px`,
                                color: '#e91e63'
                            }}
                        >
                            ❤️
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Flipping Card Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: '90%', // Always take 90% of available width
                    maxWidth: '400px', // Cap at 400px (slightly smaller than before)
                    margin: '0 auto', // Center it
                    position: 'relative',
                    zIndex: 10,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Front Face */}
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(10px)',
                        padding: isMobile ? '20px' : '40px', // Smaller padding on mobile
                        borderRadius: '30px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: isMobile ? '15px' : '20px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        backfaceVisibility: 'hidden',
                        position: 'relative',
                        width: '100%',
                    }}
                >
                    <motion.img
                        src={teddyBear}
                        alt="Valentine Teddy"
                        style={{ width: '100%', maxWidth: isMobile ? '180px' : '300px', borderRadius: '20px' }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />

                    <h1 style={{
                        fontSize: isMobile ? '1.8rem' : '2.5rem', // Smaller title on mobile
                        color: '#d63031',
                        textAlign: 'center',
                        margin: 0,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Will you be my Valentine?
                    </h1>

                    <div style={{
                        display: 'flex',
                        gap: isMobile ? '10px' : '20px',
                        marginTop: '20px',
                        flexDirection: isMobile ? 'column' : 'row', // Stack buttons on very small screens if needed, mostly fine side-by-side but keeping scalable
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleYesClick}
                            style={{
                                padding: isMobile ? '12px 30px' : '15px 40px',
                                fontSize: isMobile ? '1.2rem' : '1.5rem',
                                border: 'none',
                                borderRadius: '50px',
                                background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 20px rgba(255, 154, 158, 0.4)'
                            }}
                        >
                            Yes 💖
                        </motion.button>

                        <button
                            style={{
                                padding: isMobile ? '12px 30px' : '15px 40px',
                                fontSize: isMobile ? '1.2rem' : '1.5rem',
                                border: '2px solid #b2bec3',
                                borderRadius: '50px',
                                background: '#dfe6e9',
                                color: '#636e72',
                                cursor: 'not-allowed',
                                opacity: 0.6,
                                fontWeight: 'bold'
                            }}
                            disabled
                        >
                            No 🥲
                        </button>
                    </div>
                </div>

                {/* Back Face (Letter) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom right, #fff0f3, #fff)',
                        padding: isMobile ? '20px' : '40px',
                        borderRadius: '30px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        border: '2px solid #ffccd5'
                    }}
                >
                    <style>
                        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}
                    </style>
                    <div
                        onClick={() => setIsFlipped(false)}
                        style={{
                            position: 'absolute',
                            bottom: isMobile ? '10px' : '20px',
                            right: isMobile ? '15px' : '25px',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.5)',
                            padding: '5px 10px',
                            borderRadius: '50%',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                        title="Flip back"
                    >
                        ↩️
                    </div>
                    <h2 style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: isMobile ? '2.5rem' : '3.5rem',
                        color: '#d63031',
                        margin: '0 0 20px 0',
                        textAlign: 'center'
                    }}>
                        Dearest Idiot,
                    </h2>
                    <p style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: isMobile ? '20px' : '25px',
                        color: '#555',
                        textAlign: 'center',
                        lineHeight: '1.6',
                        margin: 0
                    }}>
                        Your reading this since you approvd it ha-ha lol, you're officially stuck with me. <br />
                        Now listen, You make my life a beautiful kind of chaotic, and I love every second of it. <br />
                        Thanks for being crazy, dumb, sweet, impossible to ignore and my favorite person to be weird with.<br />
                        <br />
                        Your Crackhead, <br />
                        <span style={{ fontSize: isMobile ? '2rem' : '2.5rem', color: '#e91e63' }}>Jayden</span>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
