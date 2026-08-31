import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import birthdaySong from '../assets/Congratulations_And_Celebrations.mp3';
import defaultPhoto from '../assets/selfies.png';

const LuxuryScratchCard = ({ name = "Dada" }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [scratchPercent, setScratchPercent] = useState(0);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const isDrawingRef = useRef(false);

    const { width, height } = useWindowSize();

    // Initialize & redraw gold foil canvas
    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.globalCompositeOperation = 'source-over';

        // Luxury Gold Metallic Gradient Background
        const goldGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        goldGrad.addColorStop(0, '#BF953F');
        goldGrad.addColorStop(0.25, '#FCF6BA');
        goldGrad.addColorStop(0.5, '#B38728');
        goldGrad.addColorStop(0.75, '#FBF5B7');
        goldGrad.addColorStop(1, '#AA771C');

        ctx.fillStyle = goldGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle diagonal foil texture overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let i = -canvas.height; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + 40, canvas.height);
            ctx.lineTo(i + 50, canvas.height);
            ctx.lineTo(i + 10, 0);
            ctx.fill();
        }

        // Decorative Inner Border
        ctx.strokeStyle = '#5E4314';
        ctx.lineWidth = 3;
        ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

        // Center Gold Seal & Text Instruction
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Sparkling Gold Icon
        ctx.font = '32px sans-serif';
        ctx.fillText('✨ 🎁 ✨', canvas.width / 2, canvas.height / 2 - 40);

        // Main Instruction Text
        ctx.font = 'bold 20px "Cinzel", "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#3A2707';
        ctx.fillText('SCRATCH HERE TO REVEAL', canvas.width / 2, canvas.height / 2 + 5);

        ctx.font = 'italic 13px sans-serif';
        ctx.fillStyle = '#5A4010';
        ctx.fillText('Use your finger or mouse cursor', canvas.width / 2, canvas.height / 2 + 32);

        // Decorative corner sparkles
        ctx.font = '16px sans-serif';
        ctx.fillText('⭐', 35, 38);
        ctx.fillText('⭐', canvas.width - 35, 38);
        ctx.fillText('⭐', 35, canvas.height - 38);
        ctx.fillText('⭐', canvas.width - 35, canvas.height - 38);

        setIsRevealed(false);
        setScratchPercent(0);
    };

    useEffect(() => {
        initCanvas();
        window.addEventListener('resize', initCanvas);
        return () => window.removeEventListener('resize', initCanvas);
    }, []);

    // Calculate percent cleared
    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearPixels = 0;

        // Check alpha channel in increments for speed
        for (let i = 3; i < pixels.length; i += 32) {
            if (pixels[i] === 0) {
                clearPixels++;
            }
        }

        const totalChecked = pixels.length / 32;
        const percent = Math.round((clearPixels / totalChecked) * 100);
        setScratchPercent(percent);

        if (percent > 45 && !isRevealed) {
            triggerFullReveal();
        }
    };

    const triggerFullReveal = () => {
        setIsRevealed(true);
        setScratchPercent(100);

        // Clear remaining canvas overlay smoothly
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Trigger confetti celebration
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 9000);

        // Autoplay celebration song if not muted
        if (audioRef.current && !musicPlaying) {
            audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {
                console.log("Autoplay blocked by browser until user click");
            });
        }
    };

    // Scratch Handlers
    const scratch = (clientX, clientY) => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 32, 0, Math.PI * 2);
        ctx.fill();

        checkScratchPercentage();
    };

    const handleMouseDown = (e) => {
        isDrawingRef.current = true;
        scratch(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        if (!isDrawingRef.current) return;
        scratch(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        isDrawingRef.current = false;
    };

    const handleTouchStart = (e) => {
        isDrawingRef.current = true;
        if (e.touches[0]) {
            scratch(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDrawingRef.current) return;
        if (e.touches[0]) {
            scratch(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px 20px 60px 20px',
            position: 'relative',
            fontFamily: '"Poppins", "Segoe UI", sans-serif'
        }}>

            {/* Confetti Animation on Reveal */}
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={350}
                    recycle={false}
                    colors={['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#AA771C', '#FFD700', '#FFFFFF', '#FF6B6B']}
                />
            )}

            {/* Card Header Subtitle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '20px', zIndex: 10 }}
            >
                <p style={{ color: '#d4af37', fontSize: '1rem', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
                    ✨ Scratch the golden foil ticket below to unlock your special birthday surprise! ✨
                </p>
            </motion.div>

            {/* Ticket Wrapper */}
            <motion.div
                ref={containerRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                    width: '100%',
                    maxWidth: '540px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(191, 149, 63, 0.15)',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                {/* Ticket Top Ribbon / Header Bar */}


                {/* Main Card Content Container (Hidden Image + Canvas Overlay) */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '340px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#121218',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inner 0 0 20px rgba(0,0,0,0.8)'
                }}>

                    {/* Underneath Layer: Revealed Image & Wish Message */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'linear-gradient(180deg, rgba(20,20,30,0.4) 0%, rgba(10,10,15,0.85) 100%)'
                    }}>
                        {/* Background Revealed Single Photo */}
                        <img
                            src={defaultPhoto}
                            alt="Birthday Surprise"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'brightness(0.85) contrast(1.05)'
                            }}
                        />

                        {/* Message Overlay Frame at bottom of image */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(0deg, rgba(5,5,10,0.95) 0%, rgba(5,5,10,0.6) 70%, transparent 100%)',
                            padding: '25px 20px 18px 20px',
                            textAlign: 'center',
                            color: '#ffffff',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <motion.div
                                animate={isRevealed ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                <h3 style={{
                                    margin: '0 0 6px 0',
                                    fontSize: '1.4rem',
                                    fontFamily: 'serif',
                                    color: '#fcf6ba'
                                }}>
                                    🎂 Happy Birthday, {name}! 🎉
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    color: '#e0e0e0',
                                    lineHeight: 1.4
                                }}>
                                    May your year ahead shine bright like gold, filled with joy, laughter & endless success! ✨
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Canvas Scratch Overlay */}
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: isRevealed ? 'default' : 'crosshair',
                            touchAction: 'none',
                            transition: 'opacity 0.5s ease',
                            opacity: isRevealed ? 0 : 1,
                            pointerEvents: isRevealed ? 'none' : 'auto'
                        }}
                    />
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#aaa', marginBottom: '6px' }}>
                        <span>Scratch Reveal Progress</span>
                        <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{scratchPercent}%</span>
                    </div>
                    <div style={{
                        height: '8px',
                        width: '100%',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${scratchPercent}%`,
                            background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #FFD700)',
                            transition: 'width 0.2s ease',
                            borderRadius: '10px'
                        }} />
                    </div>
                </div>
            </motion.div>

            {/* Hidden Audio Tag */}
            <audio ref={audioRef} loop onError={(e) => console.error("Audio failed to load", e)}>
                <source src={birthdaySong} type="audio/mpeg" />
            </audio>
        </div>
    );
};

export default LuxuryScratchCard;
