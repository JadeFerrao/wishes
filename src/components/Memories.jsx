import { motion } from 'framer-motion';
import { useState } from 'react';
import dummyImg from '../assets/dummy.png';

const placeholderImages = [
    dummyImg,
    dummyImg,
    dummyImg,
    dummyImg
];

export default function Memories() {
    const [revealed, setRevealed] = useState({});

    return (
        <div className="section-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontFamily: "'Dancing Script', cursive", color: '#d63031', fontSize: '2.5rem', marginBottom: '30px' }}>
                Favorite Memories with You
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr', // Force 2 columns
                gap: '40px',
                maxWidth: '700px',
                margin: '0 auto'
            }}>
                {placeholderImages.map((src, index) => (
                    <motion.div
                        key={index}
                        onClick={() => setRevealed(p => ({ ...p, [index]: true }))}
                        initial={{ rotate: Math.random() * 6 - 3 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                        style={{
                            background: 'white',
                            padding: '20px 20px 60px 20px', // More Polaroid-like padding
                            boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            transformOrigin: 'center'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '300px', // Taller images
                            background: revealed[index] ? `url(${src}) center/cover` : '#ffeaa7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            color: '#636e72',
                            backgroundColor: '#eee'
                        }}>
                            {!revealed[index] && <span>Click to reveal ❤️</span>}
                        </div>
                        <div style={{
                            marginTop: '20px',
                            fontFamily: "'Dancing Script', cursive",
                            color: '#2d3436',
                            fontSize: '1.8rem'
                        }}>
                            Memory #{index + 1}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
