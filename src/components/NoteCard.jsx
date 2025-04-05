import './NoteCard.css'

// displays one note card
function NoteCard({note,onDelete,onEdit}){

    // check if user overspent
    const overSpent = note.budget && note.amountSpent > note.budget

    return(
        <div className="note-card">
            {/* main note fields */}
            <p className="note-card-title"><strong>Title:</strong> {note.title}</p>
            <p><strong>Date:</strong> {note.date}</p>
            <p><strong>Time:</strong> {note.time}</p>
            <p><strong>Content:</strong> {note.content}</p>

            {/* extra info like budget, spending, etc. */}
            <div className="note-extra-info">
                {note.budget && <p><strong>Budget:</strong> ${note.budget}</p>}
                {note.amountSpent && <p><strong>Spent:</strong> ${note.amountSpent}</p>}
                {note.purpose && <p><strong>Purpose:</strong> {note.purpose}</p>}
                {note.category && <p><strong>Category:</strong> {note.category}</p>}

                {/* overspending warning */}
                {overSpent && (
                    <p style={{color:'red'}}>
                        You over spent ${note.amountSpent - note.budget} bro.
                    </p>
                )}

                {/* weather info if available */}
                {note.weather && (
                    <>
                        <p><strong>Weather:</strong> {note.weather}</p>
                        <p><strong>Temp:</strong> {note.temp}°C</p>
                        <p><strong>Location:</strong> {note.location}</p>
                    </>
                )}
            </div>

            {/* buttons to update or remove the note */}
            <div className="note-card-actions">
                {onEdit && <button onClick={() => onEdit(note)}>edit</button>}
                {onDelete && <button onClick={() => onDelete(note._id)}>delete</button>}
            </div>
        </div>
    )
}

export default NoteCard
