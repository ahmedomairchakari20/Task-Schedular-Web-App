import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Task from "../components/task"
import ConfirmationModal from "../components/removeallmodal"

import AddTaskModal from "../components/addtaskmodal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons"

import "../styles/tasks.css"

function Tasks() {
  //  localStorage.getItem("loggedEmail")
  const [upcomingTasks, setUpcomingTasks] = useState(null)
  const [inprogressTasks, setInprogressTasks] = useState(null)
  const [completeTasks, setCompleteTasks] = useState(null)
  const [taskType, setTaskType] = useState(
    localStorage.getItem("taskType") || "1"
  )
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [removeAllModal, setRemoveAllModal] = useState(false)

  async function searchTaskHandler(search) {
    // api call to backend to fetch & Update tasks
    let email = JSON.parse(localStorage.getItem("loggedEmail"))

    try {
      const response = await axios.get("http://127.0.0.1:8000/search", {
        params: {
          email: email,
          search: search,
        },
      })
      console.log(response.data)
      // first we clean our data, like outdated pinned tasks (that are moved to progress)
      cleanUpcomingTasks(response.data["upcoming"] || [])
      cleanInprogressTasks(response.data["inprogress"] || [])
      cleanDoneTasks(response.data["complete"] || [])

      // we get the pinned tasks from localStorage
      let pinnedUpcomingTasks =
        JSON.parse(localStorage.getItem("pinnedUpcomingTasks")) || []
      let pinnedInprogressTasks =
        JSON.parse(localStorage.getItem("pinnedInprogressTasks")) || []
      let pinnedDoneTasks =
        JSON.parse(localStorage.getItem("pinnedDoneTasks")) || []

      // We loop through & add those in UC that are not pinned
      const uc_tasks = response.data["upcoming"] || []
      const uc = []
      uc_tasks.forEach((task) => {
        const isObjectPresent = pinnedUpcomingTasks.find(
          (t) => t.id === task.id
        )
        if (!isObjectPresent) {
          // As find return object else undefined
          uc.push(task)
        }
      })

      setUpcomingTasks([...pinnedUpcomingTasks, ...uc])

      // upcomingTasks && local storage of pinnedUpcomingTasks
      const ip = []
      const ip_tasks = response.data["inprogress"] || []
      ip_tasks.forEach((task) => {
        const isObjectPresent = pinnedInprogressTasks.find(
          (t) => t.id === task.id
        )
        if (!isObjectPresent) {
          // As find return object else undefined
          ip.push(task)
        }
      })
      setInprogressTasks([...pinnedInprogressTasks, ...ip])

      const d = []
      const done_tasks = response.data["complete"] || []
      done_tasks.forEach((task) => {
        const isObjectPresent = pinnedDoneTasks.find((t) => t.id === task.id)
        if (!isObjectPresent) {
          // As find return object else undefined
          d.push(task)
        }
      })
      setCompleteTasks([...pinnedDoneTasks, ...d])
    } catch (error) {
      console.error(error)
    }
  }

  function AddTaskHandler(e) {
    e.preventDefault()
    setModalIsOpen(true)
  }
  function cleanUpcomingTasks(tasks) {
    let pinnedUpcomingTasks =
      JSON.parse(localStorage.getItem("pinnedUpcomingTasks")) || []
    const filteredTasks = pinnedUpcomingTasks
      .map((task) => {
        let foundTask = tasks.find((t) => t.id === task.id)
        if (foundTask) {
          foundTask["pin"] = true
        }
        return foundTask ? foundTask : null
      })
      .filter(Boolean) // Remove null values from the resulting array
    localStorage.setItem("pinnedUpcomingTasks", JSON.stringify(filteredTasks))
  }

  function cleanInprogressTasks(tasks) {
    let pinnedInprogressTasks =
      JSON.parse(localStorage.getItem("pinnedInprogressTasks")) || []
    let filteredTasks = pinnedInprogressTasks
      .map((task) => {
        let foundTask = tasks.find((t) => t.id === task.id)
        console.log(foundTask)
        if (foundTask) {
          foundTask["pin"] = true
        }
        return foundTask ? foundTask : null
      })
      .filter(Boolean)
    console.log(tasks)
    console.log(filteredTasks)

    localStorage.setItem("pinnedInprogressTasks", JSON.stringify(filteredTasks))
  }

  function cleanDoneTasks(tasks) {
    let pinnedDoneTasks =
      JSON.parse(localStorage.getItem("pinnedDoneTasks")) || []
    // console.log(pinnedDoneTasks)
    const filteredTasks = pinnedDoneTasks
      .map((task) => {
        let foundTask = tasks.find((t) => t.id === task.id)
        if (foundTask) {
          foundTask["pin"] = true
        }
        return foundTask ? foundTask : null
      })
      .filter(Boolean)
    // console.log(filteredTasks)
    localStorage.setItem("pinnedDoneTasks", JSON.stringify(filteredTasks))
  }

  async function getTasks() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))

    try {
      const response = await axios.get("http://127.0.0.1:8000/add", {
        params: {
          email: email,
        },
      })
      console.log(response.data)
      // first we clean our data, like outdated pinned tasks (that are moved to progress)
      cleanUpcomingTasks(response.data["upcoming"] || [])
      cleanInprogressTasks(response.data["inprogress"] || [])
      cleanDoneTasks(response.data["complete"] || [])

      // we get the pinned tasks from localStorage
      let pinnedUpcomingTasks =
        JSON.parse(localStorage.getItem("pinnedUpcomingTasks")) || []
      let pinnedInprogressTasks =
        JSON.parse(localStorage.getItem("pinnedInprogressTasks")) || []
      let pinnedDoneTasks =
        JSON.parse(localStorage.getItem("pinnedDoneTasks")) || []

      // We loop through & add those in UC that are not pinned
      const uc_tasks = response.data["upcoming"] || []
      const uc = []
      uc_tasks.forEach((task) => {
        const isObjectPresent = pinnedUpcomingTasks.find(
          (t) => t.id === task.id
        )
        if (!isObjectPresent) {
          // As find return object else undefined
          uc.push(task)
        }
      })

      setUpcomingTasks([...pinnedUpcomingTasks, ...uc])

      // upcomingTasks && local storage of pinnedUpcomingTasks
      const ip = []
      const ip_tasks = response.data["inprogress"] || []
      ip_tasks.forEach((task) => {
        const isObjectPresent = pinnedInprogressTasks.find(
          (t) => t.id === task.id
        )
        if (!isObjectPresent) {
          // As find return object else undefined
          ip.push(task)
        }
      })
      setInprogressTasks([...pinnedInprogressTasks, ...ip])

      const d = []
      const done_tasks = response.data["complete"] || []
      done_tasks.forEach((task) => {
        const isObjectPresent = pinnedDoneTasks.find((t) => t.id === task.id)
        if (!isObjectPresent) {
          // As find return object else undefined
          d.push(task)
        }
      })
      setCompleteTasks([...pinnedDoneTasks, ...d])
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getTasks()
  }, []) //load once

  return (
    <>
      <AddTaskModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />

      <div className="task-upper-section">
        <Link to={"/home"}>
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

      <div className="task-main-section">
        <div className="btn-tasksearch">
          <button onClick={(e) => AddTaskHandler(e)}>More Tasks +</button>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              onChange={(e) => {
                if (e.target.value === "") {
                  getTasks()
                } else {
                  searchTaskHandler(e.target.value)
                }
              }}
              type="text"
              name="search-task"
              placeholder="Search"
            />
          </form>
        </div>

        <div className="tasks-type">
          <h5
            id="upcoming"
            onClick={() => {
              setTaskType("1")
              localStorage.setItem("taskType", "1")
            }}
            className={`task-type1 ${
              taskType === "1" ? "my-active" : "my-inactive"
            }`}
          >
            upcoming
          </h5>
          <h5 className="my-inactive">|</h5>
          <h5
            onClick={() => {
              setTaskType("2")
              localStorage.setItem("taskType", "2")
            }}
            className={`task-type2 ${
              taskType === "2" ? "my-active" : "my-inactive"
            }`}
          >
            In-Progress
          </h5>
          <h5 className="my-inactive">|</h5>
          <h5
            onClick={() => {
              setTaskType("3")
              localStorage.setItem("taskType", "3")
            }}
            className={`task-type3 ${
              taskType === "3" ? "my-active" : "my-inactive"
            }`}
          >
            Done
          </h5>
        </div>

        <div>
          {taskType === "1"
            ? upcomingTasks?.map((task) => (
                <Task task={task} taskType={taskType} />
              ))
            : null}
          {taskType === "2"
            ? inprogressTasks?.map((task) => (
                <Task task={task} taskType={taskType} />
              ))
            : null}
          {taskType === "3"
            ? completeTasks?.map((task) => (
                <Task task={task} taskType={taskType} />
              ))
            : null}
          {taskType === "3" && completeTasks?.length ? (
            <div className="delete-all-container">
              <button
                className="btn-grad w100"
                onClick={() => setRemoveAllModal(true)}
              >
                Clear All
              </button>
            </div>
          ) : null}

          <ConfirmationModal
            removeAllModal={removeAllModal}
            setRemoveAllModal={setRemoveAllModal}
          />
        </div>
      </div>
    </>
  )
}

export default Tasks
