import { useEffect, useState } from 'react'
import axios from 'axios'
import NoteCard from './NoteCard'

const AllNotes = () => {
  // state to toggle all notes view
  const [showAll, setShowAll] = useState(true)
  const [notes, setNotes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (showAll) {
      // fetch all notes when toggled on
      axios.get('https://calendar-budget-tracking-be.onrender.com/api/v1/notes/all')  // Updated URL
        .then(res => {
          setNotes(res.data)
          setError(null)
        }).catch(err => {
          console.log('error fetching all notes', err)
          setError('could not load all notes')
        })
    }
  }, [showAll])

  // delete note by id
  const handleDelete = (id) => {
    axios.delete(`https://calendar-budget-tracking-be.onrender.com/api/v1/notes/${id}`)  // Updated URL
      .then(() => {
        setNotes(notes.filter(n => n._id !== id))
      })
      .catch(err => {
        console.log('delete failed', err)
      })
  }

  return (
    <div className="all-notes">
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'hide all notes' : 'show all notes'}
      </button>

      {showAll && (
        <div className="all-notes-list">
          {error && <p>{error}</p>}
          {notes.length === 0 ? (
            <p>no notes available</p>
          ) : (
            // display each note card
            notes.map(n => (
              <NoteCard key={n._id} note={n} onDelete={() => handleDelete(n._id)} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AllNotes
