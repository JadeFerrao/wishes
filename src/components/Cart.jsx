import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'

export default function Cart({ selectedDate, selectedGift }) {
    const [status, setStatus] = useState('idle') // idle, generating, visible
    const receiptRef = useRef(null)

    const handleDownload = async () => {
        if (!receiptRef.current) return

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: null,
            })

            const link = document.createElement('a')
            link.download = 'love-receipt.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (err) {
            console.error("Failed to generate receipt", err)
        }
    }

    const handleShare = async () => {
        if (!receiptRef.current) return

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: null,
            })

            canvas.toBlob(async (blob) => {
                if (!blob) return

                const file = new File([blob], 'love-receipt.png', { type: 'image/png' })

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Love Receipt',
                            text: 'Here is my Love Receipt! ❤️',
                        })
                    } catch (shareError) {
                        console.error('Error sharing:', shareError)
                    }
                } else {
                    alert('Sharing not supported on this device. Please use the download button instead!')
                }
            }, 'image/png')
        } catch (err) {
            console.error("Failed to generate receipt for sharing", err)
        }
    }

    const handleGenerate = () => {
        setStatus('generating')
        setTimeout(() => {
            setStatus('visible')
        }, 3000)
    }

    // Only show when both are selected
    if (!selectedDate || !selectedGift) return null;

    return (
        <div style={{
            width: '100%',
            maxWidth: '400px',
            margin: '60px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            perspective: '1000px',
            zIndex: 10
        }}>

            {status === 'idle' && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: '#d63031',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(214, 48, 49, 0.3)',
                        marginBottom: '40px'
                    }}
                >
                    Generate Bill 🧾
                </motion.button>
            )}

            {/* Machine Slot / Printer Head */}
            {(status === 'generating' || status === 'visible') && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        border: '2px solid #636e72',
                        background: 'linear-gradient(to bottom, #2d3436, #000)'
                    }}
                >
                    {/* The Slot */}
                    <div style={{
                        width: '90%',
                        height: '4px',
                        background: '#000',
                        borderRadius: '2px',
                        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)'
                    }} />

                    {/* Status Lights */}
                    <div style={{ position: 'absolute', right: 15, display: 'flex', gap: 6 }}>
                        <motion.div
                            animate={{ opacity: status === 'generating' ? [0.5, 1, 0.5] : 0.5 }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            style={{ width: 6, height: 6, borderRadius: '50%', background: '#e17055' }}
                        />
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: status === 'visible' ? '#55efc4' : '#333' }} />
                    </div>
                </motion.div>
            )}

            {/* Bill Output Area */}
            <div style={{
                position: 'relative',
                width: '90%',
                overflow: 'hidden', // Essential for the "coming out" effect
                zIndex: 10,
                marginTop: '-12px', // Tucked under the machine
                paddingTop: '12px'
            }}>
                <AnimatePresence mode='wait'>
                    {status === 'generating' ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            style={{
                                background: '#fff',
                                padding: '30px',
                                textAlign: 'center',
                                borderRadius: '0 0 5px 5px',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                minHeight: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#636e72',
                                fontFamily: "'Courier New', monospace",
                                borderLeft: '1px solid #ddd',
                                borderRight: '1px solid #ddd',
                                borderBottom: '1px dashed #ddd',
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                style={{ fontSize: '2.5rem', marginBottom: '15px' }}
                            >
                                ⚙️
                            </motion.div>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                            >
                                GENERATING BILL...
                            </motion.div>
                        </motion.div>
                    ) : status === 'visible' && (
                        <motion.div
                            ref={receiptRef}
                            key="receipt"
                            initial={{ y: -500 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 3, type: "spring", damping: 20, stiffness: 40 }} // Slow slide
                            style={{
                                fontFamily: "'Courier New', Courier, monospace",
                                background: '#fff',
                                padding: '40px 25px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                position: 'relative',
                                transformOrigin: 'top center',
                                imageRendering: 'pixelated' // Retro feel
                            }}
                        >
                            {/* Paper texture effect via gradient (subtle) */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to bottom, #fff 0%, #fcfcfc 100%)',
                                zIndex: -1,
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)'
                            }} />

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#f77777ff' }}>Love Receipt</h2>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Order #14022026</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Customer: My Valentine</div>
                            </div>

                            <div style={{ borderBottom: '2px dashed #333', marginBottom: '20px' }}></div>

                            <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #000' }}>
                                        <th style={{ textAlign: 'left', padding: '10px 5px', color: '#000' }}>NO.</th>
                                        <th style={{ textAlign: 'left', padding: '10px 5px', color: '#000' }}>ITEM</th>
                                        <th style={{ textAlign: 'left', padding: '10px 5px', color: '#000' }}>QTY</th>
                                        <th style={{ textAlign: 'left', padding: '10px 5px', color: '#000' }}>PRICE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Item 1: Date */}
                                    <tr>
                                        <td style={{ textAlign: 'left', color: 'black', paddingTop: '10px' }}>01</td>
                                        <td style={{ color: 'black', paddingTop: '10px' }}>
                                            {selectedDate ? selectedDate.label : '...'}
                                        </td>
                                        <td style={{ textAlign: 'left', color: 'black', paddingTop: '10px' }}>1</td>
                                        <td style={{ textAlign: 'left', color: 'black', paddingTop: '10px' }}>FREE</td>
                                    </tr>

                                    {/* Item 2: Gift */}
                                    <tr>
                                        <td style={{ textAlign: 'left', color: 'black' }}>02</td>
                                        <td style={{ color: 'black' }}>
                                            {selectedGift ? selectedGift.label : '...'}
                                        </td>
                                        <td style={{ textAlign: 'left', color: 'black' }}>1</td>
                                        <td style={{ textAlign: 'left', color: 'black' }}>FREE</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ borderBottom: '2px dashed #333', marginBottom: '20px' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '0.9rem', color: '#666' }}>
                                <span>TAX</span>
                                <span>INCLUDED</span>
                            </div>

                            <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                                <p style={{ marginBottom: '5px' }}>Signed by,</p>
                                <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: '2rem', color: '#d63031', transform: 'rotate(-5deg)' }}>
                                    Jayden
                                </div>
                                <p style={{ marginTop: '20px', fontSize: '0.7rem', color: '#aaa' }}>THANK YOU FOR CHOOSING ME</p>
                                <div style={{ marginTop: '10px' }}>
                                    💗 💗 💗
                                </div>
                            </div>

                            {/* Download Action */}
                            <motion.button
                                data-html2canvas-ignore="true"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDownload}
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '25px',
                                    background: '#dfe6e9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '35px',
                                    height: '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#636e72',
                                    zIndex: 100 // Ensure valid click
                                }}
                                title="Download Receipt"
                            >
                                📥
                            </motion.button>

                            {/* Share Action */}
                            <motion.button
                                data-html2canvas-ignore="true"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleShare}
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '70px', // Positioned next to download
                                    background: '#dfe6e9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '35px',
                                    height: '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#636e72',
                                    zIndex: 100
                                }}
                                title="Share Receipt"
                            >
                                🔗
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
