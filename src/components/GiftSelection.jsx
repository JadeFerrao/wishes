import { motion } from 'framer-motion';
import { useState } from 'react';
import chocolateImg from '../assets/chocolate.png';
import teddyImg from '../assets/teddy.png';
import miniImg from '../assets/mini.png';
import dressImg from '../assets/dress.png';
import handbagImg from '../assets/handbag.jpeg';
import perfumesImg from '../assets/perfumes.jpg';

export default function GiftSelection({ onSelect, selectedGift }) {
    const [openedGifts, setOpenedGifts] = useState({});

    const gifts = [
        { id: 'gift1', content: 'Chocolates', image: chocolateImg, label: 'Sweet Treat' },
        { id: 'gift2', content: 'Miniatures', image: miniImg, label: 'Tiny Treaures' },
        { id: 'gift3', content: 'Teddy Bear', image: teddyImg, label: 'Cuddly Friend' },
        { id: 'gift4', content: 'Dress', image: dressImg, label: 'Stylish Pick' },
        { id: 'gift5', content: 'Handbag', image: handbagImg, label: 'Fashion Carry' },
        { id: 'gift6', content: 'Perfumes', image: perfumesImg, label: 'Fragrance Love' },
    ];

    const handleGiftClick = (gift) => {
        if (!openedGifts[gift.id]) {
            setOpenedGifts(prev => ({ ...prev, [gift.id]: true }));
        }
        onSelect(gift);
    };

    return (
        <div className="section-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontFamily: "'Dancing Script', cursive", color: '#d63031', fontSize: '2.5rem', marginBottom: '30px' }}>
                Choose Your Gift Wisely , That's What You'll Get
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '30px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {gifts.map((gift) => {
                    const isOpened = openedGifts[gift.id];
                    const isSelected = selectedGift?.id === gift.id;
                    const isDisabled = selectedGift && !isSelected;

                    return (
                        <motion.div
                            key={gift.id}
                            onClick={() => !isDisabled && handleGiftClick(gift)}
                            whileHover={!isDisabled ? { scale: 1.05 } : {}}
                            animate={{
                                opacity: isDisabled ? 0.5 : 1
                                // rotateY removed here to prevent double rotation (180+180=360)
                            }}
                            style={{
                                perspective: '1000px',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                height: '250px', // Increased size
                                position: 'relative'
                            }}
                        >
                            <motion.div style={{
                                width: '100%',
                                height: '100%',
                                // background removed to prevent 3D clipping issues
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                position: 'absolute',
                                transformStyle: 'preserve-3d', // Critical for 3D flip
                                border: isSelected ? '4px solid #d63031' : 'none',
                                // overflow: 'hidden' removed
                            }}
                                animate={{ rotateY: isOpened ? 180 : 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Front (Lid) */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, width: '100%', height: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '5rem',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #ff7675, #d63031)'
                                }}>
                                    🎁
                                </div>

                                {/* Back (Content) */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, width: '100%', height: '100%',
                                    backfaceVisibility: 'hidden',
                                    backgroundColor: 'white', // Ensure it's opaque
                                    transform: 'rotateY(180deg)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'column',
                                    borderRadius: '20px', // Match parent border radius
                                    overflow: 'hidden'
                                }}>
                                    <img src={gift.image} alt={gift.content} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        background: 'rgba(255,255,255,0.95)',
                                        width: '100%',
                                        padding: '10px',
                                        fontWeight: 'bold',
                                        color: '#d63031',
                                        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {gift.content}
                                        <div style={{ fontWeight: 'bold', marginTop: '5px', fontSize: '1.2rem' }}>{isOpened ? '💝' : ''}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}