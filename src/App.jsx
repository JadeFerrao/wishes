import './App.css'
import BirthdayCard from './components/BirthdayCard'
import ValentineCard from './components/ValentineCard'

function App() {
  // Set this to true to show BirthdayCard, false to show ValentineCard
  const isBirthday = true

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

export default App
