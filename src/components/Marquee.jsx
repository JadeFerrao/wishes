import { motion } from 'framer-motion';

export default function Marquee({ message = "I Love You" }) {
    return (
        <div style={{
            background: '#d63031',
            color: 'white',
            padding: '20px 0',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            margin: '60px 0',
            display: 'flex',
            alignItems: 'center'
        }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&display=swap');`}
            </style>
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                style={{
                    display: 'flex',
                    gap: '80px',
                    fontSize: '2rem',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic'
                }}
            >
                {[...Array(10)].map((_, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span>{message}</span>
                        <span style={{ fontSize: '1.5rem' }}>❤️</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
