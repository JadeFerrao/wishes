export default function Cart({ selectedDate, selectedGift }) {
    if (!selectedDate && !selectedGift) return null;

    return (
        <div style={{
            fontFamily: "'Courier New', Courier, monospace",
            background: '#fff',
            margin: '80px auto',
            maxWidth: '380px',
            padding: '40px 25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            transform: 'rotate(-1deg)'
        }}>
            {/* Paper texture effect via gradient (subtle) */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, #fff 0%, #fcfcfc 100%)',
                zIndex: -1,
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)'
            }} />

            {/* Top Tape */}
            <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '35px',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(0,0,0,0.1)',
                overflow: 'hidden',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))' }}></div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Love Receipt</h2>
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
                        <td style={{ textAlign: 'left', color: 'black' }}>01</td>
                        <td style={{ fontWeight: 'bold' }}>
                            {selectedDate ? selectedDate.label.split('/')[0] : '...'}
                        </td>
                        <td style={{ textAlign: 'left', color: 'black' }}>1</td>
                        <td style={{ textAlign: 'left', color: 'black' }}>FREE</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                            {selectedDate ? 'Plan: ' + selectedDate.label : 'Pending selection'}
                        </td>
                        <td colSpan="2"></td>
                    </tr>

                    {/* Item 2: Gift */}
                    <tr>
                        <td style={{ textAlign: 'left', color: 'black' }}>02</td>
                        <td style={{ fontWeight: 'bold' }}>
                            {selectedGift ? selectedGift.content : '...'}
                        </td>
                        <td style={{ textAlign: 'left', color: 'black' }}>1</td>
                        <td style={{ textAlign: 'left', color: 'black' }}>FREE</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                            Gift: {selectedGift ? selectedGift.label : 'Original'}
                        </td>
                        <td colSpan="2"></td>
                    </tr>
                </tbody>
            </table>

            <div style={{ borderBottom: '2px dashed #333', marginBottom: '20px' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>TOTAL</span>
                <span>MY HEART</span>
            </div>

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
        </div>
    );
}
