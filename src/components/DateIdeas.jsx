import { motion } from 'framer-motion';
import videocallImg from '../assets/videcall.png';
import dateImg from '../assets/Date.png';
import outingImg from '../assets/outing date.png';
import selfiesImg from '../assets/selfies.png';
import netflixImg from '../assets/netflix chill.png';

export default function DateIdeas({ onSelect, selectedIdea }) {
  const ideas = [
    { id: 'virtual', label: 'Virtual chat/videocall', image: videocallImg },
    { id: 'dinner', label: 'Dinner date or Lunch date', image: dateImg },
    { id: 'picnic', label: 'An outing/Picnic date', image: outingImg },
    { id: 'pics', label: 'Send pics to me so i simp shamelessely at home', image: selfiesImg },
    { id: 'netflix', label: 'Order food home & Netflix chill', image: netflixImg },
  ];

  return (
    <div className="section-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h2 style={{ fontFamily: "'Dancing Script', cursive", color: '#d63031', fontSize: '2.5rem', marginBottom: '30px' }}>
        Choose a Date Idea with You 👉👈
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(idea)}
            style={{
              background: selectedIdea?.id === idea.id ? '#ff7675' : 'rgba(255, 255, 255, 0.8)',
              color: selectedIdea?.id === idea.id ? 'white' : '#2d3436',
              padding: '20px',
              borderRadius: '20px',
              cursor: 'pointer',
              width: '200px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              border: selectedIdea?.id === idea.id ? '2px solid #d63031' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ height: '120px', width: '100%', marginBottom: '10px', overflow: 'hidden', borderRadius: '10px' }}>
              <img src={idea.image} alt={idea.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{idea.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
