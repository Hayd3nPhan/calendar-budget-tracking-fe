import React,{useState,useEffect}from'react'
import axios from'axios'

const weekdays=['Mo','Tu','We','Th','Fr','Sa','Su']

//build calendar grid
function getMonthData(year,month){
    const result=[]
    const firstDay=new Date(year,month,1)
    const lastDay=new Date(year,month+1,0)
    const totalDays=lastDay.getDate()

    let startWeekDay=firstDay.getDay()
    if(startWeekDay===0)startWeekDay=7

    let currentRow=new Array(startWeekDay-1).fill(null)

    for(let date=1;date<=totalDays;date++){
        currentRow.push(new Date(year,month,date))
        if(currentRow.length===7){
            result.push(currentRow)
            currentRow=[]
        }
    }

    if(currentRow.length>0){
        while(currentRow.length<7)currentRow.push(null)
        result.push(currentRow)
    }

    return result
}

const Calendar=({selectedDate,onSelectDate})=>{
    const[currentDate,setCurrentDate]=useState(new Date())
    const[noteDates,setNoteDates]=useState([])

    const year=currentDate.getFullYear()
    const month=currentDate.getMonth()
    const monthData=getMonthData(year,month)

    // fetch note dates when month changes
    useEffect(()=>{
        const yearStr=String(year)
        const monthStr=String(month+1).padStart(2,'0')

        axios.get(`https://calendar-budget-tracking-be.onrender.com/api/v1/notes/month?year=${yearStr}&month=${monthStr}`)
        .then(res=>{
            const datesWithNotes=res.data.map(note=>note.date)
            setNoteDates(datesWithNotes)
        })
        .catch(err=>{
            console.log('error fetching note dates',err)
        })
    },[year,month])

    // compares two dates 
    const isSameDate=(d1,d2)=>
        d1?.getDate()===d2?.getDate()&&
        d1?.getMonth()===d2?.getMonth()&&
        d1?.getFullYear()===d2?.getFullYear()

    // check if note exists for date
    const hasNote=(date)=>{
        if(!date)return false
        const str=date.toISOString().slice(0,10)
        return noteDates.includes(str)
    }

    // when user clicks a day
    function handleSelect(day){
        onSelectDate(day)
    }

    return(
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={()=>setCurrentDate(new Date(year,month-1))}>←</button>
                <h2>{currentDate.toLocaleString('default',{month:'long'})} {year}</h2>
                <button onClick={()=>setCurrentDate(new Date(year,month+1))}>→</button>
            </div>

            <div className="calendar-weekdays">
                {weekdays.map(day=>(<div className="calendar-cell header" key={day}>{day}</div>))}
            </div>

            <div className="calendar-grid">
                {monthData.map((week,i)=>
                    week.map((day,j)=>(<div
                        key={`${i}-${j}`}
                        className={`calendar-cell day ${isSameDate(day,selectedDate)?'selected':''}`}
                        onClick={()=>day&&handleSelect(day)}
                    >
                        {day?(
                            <>
                                <span>{day.getDate()}</span>
                                {hasNote(day)&&<span className="dot"></span>}
                            </>
                        ):''}
                    </div>))
                )}
            </div>
        </div>
    )
}

export default Calendar
