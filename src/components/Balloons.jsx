import React from 'react';
import { motion } from 'framer-motion';

const Balloon = ({ color, x, delay }) => (
    <motion.div
        // Start BELOW the view (110vh) and move UP past the top (-20vh)
        initial={{ y: '110vh', opacity: 1 }}
        animate={{
            y: '-20vh',
            x: [x, x + 50, x - 50, x]
        }}
        transition={{
            duration: 8 + Math.random() * 4, // Slower float (8-12s)
            ease: "linear",
            delay: delay,
            repeat: Infinity, // Loop them so they keep coming? Or just once? Let's loop for effect.
            repeatDelay: Math.random() * 5
        }}
        style={{
            position: 'fixed', // Fixed to view so they are always visible relative to screen
            left: 0, // Base left 0, usage 'x' prop for offset
            top: 0, // Reset top to use 'y' transform
            width: '60px',
            height: '75px',
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, ${color} 60%, ${color} 100%)`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            zIndex: 9999, // Ensure on TOP of everything
            boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.1), 5px 5px 15px rgba(0,0,0,0.2)',
            transformOrigin: 'center bottom'
        }}
    >
        {/* String */}
        <div style={{
            position: 'absolute',
            bottom: -30,
            left: '50%',
            width: '2px',
            height: '30px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            transform: 'translateX(-50%)'
        }} />
    </motion.div>
);

const Balloons = () => {
    // Generate random balloons
    const balloons = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        color: ['#ff7675', '#74b9ff', '#55efc4', '#fdcb6e', '#a29bfe', '#fab1a0'][Math.floor(Math.random() * 6)],
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        delay: Math.random() * 5 // Random start times
    }));

    return (
        <>
            {balloons.map((b) => (
                <Balloon key={b.id} {...b} />
            ))}
        </>
    );
};

export default Balloons;
