import { useState } from 'react'
import './App.css'
import BirthdayCard from './components/BirthdayCard'
import ModeSwitch from './components/ModeSwitch'

function App() {
  const [mode, setMode] = useState('birthday')

  return (
    <>
      <ModeSwitch mode={mode} setMode={setMode} />

      {mode === 'birthday' ? (
        <BirthdayCard name="Jayden" />
      ) : (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffeaa7'
        }}>
          <h1>Valentines Mode Coming Soon! 💖</h1>
        </div>
      )}
    </>
  )
}

export default App
