import React from 'react';
import { motion } from 'framer-motion';

const Cake = ({ candlesOn, onBlow }) => {
    return (
        <div
            style={{ position: 'relative', width: '280px', height: '300px', margin: '30px auto', cursor: 'pointer' }}
            onClick={onBlow}
            title="Click me to make a wish!"
        >
            <svg viewBox="0 0 200 220" width="100%" height="100%">
                <defs>
                    <linearGradient id="cakeGradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#a29bfe" />
                        <stop offset="50%" stopColor="#74b9ff" />
                        <stop offset="100%" stopColor="#a29bfe" />
                    </linearGradient>
                    <linearGradient id="topGradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#ff7675" />
                        <stop offset="50%" stopColor="#fab1a0" />
                        <stop offset="100%" stopColor="#ff7675" />
                    </linearGradient>
                </defs>

                {/* Plate */}
                <ellipse cx="100" cy="200" rx="90" ry="15" fill="#dfe6e9" />

                {/* --- Bottom Tier --- */}
                {/* Side */}
                <path d="M30,190 L30,130 Q30,140 100,140 Q170,140 170,130 L170,190 Q170,205 100,205 Q30,205 30,190 Z" fill="url(#cakeGradient)" />
                {/* Top Surface */}
                <path d="M30,130 Q30,120 100,120 Q170,120 170,130 Q170,140 100,140 Q30,140 30,130 Z" fill="#74b9ff" />

                {/* --- Middle Tier --- */}
                {/* Side */}
                <path d="M50,130 L50,80 Q50,90 100,90 Q150,90 150,80 L150,130 Q150,140 100,140 Q50,140 50,130 Z" fill="url(#topGradient)" />
                {/* Top Surface */}
                <path d="M50,80 Q50,70 100,70 Q150,70 150,80 Q150,90 100,90 Q50,90 50,80 Z" fill="#fab1a0" />

                {/* Icing Drips Bottom */}
                <path d="M30,130 Q40,145 50,130 T70,130 T90,130 T110,130 T130,130 T150,130 T170,130 L170,125 L30,125 Z" fill="#FFF" opacity="0.9" />

                {/* Icing Drips Middle */}
                <path d="M50,80 Q60,95 70,80 T90,80 T110,80 T130,80 T150,80 L150,75 L50,75 Z" fill="#FFF" opacity="0.9" />

                {/* Sprinkles Middle */}
                <circle cx="70" cy="110" r="2" fill="#ffeaa7" />
                <circle cx="130" cy="100" r="2" fill="#55efc4" />
                <circle cx="100" cy="115" r="2" fill="#fff" />

                {/* Sprinkles Bottom */}
                <circle cx="50" cy="160" r="3" fill="#fd79a8" />
                <circle cx="150" cy="170" r="3" fill="#ffeaa7" />
                <circle cx="100" cy="180" r="3" fill="#55efc4" />


                {/* Candles */}
                {[80, 100, 120].map((x, i) => (
                    <g key={i}>
                        <rect x={x - 3} y="40" width="6" height="35" fill="#fab1a0" rx="1" />
                        <rect x={x - 3} y="40" width="6" height="35" fill="repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 6px)" />

                        {candlesOn && (
                            <motion.g
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.2 }}
                            >
                                {/* Flame */}
                                <path d={`M${x},40 Q${x - 3},30 ${x},20 Q${x + 3},30 ${x},40`} fill="#fdcb6e" />
                                <path d={`M${x},35 Q${x - 1},30 ${x},25 Q${x + 1},30 ${x},35`} fill="#ff7675" />
                            </motion.g>
                        )}
                    </g>
                ))}

            </svg>
        </div>
    );
};

export default Cake;
