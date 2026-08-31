import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Cake from './Cake';
import Decorations from './Decorations';
import Balloons from './Balloons';
import LuxuryScratchCard from './LuxuryScratchCard';
import birthdaySong from '../assets/Congratulations_And_Celebrations.mp3';

const BirthdayCard = ({ name = "Dada" }) => {
    const [lightsOn, setLightsOn] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [candlesOn, setCandlesOn] = useState(true);

    const audioRef = useRef(null);
    const { width, height } = useWindowSize();

    const toggleLights = () => {
        setLightsOn(!lightsOn);
    };

    const toggleMusic = () => {
        if (audioRef.current) {
            if (musicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setMusicPlaying(!musicPlaying);
        }
    };

    const blowCandles = () => {
        setCandlesOn(false);
        if (lightsOn) {
            triggerCelebration();
        }
    };

    const triggerCelebration = () => {
        // Only show confetti/balloons if lights are ON
        if (lightsOn) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 8000);
        }
    };

    const swingTransition = {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut"
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: lightsOn ? '#fdf2e9' : '#1a1a1a', // Light/Dark logic
            transition: 'background-color 1s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'auto',
            color: lightsOn ? '#333' : '#f0f0f0',
            paddingBottom: '60px'
        }}>

            {/* Content visible ONLY when Lights are ON */}
            {lightsOn && (
                <>
                    {/* Decorations */}
                    <Decorations />

                    {/* Name Display */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ marginTop: '40px', fontSize: '2rem', fontWeight: 'bold', zIndex: 10 }}
                    >
                        Happy Birthday, {name}!
                    </motion.div>

                    {/* Confetti & Balloons details */}
                    {showConfetti && (
                        <>
                            <Confetti
                                width={width}
                                height={height}
                                numberOfPieces={200}
                                recycle={false}
                                confettiSource={{ x: 0, y: height, w: 10, h: 0 }}
                                gravity={0.3}
                                initialVelocityY={20}
                                initialVelocityX={10}
                            />
                            <Confetti
                                width={width}
                                height={height}
                                numberOfPieces={200}
                                recycle={false}
                                confettiSource={{ x: width, y: height, w: 10, h: 0 }}
                                gravity={0.3}
                                initialVelocityY={20}
                                initialVelocityX={-10}
                            />
                            <Balloons />
                        </>
                    )}

                    {/* Swinging Happy Birthday Text */}
                    <div style={{ perspective: 1000, marginBottom: '1rem', marginTop: '1rem' }}>
                        <motion.h1
                            animate={{ rotateX: [10, -10] }}
                            transition={swingTransition}
                            style={{
                                fontSize: '4rem',
                                fontFamily: 'Cursive, sans-serif',
                                color: '#ff6b6b',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                                transformOrigin: 'top center',
                                cursor: 'default'
                            }}
                        >
                            Happy Birthday!
                        </motion.h1>
                    </div>

                    {/* Custom Cake Component */}
                    <Cake candlesOn={candlesOn} onBlow={blowCandles} />

                    {/* Floating "Blow Candles" Button */}
                    {candlesOn && (
                        <motion.button
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            onClick={blowCandles}
                            style={{
                                padding: '12px 24px',
                                fontSize: '1.2rem',
                                backgroundColor: '#ff7675',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                marginBottom: '20px',
                                boxShadow: '0 4px 15px rgba(255, 118, 117, 0.4)',
                                zIndex: 20
                            }}
                        >
                            🌬️ Click to Blow Candles
                        </motion.button>
                    )}
                </>
            )}

            {/* Controls - Always visible */}
            <div style={{ display: 'flex', gap: '20px', marginTop: lightsOn ? '20px' : '40vh', zIndex: 30, marginBottom: '30px' }}>
                <button
                    onClick={() => {
                        const newState = !lightsOn;
                        setLightsOn(newState);

                        if (newState) {
                            setShowConfetti(true);
                            setTimeout(() => setShowConfetti(false), 8000);
                            if (audioRef.current) {
                                audioRef.current.play().catch(e => console.log("Autoplay blocked usually, user interaction needed", e));
                                setMusicPlaying(true);
                            }
                        } else {
                            if (audioRef.current) {
                                audioRef.current.pause();
                                setMusicPlaying(false);
                            }
                        }
                    }}
                    className="control-btn"
                    style={{
                        padding: '15px 30px',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        borderRadius: '50px',
                        border: 'none',
                        background: lightsOn ? '#ffeaa7' : '#FFFFFF',
                        color: lightsOn ? '#333' : '#000',
                        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
                        fontWeight: 'bold'
                    }}
                >
                    {lightsOn ? 'Turn Lights Off 🌑' : '⚡ Turn Lights On ⚡'}
                </button>

                {lightsOn && (
                    <button
                        onClick={toggleMusic}
                        className="control-btn"
                        style={{ padding: '15px 30px', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '50px', border: 'none', background: '#81ecec', color: '#333', fontWeight: 'bold' }}
                    >
                        {musicPlaying ? 'Pause Music ⏸️' : 'Play Music 🎵'}
                    </button>
                )}
            </div>

            {/* Luxury Scratch Card Section placed below main Birthday Card */}
            {lightsOn && (
                <div style={{ width: '100%', marginTop: '30px', zIndex: 10 }}>
                    <LuxuryScratchCard name={name} />
                </div>
            )}

            <audio ref={audioRef} loop onError={(e) => console.error("Audio failed to load", e)}>
                <source src={birthdaySong} type="audio/mpeg" />
            </audio>

            {!lightsOn && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at center, #2d3436 0%, #000000 100%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />
            )}
        </div>
    );
};

export default BirthdayCard;
