import { useState, useEffect } from 'react'
import './App.css'
import BirthdayCard from './components/BirthdayCard'
import ValentineCard from './components/ValentineCard'
import { db } from './firebase'
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'

function App() {
  // Set this to true to show BirthdayCard, false to show ValentineCard
  const isBirthday = false

  const [viewState, setViewState] = useState('loading') // 'loading', 'allowed', 'denied', 'preview'
  const [generatedLink, setGeneratedLink] = useState('')

  useEffect(() => {
    const checkShare = async () => {
      // Get shareId from URL query parameters
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
            // Already viewed
            setViewState('denied')
          } else {
            // Not viewed yet - mark as viewed and show content
            await updateDoc(docRef, { viewed: true })
            setViewState('allowed')
          }
        } else {
          // Document does not exist
          setViewState('denied')
        }
      } catch (error) {
        console.error("Error checking share link:", error)
        setViewState('denied') // Fail safe to denied on error
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
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Checking magic link...</div>
  }

  if (viewState === 'denied') {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>
        <h1>This card has vanished.</h1>
        <p>This was a one-time magic moment.</p>
        {/* <button onClick={() => window.location.href = window.location.pathname} style={{ marginTop: '20px', padding: '10px' }}>
          Create New
        </button> */}
      </div>
    )
  }

  // 'allowed' = Someone viewing a valid link
  // 'preview' = You (the creator) visiting the main site (No ID)
  // 'denied' = Invalid or already viewed link

  return (
    <>
      {/* 1. ALLOWED: Show the Card Content */}
      {viewState === 'allowed' && (
        isBirthday ? <BirthdayCard name="Jayden" /> : <ValentineCard />
      )}

      {/* 2. PREVIEW: Show ONLY Generator (Secure Mode) */}
      {viewState === 'preview' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#000', // Blank/Dark background
          color: 'white'
        }}>
          {!generatedLink ? (
            <button onClick={generateLink} style={{
              padding: '15px 30px',
              fontSize: '18px',
              background: '#ff4d4d',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 77, 77, 0.4)'
            }}>
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
                  style={{
                    padding: '12px 20px',
                    background: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// --- SIMPLE VERSION (Active) ---
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
