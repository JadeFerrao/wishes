import React from 'react';
import { motion } from 'framer-motion';

const ModeSwitch = ({ mode, setMode }) => {
    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMode(mode === 'birthday' ? 'valentines' : 'birthday')}
                style={{
                    padding: '10px 20px',
                    borderRadius: '30px',
                    border: 'none',
                    backgroundColor: mode === 'birthday' ? '#ff6b6b' : '#ffccd5',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                Switch to {mode === 'birthday' ? 'Valentines' : 'Birthday'}
            </motion.button>
        </div>
    );
};

export default ModeSwitch;
