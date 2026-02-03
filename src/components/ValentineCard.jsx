import { useState, useRef, useEffect } from 'react'
import ReactConfetti from 'react-confetti'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useWindowSize } from 'react-use'
import teddyBear from '../assets/valentine_teddy_bear.png'
import song from '../assets/pretty_woman.mp3'
import DateIdeas from './DateIdeas'
import GiftSelection from './GiftSelection'
import Memories from './Memories'
import Marquee from './Marquee'
import Cart from './Cart'

export default function ValentineCard() {
    const [isCelebrated, setIsCelebrated] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
    const [noButtonOpacity, setNoButtonOpacity] = useState(1)
    const [yesScale, setYesScale] = useState(1)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedGift, setSelectedGift] = useState(null)

    const [notification, setNotification] = useState(null)
    const [showConfetti, setShowConfetti] = useState(false)

    const { width, height } = useWindowSize()
    const audioRef = useRef(new Audio(song))
    const scrollRef = useRef(null)

    // Define mobile breakpoint
    const isMobile = width < 600

    const handleYesClick = () => {
        setIsCelebrated(true)
        setIsFlipped(true)
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e))
    }

    const handleNoHover = () => {
        const x = Math.random() * 200 - 100
        const y = Math.random() * 200 - 100
        setNoButtonPosition({ x, y })
        setNoButtonOpacity(prev => Math.max(0, prev - 0.2)) // Decrease opacity
    }

    const showNotificationMessage = (msg) => {
        setNotification(msg)
        setTimeout(() => setNotification(null), 3000)
    }

    const handleDateSelect = (date) => {
        setSelectedDate(date)
        showNotificationMessage("Added Date Idea to Bill 🧾")
    }

    const handleGiftSelect = (gift) => {
        setSelectedGift(gift)
        showNotificationMessage("Added Gift to Bill 🎁")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000) // Stop confetti after 5s
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
            background: 'linear-gradient(to bottom, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', // Light red/pink gradient
            fontFamily: "'Outfit', sans-serif",
            position: 'relative',
            overflowX: 'hidden',
            overflowY: isCelebrated ? 'auto' : 'hidden', // Allow scroll only when celebrated
        }}>
            {/* Confetti & Notifications */}
            {showConfetti && (
                <>
                    <ReactConfetti
                        width={width}
                        height={height}
                        recycle={true}
                        numberOfPieces={300}
                        confettiSource={{ x: 0, y: height / 2, w: 10, h: 10 }}
                        initialVelocityX={20}
                        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
                    />
                    <ReactConfetti
                        width={width}
                        height={height}
                        recycle={true}
                        numberOfPieces={300}
                        confettiSource={{ x: width, y: height / 2, w: 10, h: 10 }}
                        initialVelocityX={-20}
                        style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
                    />
                </>
            )}

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 20 }}
                        exit={{ opacity: 0, y: -50 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: '50%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            padding: '15px 30px',
                            borderRadius: '50px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            border: '2px solid #ff9a9e'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>✅</span>
                        <span style={{ color: '#d63031', fontWeight: 'bold' }}>{notification}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Initial Screen Container */}
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                perspective: '1000px',
                padding: '20px',
                boxSizing: 'border-box'
            }}>

                {/* Corner Decorations */}
                <div style={{ position: 'absolute', top: 20, left: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(-15deg)' }}>💌</div>
                <div style={{ position: 'absolute', top: 20, right: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(15deg)' }}>🎀</div>
                <div style={{ position: 'absolute', bottom: 20, left: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(15deg)' }}>🏹</div>
                {!isCelebrated && <div style={{ position: 'absolute', bottom: 20, right: 10, fontSize: isMobile ? '1.5rem' : '3rem', opacity: 0.8, transform: 'rotate(-15deg)' }}>🧸</div>}

                {/* Ambient Hanging Hearts */}
                <HangingHeart left="10%" delay={0} height="120px" />
                <HangingHeart left="20%" delay={0.5} height="160px" />
                <HangingHeart left="30%" delay={1.2} height="140px" />
                <HangingHeart left="70%" delay={0.8} height="130px" />
                <HangingHeart left="80%" delay={1} height="170px" />
                <HangingHeart left="90%" delay={0.2} height="150px" />
                <HangingHeart left="50%" delay={1.5} height="180px" />

                {isCelebrated && (
                    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -100, x: Math.random() * width, rotate: 0 }}
                                animate={{
                                    y: height + 100,
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 5,
                                    ease: "linear",
                                    delay: Math.random() * 5,
                                    repeat: Infinity
                                }}
                                style={{
                                    position: 'absolute',
                                    fontSize: Math.random() > 0.5 ? '2rem' : '1.5rem',
                                }}
                            >
                                {Math.random() > 0.5 ? '🌹' : '❤️'}
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
                        width: '90%',
                        maxWidth: '400px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 10,
                        transformStyle: 'preserve-3d',
                        height: isMobile ? '500px' : '600px', // Fixed height for flip container to ensure backface aligns
                    }}
                >
                    {/* Front Face */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(10px)',
                            padding: isMobile ? '20px' : '40px',
                            borderRadius: '30px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: isMobile ? '15px' : '20px',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            backfaceVisibility: 'hidden',
                            position: 'absolute', // Absolute to overlap
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box'
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
                            fontSize: isMobile ? '1.8rem' : '2.5rem',
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
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '60px' // Reserve space for movement
                        }}>
                            <LayoutGroup>
                                <motion.button
                                    layout
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
                                        boxShadow: '0 10px 20px rgba(255, 154, 158, 0.4)',
                                        zIndex: 20
                                    }}
                                >
                                    Yes 💖
                                </motion.button>

                                <AnimatePresence>
                                    {noButtonOpacity > 0 && (
                                        <motion.button
                                            initial={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0, width: 0, padding: 0, margin: 0 }}
                                            onHoverStart={handleNoHover}
                                            onClick={handleNoHover}
                                            animate={{
                                                x: noButtonPosition.x,
                                                y: noButtonPosition.y,
                                                opacity: noButtonOpacity
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            style={{
                                                padding: isMobile ? '12px 30px' : '15px 40px',
                                                fontSize: isMobile ? '1.2rem' : '1.5rem',
                                                border: '2px solid #b2bec3',
                                                borderRadius: '50px',
                                                background: '#dfe6e9',
                                                color: '#636e72',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                // Make absolute once it starts moving so it doesn't take up space
                                                position: noButtonOpacity < 1 ? 'absolute' : 'relative'
                                            }}
                                        >
                                            No 🥲
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </LayoutGroup>
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
                            border: '2px solid #ffccd5',
                            boxSizing: 'border-box'
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

            {/* Revealed Sections */}
            {isCelebrated && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div ref={scrollRef}>
                        <DateIdeas selectedIdea={selectedDate} onSelect={handleDateSelect} />
                    </div>

                    <GiftSelection selectedGift={selectedGift} onSelect={handleGiftSelect} />

                    <Memories />

                    <Marquee message="You are my favorite notification" />

                    <Cart selectedDate={selectedDate} selectedGift={selectedGift} />

                    <div style={{ height: '100px' }} /> {/* Bottom spacer */}
                </motion.div>
            )}
        </div>
    )
}
