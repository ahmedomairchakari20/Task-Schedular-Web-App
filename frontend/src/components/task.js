import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPen,
  faXmark,
  faTrashAlt,
  faMapPin,
  faUndo,
} from "@fortawesome/free-solid-svg-icons"

import "react-circular-progressbar/dist/styles.css"

import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import EditTaskModal from "./edittaskmodal"
import { ProgressCheck } from "./updatepercentage"

import "../styles/task.css"

function Task({ task, taskType }) {
  const navigate = useNavigate()
  const [PercentageModal, setPercentageModal] = useState()
  const [PUpdateModal, setPUpdateModal] = useState(false)

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
      navigate(0)
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
      navigate(0)
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
      navigate(0)
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
      navigate(0)
    } catch (error) {
      console.error(error)
    }
  }
  const hexToRGBA = (hex, opacity) => {
    if (checkDate(task.date, task.time)) {
      opacity = 0.6
    }

    const cleanHex = hex.replace("#", "")
    const red = parseInt(cleanHex.substring(0, 2), 16)
    const green = parseInt(cleanHex.substring(2, 4), 16)
    const blue = parseInt(cleanHex.substring(4, 6), 16)
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`
  }

  // if task is upcoming, on-going or complete left
  function checkDate(date, time) {
    const currentDate = new Date() // Get current date and time
    const targetDate = new Date(`${date} ${time}`)

    return targetDate < currentDate
  }

  function taskDetailHandler(e) {
    navigate(`/tasks/${task.id}`, { state: { task, taskType } })
  }
  return (
    <div
      className="task-row"
      style={{
        backgroundColor:
          taskType === "1"
            ? checkDate(task.date, task.time)
              ? "#ff5252de"
              : null
            : null,
      }}
    >
      <div onClick={taskDetailHandler} className="task-date">
        <h1
          style={{ backgroundColor: hexToRGBA(task.color, 0.8) }}
          className="task-date-color"
        >
          {task.date}
        </h1>
      </div>
      <div onClick={taskDetailHandler} className="task-detail">
        <h2>{task.title}</h2>
        <div
          className="description-div"
          dangerouslySetInnerHTML={{ __html: task.description }}
          // onClick={taskDetailHandler}
        />
        <h3>{task.time}</h3>
      </div>
      <div className="icon-row">
        {taskType === "2" ? (
          // <button className="progress-btn" onClick={()=>{setPUpdateModal(true)}}>

          <ProgressCheck
            id={task.id}
            value={task.complete_percentage}
            color={task.color}
            PUpdateModal={PUpdateModal}
            setPUpdateModal={setPUpdateModal}
            className="modal-percentage"
          />
        ) : // </button>
        null}

        {task.pin === undefined || task.pin === false ? (
          <FontAwesomeIcon
            className="task-edit-icon"
            onClick={pinHandler}
            size="2xl"
            icon={faMapPin}
          />
        ) : null}
        {task.pin === true ? (
          <FontAwesomeIcon
            className="task-edit-icon"
            onClick={pinHandler}
            size="2xl"
            icon={faUndo}
          />
        ) : null}
        {taskType!=="3" ? (
          
          <FontAwesomeIcon
          className="task-edit-icon"
          onClick={editHandler}
          size="2xl"
          icon={faPen}
        />):null
        }
        
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
          className="task-edit-icon"
          onClick={deleteHandler}
          size="2xl"
          icon={faTrashAlt}
        />
      </div>
    </div>
  )
}
// export {pinHandler, editHandler, deleteHandler}
export default Task
