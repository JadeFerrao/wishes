import React from 'react';
import { motion } from 'framer-motion';

const Decorations = () => {
    const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#1dd1a1"];
    const numFlags = 12;

    // We'll overlay individual flags on top of a simple SVG curve string
    return (
        <motion.div
            style={{
                position: 'absolute',
                top: '20px',
                left: 0,
                width: '100%',
                height: '250px', // Increased height for deeper curve
                pointerEvents: 'none',
                zIndex: 15,
                overflow: 'visible', // Allow swinging outside?
                transformOrigin: 'top center'
            }}
            animate={{ rotateZ: [1, -1] }} // Slight whole-string sway
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
            {/* The String */}
            <svg width="100%" height="100%" viewBox="0 0 100 250" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                {/* Deeper Curve: Control point y=220 matching logic */}
                <path
                    d="M0,0 Q50,220 100,0"
                    fill="none"
                    stroke="rgba(0,0,0,0.3)" // Darker for visibility
                    strokeWidth="0.5" // SVG units relevant to viewBox 100 width
                />
            </svg>

            {/* The Flags */}
            {/* We position them absolutely based on % width and an approximated curve height */}
            {Array.from({ length: numFlags }).map((_, i) => {
                const pct = (i + 0.5) / numFlags; // 0 to 1
                const xPercent = pct * 100;

                // Approximate the Parabola/Catenary: y = 4 * h * (x - 0.5)^2 - h + offset
                // Q point is at 50% width (0.5), 220px height in current coordinate space roughly.
                // Bezier: B(t) = 2(1-t)t * 220
                // y(t) = 440 * (t - t^2)
                const t = pct;
                const yTop = 440 * (t - t * t) * 0.9 + 5; // Scaling factor and offset

                return (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${xPercent}%`,
                            top: yTop,
                            transformOrigin: 'top center'
                        }}
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 10 }}
                        transition={{
                            duration: 1.5 + Math.random(),
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }}
                    >
                        {/* Triangular Flag */}
                        <div style={{
                            width: 0,
                            height: 0,
                            borderLeft: '25px solid transparent',
                            borderRight: '25px solid transparent',
                            borderTop: `50px solid ${colors[i % colors.length]}`,
                            filter: 'drop-shadow(3px 3px 3px rgba(0,0,0,0.2))'
                        }} />
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default Decorations;
