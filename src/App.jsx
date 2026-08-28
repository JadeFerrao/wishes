import { useState, useEffect } from 'react'
import './App.css'
import BirthdayCard from './components/BirthdayCard'
import ValentineCard from './components/ValentineCard'
import FriendshipCard from './components/FriendshipCard'
import SorryCard from './components/SorryCard'
import { db } from './firebase'
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'

function App() {
  // Toggle between: 'birthday' | 'valentine' | 'friendship' | 'sorry'
  const cardMode = 'birthday'

  const [viewState, setViewState] = useState('loading') // 'loading', 'allowed', 'denied', 'preview'
  const [generatedLink, setGeneratedLink] = useState('')

  useEffect(() => {
    const checkShare = async () => {
      const params = new URLSearchParams(window.location.search)
      const shareId = params.get('shareId')

      if (!shareId) {
        // No share ID means we are in "preview" or "creator" mode
        setViewState('preview')
        return
      }

      try {
        const docRef = doc(db, 'shares', shareId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.viewed) {
            setViewState('denied')
          } else {
            await updateDoc(docRef, { viewed: true })
            setViewState('allowed')
          }
        } else {
          setViewState('denied')
        }
      } catch (error) {
        console.error("Error checking share link:", error)
        setViewState('denied')
      }
    }

    checkShare()
  }, [])

  const generateLink = async () => {
    try {
      const docRef = await addDoc(collection(db, "shares"), {
        viewed: false,
        createdAt: serverTimestamp()
      });
      const url = `${window.location.origin}${window.location.pathname}?shareId=${docRef.id}`;
      setGeneratedLink(url);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error creating link. Check console.");
    }
  }

  if (viewState === 'loading') {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading...</div>
  }

  if (viewState === 'denied') {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>
        <h1>This card has vanished.</h1>
        <p>This was a one-time magic moment.</p>
      </div>
    )
  }

  const isAdmin = new URLSearchParams(window.location.search).get('status') === 'admin';
  // adminURL: https://jadeferrao.github.io/wishes/?status=admin

  return (
    <>
      {/* 1. ALLOWED: Show the Card Content */}
      {viewState === 'allowed' && (
        cardMode === 'birthday' ? <BirthdayCard name="Dada" /> :
        cardMode === 'friendship' ? <FriendshipCard /> :
        cardMode === 'sorry' ? <SorryCard /> :
        <ValentineCard />
      )}

      {/* 2. ADMIN: Show only Link Generator (Secure Mode) */}
      {viewState === 'preview' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#000',
          color: 'white'
        }}>
          {isAdmin ? (
            <>
              {!generatedLink ? (
                <button onClick={generateLink} className="magic-button">
                  Create Magic Link
                </button>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Share this link :</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      style={{
                        padding: '12px',
                        width: '300px',
                        border: 'none',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedLink)}
                      className="copy-button"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </>
  )
}

// --- SIMPLE VERSION ---
// import './App.css'
// import BirthdayCard from './components/BirthdayCard'
// import ValentineCard from './components/ValentineCard'

// function App() {
//   // Set this to true to show BirthdayCard, false to show ValentineCard
//   const isBirthday = true

//   return (
//     <>
//       {isBirthday ? (
//         <BirthdayCard name="Jayden" />
//       ) : (
//         <ValentineCard />
//       )}
//     </>
//   )
// }

export default App
