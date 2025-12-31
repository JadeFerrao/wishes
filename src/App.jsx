import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

function App() {
  // Set this to true to show BirthdayCard, false to show ValentineCard
  const isBirthday = true

  const [viewState, setViewState] = useState('loading') // 'loading', 'allowed', 'denied', 'preview'

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

  if (viewState === 'loading') {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Checking magic link...</div>
  }

  if (viewState === 'denied') {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>
        <h1>This card has vanished.</h1>
        <p>This was a one-time magic moment.</p>
      </div>
    )
  }

  // Render content for 'allowed' (valid share link) or 'preview' (no link)
  return (
    <>
      {isBirthday ? (
        <BirthdayCard name="Jayden" />
      ) : (
        <ValentineCard />
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
