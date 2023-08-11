import { useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import "../styles/taskdetail.css"
import EditTaskModal from "../components/edittaskmodal"

import {
  faPen,
  faXmark,
  faMapPin,
  faTrashAlt,
  faUndo,
} from "@fortawesome/free-solid-svg-icons"

import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"

function Detail() {
  const navigate = useNavigate()
  const [PercentageModal, setPercentageModal] = useState()

  const { state } = useLocation()
  const { task, taskType } = state

  console.log(task)

  function checkDate(date, time) {
    const currentDate = new Date() // Get current date and time
    const targetDate = new Date(`${date} ${time}`)

    return targetDate < currentDate
  }

  function pinHandler() {
    // store the order in localstorage the pinned order
    if (taskType === "1") {
      let pinnedUpcomingList =
        JSON.parse(localStorage.getItem("pinnedUpcomingTasks")) || []
      const isObjectPresent = pinnedUpcomingList.find((t) => t.id === task.id)
      if (!isObjectPresent) {
        //pin
        task["pin"] = true
        pinnedUpcomingList.push(task)
      } else {
        //unpin
        const idToRemove = task.id
        pinnedUpcomingList = pinnedUpcomingList.filter(
          (obj) => obj.id !== idToRemove
        )
      }
      localStorage.setItem(
        "pinnedUpcomingTasks",
        JSON.stringify(pinnedUpcomingList)
      )
      navigate("/tasks")
    } else if (taskType === "2") {
      let pinnedInprogressList =
        JSON.parse(localStorage.getItem("pinnedInprogressTasks")) || []
      const isObjectPresent = pinnedInprogressList.find((t) => t.id === task.id)
      if (!isObjectPresent) {
        task["pin"] = true
        pinnedInprogressList.push(task)
      } else {
        const idToRemove = task.id
        pinnedInprogressList = pinnedInprogressList.filter(
          (obj) => obj.id !== idToRemove
        )
      }
      localStorage.setItem(
        "pinnedInprogressTasks",
        JSON.stringify(pinnedInprogressList)
      )
      navigate("/tasks")
    } else if (taskType === "3") {
      let pinnedDoneList =
        JSON.parse(localStorage.getItem("pinnedDoneTasks")) || []
      const isObjectPresent = pinnedDoneList.find((t) => t.id === task.id)
      if (!isObjectPresent) {
        task["pin"] = true
        pinnedDoneList.push(task)
      } else {
        const idToRemove = task.id
        pinnedDoneList = pinnedDoneList.filter((obj) => obj.id !== idToRemove)
      }
      localStorage.setItem("pinnedDoneTasks", JSON.stringify(pinnedDoneList))
      navigate("/tasks")
    }
  }

  function editHandler() {
    // maybe a popup to change complete percentage, complete status
    // recurring dates etc...
    setPercentageModal(true)
  }
  async function deleteHandler() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.delete("http://127.0.0.1:8000/add", {
        params: {
          email: email,
          id: task.id,
        },
      })
      console.log(response.data)
      navigate("/tasks")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="task-upper-section">
        <Link to={"/tasks"}>
          <h4>
            <FontAwesomeIcon
              className="itemright"
              size="2xl"
              icon={faCircleArrowLeft}
              style={{ color: "#ffffff" }}
            />
            Back to main
          </h4>
        </Link>
        <h2 className="itemcenter">Tasks</h2>
      </div>
      {console.log(task.color)}

      <div className="task-main-section">
        <div
          className="task-detail-heading"
          style={{
            backgroundColor:
              taskType === "1"
                ? checkDate(task.date, task.time)
                  ? "#ff5252de"
                  : task.color === "#ffffff" ? "transparent" : task.color
                : task.color === "#ffffff" ? "transparent" : task.color,
          }}
        >
            <h1></h1>
            <h2 className="itemcenter">{task.title}</h2>
            <div className="actions">
              {task.pin === undefined || task.pin === false ? (
                <FontAwesomeIcon
                  onClick={pinHandler}
                  size="2xl"
                  icon={faMapPin}
                />
              ) : null}
              {task.pin === true ? (
                <FontAwesomeIcon
                  onClick={pinHandler}
                  size="2xl"
                  icon={faUndo}
                />
              ) : null}
              <FontAwesomeIcon onClick={editHandler} size="2xl" icon={faPen} />
              {task ? (
                <EditTaskModal
                  PercentageModal={PercentageModal}
                  setPercentageModal={setPercentageModal}
                  percentage={task.complete_percentage}
                  id={task.id}
                  task={task}
                />
              ) : null}
              <FontAwesomeIcon
                onClick={deleteHandler}
                size="2xl"
                icon={faTrashAlt}
              />
            </div>
          {/* </div> */}
        </div>

        <div className="task-details-section">
          <div className="row">
            <p className="row-first-p">Description:</p>
            <p dangerouslySetInnerHTML={{ __html: task.description }} />
          </div>
          <div className="row">
            <p className="row-first-p">Date:</p>
            <p>{task.date}</p>
          </div>
          <div className="row">
            <p className="row-first-p">Time:</p>
            <p>{task.time}</p>
          </div>
          <div className="row">
            <p className="row-first-p">Media:</p>
            {task.image ? (
              <div className="images-container">
                {console.log(task.image)}
                <img src={`http://127.0.0.1:8000${task.image}`} alt="" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default Detail
