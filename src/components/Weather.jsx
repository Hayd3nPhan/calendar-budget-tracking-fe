import { useEffect, useState } from 'react'
import axios from 'axios'
import './Weather.css'

function Weather({ date, location }) {
  // State to store weather data
  const [data, setData] = useState(null)
  
  // Fetch weather data when date or location changes
  useEffect(() => {
    if (!date || !location) return 

    // Make an API call to fetch weather data
    axios.get(`https://calendar-budget-tracking-be.onrender.com/api/v1/weather`, {
      params: { date, location }
    }).then(res => {
      setData(res.data.data) // Store weather data in state
    })
  }, [date, location]) // Re-fetch when date or location changes

  if (!data) return <div className="weather-box">loading weather...</div> 

  return (
    <div className="weather-box">
      {/* Display weather information */}
      <p><strong>weather:</strong> {data.weather?.[0]?.description}</p>
      <p><strong>temp:</strong> {data.main?.temp}°C</p>
      <p><strong>location:</strong> {data.name}</p>
    </div>
  )
}

export default Weather
