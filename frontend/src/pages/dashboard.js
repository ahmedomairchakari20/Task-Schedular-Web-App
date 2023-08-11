import "../styles/dashboard.css"
import { Link } from "react-router-dom"
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import axios from "axios"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons"

export default function Dashboard() {
  const [data, setData] = useState(null)

  async function getTasks() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.get("http://127.0.0.1:8000/dashboard", {
        params: {
          email: email,
        },
      })
      console.log(response.data)
      setData(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getTasks()
  }, []) //load once

  return (
    <>
      <div className="dashboard-section">
        <h4 className="db-heading-back">
          <Link to={"/home"}><FontAwesomeIcon
                    className="itemright"
                    size="2xl"
                    icon={faCircleArrowLeft}
                    style={{ color: "#ffffff" }}
                />back to main</Link>
        </h4>
        <h2 className="itemcenter">DashBoard</h2>
      </div>
      <div className="dashboard-main-section">
        <h2 className="m1" style={{color:"white"}}>Overview & Stats</h2>
        <div className="task-details">
          <div className="total-upcoming">
            <h2>Total Upcoming</h2>
            <h2>{data == null ? 0 : data.upcoming_tasks}</h2>
          </div>
          <div className="total-progress">
            <h2>Total In-progress</h2>
            <h2>{data == null ? 0 : data.inprogress_tasks}</h2>
          </div>
          <div className="total-done">
            <h2>Total Done</h2>
            <h2>{data == null ? 0 : data.completed_tasks}</h2>
          </div>
        </div>
        <div className="all-tasks">
          {data == null ? null : <Progression
            total={data.total} 
            done={data.completed_tasks/ data.total * 100} 
            upcoming={data.upcoming_tasks/ data.total * 100}
            inprogress = {data.inprogress_tasks/ data.total * 100}
           />}
        </div>
      </div>
    </>
  )
}

function Progression({ total, done, inprogress, upcoming }) {
  console.log(total, done, inprogress, upcoming)
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    const progress = document.querySelectorAll(".progress")
    const progressText = document.querySelectorAll(".data-progress")

    progress.forEach((pro) => {
      const percentage = pro.getAttribute("data-value")
      const color = pro.getAttribute("data-stroke")
      const animateTime = pro.getAttribute("data-time")
      const radius = pro.r.baseVal.value
      const circumference = radius * 2 * Math.PI
      const stroke = circumference - (circumference * percentage) / 100

      pro.style.setProperty("--stroke-dashoffset", stroke)
      pro.style.setProperty("--stroke-dasharray", circumference)
      pro.style.setProperty("--stroke", color)
      pro.style.setProperty("--animation-time", `${animateTime * 50}ms`)
    })

    progressText.forEach((text) => {
      const data = text.getAttribute("data-value")
      let progressValue = 0
      const progressBar = setInterval(() => {
        progressValue++
        setProgressValue(progressValue)
        if (progressValue === data) {
          clearInterval(progressBar)
        }
      }, 100)
    })
  }, [])

  return (
    <div className="skill">
      <div className="tasks-count">
        <h3>
          {total} <br /> Total Tasks
        </h3>
      </div>
      <svg className="my-circle progress-bar-svg">
        <circle cx="150" cy="120" r="90"></circle>
        <circle
          cx="150"
          cy="120"
          r="90"
          className="progress"
          data-value="100"
          data-stroke="lightgrey"
          data-time="60"
        ></circle>
        <circle
          cx="150"
          cy="120"
          r="90"
          className="progress"
          data-value={[done, inprogress, upcoming].sort((a,b)=> a-b)[2]}
          data-stroke="blue"
          data-time="60"
        ></circle>
        <circle
          cx="150"
          cy="120"
          r="90"
          className="progress"
          data-value={[done, inprogress, upcoming].sort((a,b)=> a-b)[1]}
          data-stroke="palegreen"
          data-time="60"
        ></circle>
        <circle
          cx="150"
          cy="120"
          r="90"
          className="progress"
          data-value={[done, inprogress, upcoming].sort((a,b)=> a-b)[0]}
          data-stroke="orange"
          data-time="60"
        ></circle>
      </svg>
    </div>
  )
}
