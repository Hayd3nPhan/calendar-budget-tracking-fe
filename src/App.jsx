import { useState, useEffect } from 'react'
import axios from 'axios'
import Calendar from './components/Calendar'
import Notes from './components/Notes'
import Weather from './components/Weather'
import './App.css'
import './components/Calendar.css'
import './components/Notes.css'
import './components/Weather.css'
import AllNotes from './components/AllNotes'

function App() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [location, setLocation] = useState('Toronto')
  const [availableBalance, setAvailableBalance] = useState(0)

  // fetch balance from backend on load
  useEffect(() => {
    axios.get('https://calendar-budget-tracking-be.onrender.com/api/v1/balance')  // Updated URL
      .then(res => setAvailableBalance(res.data.value)) // set the available balance
      .catch(err => console.error('failed to fetch balance:', err))
  }, [])

  // sync changes to backend whenever available balance is updated
  useEffect(() => {
    axios.put('https://calendar-budget-tracking-be.onrender.com/api/v1/balance', { value: availableBalance }) // Updated URL
      .catch(err => console.error('failed to update balance:', err))
  }, [availableBalance])

  const formatDate = (date) => date.toISOString().split('T')[0]

  return (
    <div className="app-wrapper">
      <h1 className="app-title">CALENDAR NOTES</h1>

      <div className="location-box">
        <label>location:</label>
        <input
          value={location}
          onChange={e => setLocation(e.target.value)} // update location state
        />
      </div>

      <div className="balance-box">
        <label>Available Balance:</label>
        <input
          type="number"
          value={availableBalance}
          onChange={e => setAvailableBalance(Number(e.target.value))} // update balance
        />
      </div>

      <AllNotes /> {/* Display all notes toggle*/}

      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} /> {/* Calendar component */}

      {selectedDate && ( // if date is selected, show weather and notes
        <>
          <h2 className="selected-date">Selected Date: {formatDate(selectedDate)}</h2>
          <Weather date={formatDate(selectedDate)} location={location} /> {/* Show weather */}
          <Notes
            date={formatDate(selectedDate)}
            availableBalance={availableBalance}
            setAvailableBalance={setAvailableBalance} 
          />
        </>
      )}
    </div>
  )
}

export default App
