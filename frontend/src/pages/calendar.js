import React, { useState, useEffect } from "react"
import "react-calendar/dist/Calendar.css"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Calendar } from "react-multi-date-picker"
import "react-tooltip/dist/react-tooltip.css"
import { Tooltip } from "react-tooltip"
import ReactDOMServer from "react-dom/server"
import "../styles/calendar.css"
import axios from "axios"

//to do: do not show, completed tasks

function MyCalendar() {
  const [multipleTasks, setMultipleTasks] = useState(null)
  const [singleTasks, setSingleTasks] = useState(null)

  async function getTasks() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.get("http://127.0.0.1:8000/calendar", {
        params: {
          email: email,
        },
      })
      console.log(response.data)
      setMultipleTasks(response.data["multiple_task"])
      setSingleTasks(response.data["single_task"])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <div>
      <div className="calendar-header">
        <h4 className="db-heading-back">
          <Link to={"/home"}><FontAwesomeIcon
                    className="itemright"
                    size="2xl"
                    icon={faCircleArrowLeft}
                    style={{ color: "#ffffff" }}
                />back to main</Link>
        </h4>
        <h2 className="itemcenter">Calendar</h2>
      </div>
      <div className="calendar-center">
        {multipleTasks && singleTasks && (
          <CalendarComponent
            multipleTasks={multipleTasks}
            singleTasks={singleTasks}
          />
        )}
      </div>
    </div>
  )
}

