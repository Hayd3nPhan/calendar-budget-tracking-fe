import { useEffect, useState } from 'react'
import axios from 'axios'
import './Notes.css'

const CATEGORIES = ['Studying', 'Eating', 'Entertainment', 'Basic Needs', 'Others']

function Notes({ date, availableBalance, setAvailableBalance }) {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [time, setTime] = useState('')
  const [budget, setBudget] = useState('')
  const [purpose, setPurpose] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [amountSpent, setAmountSpent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [previousSpent, setPreviousSpent] = useState(0)
  const [weatherData, setWeatherData] = useState(null)

  // Fetch notes and weather data when the date changes
  useEffect(() => {
    if (!date) return

    axios.get(`https://calendar-budget-tracking-be.onrender.com/api/v1/notes?date=${date}`)
      .then(res => setNotes(res.data))

    axios.get('https://calendar-budget-tracking-be.onrender.com/api/v1/weather', {
      params: { date, location: 'Toronto' }
    })
    .then(res => {
      setWeatherData(res.data.data)
    })
    .catch(() => {
      setWeatherData(null)
    })
  }, [date])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title || !content || !time) return

    const note = {
      title,
      content,
      time,
      date,
      budget: budget ? Number(budget) : undefined,
      amountSpent: amountSpent ? Number(amountSpent) : undefined,
      purpose,
      category,
      weather: weatherData?.weather?.[0]?.description,
      temp: weatherData?.main?.temp,
      location: weatherData?.name
    }

    const method = editingId ? 'put' : 'post'
    const url = editingId
      ? `https://calendar-budget-tracking-be.onrender.com/api/v1/notes/${editingId}`
      : 'https://calendar-budget-tracking-be.onrender.com/api/v1/notes'

    try {
      await axios[method](url, note)
      // Update the balance if amountSpent changes
      if (note.amountSpent !== undefined) {
        const change = editingId
          ? note.amountSpent - previousSpent
          : note.amountSpent
        if (change !== 0) {
          await axios.put('https://calendar-budget-tracking-be.onrender.com/api/v1/balance', {
            value: availableBalance - change
          })
          setAvailableBalance(prev => prev - change)
        }
      }
      // Reset form
      setTitle('')
      setContent('')
      setTime('')
      setBudget('')
      setPurpose('')
      setCategory(CATEGORIES[0])
      setAmountSpent('')
      setEditingId(null)
      setPreviousSpent(0)

      // Refresh notes
      const refreshed = await axios.get(`https://calendar-budget-tracking-be.onrender.com/api/v1/notes?date=${date}`)
      setNotes(refreshed.data)
    } catch (err) {
      console.error('note save failed:', err)
    }
  }

  const handleDelete = (id) => {
    axios.delete(`https://calendar-budget-tracking-be.onrender.com/api/v1/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(n => n._id !== id))
      })
  }

  const handleEdit = (note) => {
    setTitle(note.title)
    setContent(note.content)
    setTime(note.time)
    setBudget(note.budget || '')
    setPurpose(note.purpose || '')
    setCategory(note.category || CATEGORIES[0])
    setAmountSpent(note.amountSpent || '')
    setEditingId(note._id)
    setPreviousSpent(note.amountSpent || 0)
  }

  return (
    <div className="notes-box">
      <h3>notes for {date}</h3>

      {/* Weather information display */}
      {weatherData && (
        <div className="note-weather">
          <div><strong>weather:</strong> {weatherData.weather?.[0]?.description}</div>
          <div><strong>temp:</strong> {weatherData.main?.temp}°C</div>
          <div><strong>location:</strong> {weatherData.name}</div>
        </div>
      )}

      {/* Form for adding or editing a note */}
      <form onSubmit={handleAdd} className="note-form">
        <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="content" value={content} onChange={e => setContent(e.target.value)} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <input type="number" placeholder="budget" value={budget} onChange={e => setBudget(e.target.value)} />
        <input placeholder="purpose" value={purpose} onChange={e => setPurpose(e.target.value)} />

        <label className="notes-box-category">select category:</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
        </select>

        <input type="number" placeholder="amount spent" value={amountSpent} onChange={e => setAmountSpent(e.target.value)} />
        <button type="submit">{editingId ? 'update' : 'add'} note</button>
      </form>

      {/* List of notes */}
      <ul className="note-list">
        {notes.map(note => {
          const overSpent = note.budget && note.amountSpent > note.budget
          return (
            <li key={note._id}>
              <div><strong>{note.time}</strong> - {note.title}</div>
              <div>{note.content}</div>
              {note.budget && <div><strong>budget:</strong> ${note.budget}</div>}
              {note.amountSpent && <div><strong>spent:</strong> ${note.amountSpent}</div>}
              {note.purpose && <div><strong>purpose:</strong> {note.purpose}</div>}
              {note.category && <div><strong>category:</strong> {note.category}</div>}
              {note.weather && <div><strong>weather:</strong> {note.weather}</div>}
              {note.temp && <div><strong>temp:</strong> {note.temp}°C</div>}
              {note.location && <div><strong>location:</strong> {note.location}</div>}
              {overSpent && (
                <div style={{ color: 'red' }} >
                  You over spent ${note.amountSpent - note.budget} bro.
                  Your current balance is: ${availableBalance}
                </div>
              )}
              <button onClick={() => handleEdit(note)}>edit</button>
              <button onClick={() => handleDelete(note._id)}>delete</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Notes