function CalendarComponent({ multipleTasks, singleTasks }) {

  let selected = document.querySelectorAll(".rmdp-selected")
  // let style = document.querySelectorAll(".rmdp-day")
  

  function setTasks() {
    const sd = singleTasks.map((task) => task.date)
    const md = multipleTasks.map((task) => task[0].date)

    setDates([...sd, ...md])

    // console.log(dates)
  }
  function convertMonthToIndex(selectedYear){
    if (selectedYear === 'January'){
      return '01'
    }
    else if(selectedYear === 'February'){
      return '02'
    }
    else if (selectedYear === 'March'){
      return '03'
    }
    else if (selectedYear === 'April'){
      return '04'
    }
    else if (selectedYear === 'May'){
      return '05'
    }
    else if (selectedYear === 'June'){
      return '06'
    }
    else if (selectedYear === 'July'){
      return '07'
    }
    else if (selectedYear === 'August'){
      return '08'
    }
    else if (selectedYear === 'September'){
      return '09'
    }
    else if (selectedYear === 'October'){
      return '10'
    }
    else if (selectedYear === 'November'){
      return '11'
    }
    else if (selectedYear === 'December'){
      return '12'
    }
  }

  function setCircle() {
    setTimeout(() => {
      // setDates()
      selected = document.querySelectorAll(".rmdp-day.rmdp-selected")
      // console.log(selected)
      // selected = Array.from(selected).filter(day => !day.classList.contains('rmdp-today'));
      let selectedDate = document.querySelectorAll('.rmdp-header-values span')
      // console.log(selected)
      // console.log(selectedDate[0].innerHTML)
      // console.log(selectedDate[1].innerHTML)
      let selectedMonth = selectedDate[0].innerHTML
      let selectedYear = selectedDate[1].innerHTML
      selectedMonth = convertMonthToIndex(selectedMonth)
      // console.log(selectedYear)

      selected?.forEach((sd, idx) => {
        // console.log(sd.firstChild)
        // console.log(typeof(sd.firstChild.innerHTML)) // string 1-31
        
        singleTasks.map((task) => {
          // only 1 task per day
          const parts = task.date.toString().split("-")
          const day = parts[2]
          const month = parts[1]
          const year = parts[0]
          // console.log(parts)
          
          let calendarDay = sd.firstChild.innerHTML.toString() 
          calendarDay = calendarDay.length === 1 ? `0${calendarDay}`: calendarDay
          //rmdp-header-values also need to match months

          // && year.toString() === selectedYear
          // && month.toString() === selectedMonth

          if (day.toString() === calendarDay
          && year.toString() === selectedYear
          && month.toString() === selectedMonth) {
            // console.log(`My day is: ${day}, months is: ${month}, year is: ${year}`)
            // console.log(`Selected day is: ${calendarDay}, month is: ${selectedMonth}, year is: ${selectedYear}`)

            // console.log(day, "matcheddd!!!")
            sd.setAttribute("data-tooltip-id", "my-tooltip")
            sd.setAttribute(
              "data-tooltip-html",
              `<div class="circle" style='background-color:${task.color};'></div>${task.title}<br />${task.description}${task.time}
            `
            )

            sd.style.backgroundImage = `linear-gradient(${task.color}, ${task.color})`
            sd.style.borderRadius = `100%`
            sd.firstChild.style.background = "white"
            sd.firstChild.style.color = `black`
          }
          return ""
        })

        multipleTasks.map((tasks) => {
          // suppose 2
          const parts = tasks[0].date.toString().split("-")
          const day = parts[2]
          const month = parts[1]
          const year = parts[0]
          let calendarDay = sd.firstChild.innerHTML.toString() 
          calendarDay = calendarDay.length === 1 ? `0${calendarDay}`: calendarDay

          if (day.toString() === calendarDay
          && year.toString() === selectedYear
          && month.toString() === selectedMonth) {
            // multi date recognized
            // console.log(day, "found")
            let concatTasks = ""
            tasks.map((task) => {
              concatTasks += `<div class="circle" style='background-color:${task.color};'></div>${task.title}<br />${task.description}${task.time}<br/><br/>`
              return ""
            })
            sd.setAttribute("data-tooltip-id", "my-tooltip")
            sd.setAttribute("data-tooltip-html", concatTasks)
            let bgColor = `linear-gradient(`
            tasks.map((task, idx) => {
              if (parseInt(idx) + 1 === parseInt(tasks.length)) {
                bgColor += `${task.color})`
              } else {
                bgColor += `${task.color},`
              }
              return ""
            })

            sd.style.backgroundImage = bgColor
            sd.style.borderRadius = `100%`
            sd.firstChild.style.background = "white"
            sd.firstChild.style.color = `black`
          }

          return ""
        })
      })
    }, 100)
  }

  function cleanSelected() {
    // clean this up
    selected = document.querySelectorAll("[data-tooltip-id='my-tooltip']")
    let hidden = document.querySelectorAll(".rmdp-day-hidden")
    // console.log(selected)
    // console.log(hidden)

    selected.forEach((sd) => {

      // console.log(sd)
      sd.setAttribute("data-tooltip-id", "")
      sd.setAttribute("data-tooltip-html", ``)
      sd.style = "";
      sd.firstChild.style = ""
    })
    hidden.forEach((sd) => {

      // console.log(sd)
      sd.setAttribute("data-tooltip-id", "")
      sd.setAttribute("data-tooltip-html", ``)
      sd.style = "";
      sd.firstChild.style = ""

    })


  }
  const [weekStart, setWeekStart] = useState(0)

  useEffect(() => {
    // there needs to be a function that cleans all the styling especially of
    // cleanSelected(selected)
    // console.log('helo')
    // console.log(style)
    setTasks()
    setCircle()
  }, [multipleTasks, singleTasks ])



  function cleanAndRender(){

    cleanSelected()
      setTasks()
      setCircle()

  }

  useEffect(()=>{
    console.log("UseEffect of monday format sunday format")
    // selected = document.querySelectorAll(".rmdp-selected")
    cleanAndRender()
    
  }, [weekStart])

  const colors = [
    "red",
    "pink",
    "orange",
    "yellow",
    "red",
    "pink",
    "orange",
    "yellow",
  ]
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  const [dates, setDates] = useState([])


  return (
    <div className="calendar-container">
      <div className="btn-container">
        <button className="btn-grad" onClick={() => setWeekStart(0)}>
          Sunday
        </button>
        <button className="btn-grad" onClick={() => setWeekStart(1)}>
          Monday
        </button>
      </div>
      <Tooltip
        // data-tooltip-html={ReactDOMServer.renderToStaticMarkup(<div>I am <b>JSX</b> content</div>)}
        // delayHide={2000}
        clickable={true}
        data-html={true}
        id="my-tooltip"
        multiline={true}
        className="tooltip"
        effect="solid"
      />

      <Calendar
        // weekDays={weekDays}
        format="YYYY/MM/DD"
        weekStartDayIndex={weekStart}
        // multiple
        onFocusedDateChange={()=>{}}
        value={dates}
        onMonthChange={()=> {
          console.log("month changed")
          cleanAndRender()
        }}
        className="my-calendar-class"
      />
    </div>
  )


  
}




export default MyCalendar
