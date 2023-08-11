import Modal from "react-modal"
import { useState, useEffect } from "react"
import "react-sweet-progress/lib/style.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKeyboard } from "@fortawesome/free-solid-svg-icons"
import "../styles/task.css"
import EditorModal from "./richeditormodal" // Rich Text Editor Modal
import ColorPickerModal from "./colorpickermodal" // Color Picker Modal
import DatePicker from "react-multi-date-picker"
import Toggle from "react-styled-toggle"

import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

import { Calendar } from "react-multi-date-picker"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "100vh",
    width: "100vw",
    padding: "0",
  },
}

function endsWithNumber(string) {
  const pattern = /\d$/
  return pattern.test(string)
}


function EditTaskModal({ PercentageModal, setPercentageModal, task }) {
  const navigate = useNavigate()

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [date, setDate] = useState(StringToDate(task.date))
  const [time, setTime] = useState(StringToTime(task.time))
  const [color, setColor] = useState(task.color)
  const [media, setMedia] = useState(null)
  const [remindMe, setRemindMe] = useState(task.remind_me || false)
  const [recurringTask, setRecurringTask] = useState(
    task.recurring_task || false
  )
  // console.log(task.media.split('/').pop());

  const [editorState, setEditorState] = useState(false)
  const [colorState, setColorState] = useState(false)
  const [image,setImage]=useState("http://127.0.0.1:8000"+task.image)

  const [defaultRemindDates, setDefaultRemindDates] = useState(
    getDates(task.remind_me_date) || []
  )
  const [defaultRecurringDates, setDefaultRecurringDates] = useState(
    getDates(task.recurring_task_date) || []
  )
  const [status, setStatus] = useState(null);

  const [NLP, setNLP] = useState(false)
  const [NLP2, setNLP2] = useState(false)

  let active = ""
  const [reminddateStr, setRemindDateStr] = useState("")
  const [recurdateStr, setRecurDateStr] = useState("")

  function setRemindInput() {
    // let remindDates = document.querySelector(".remind-date-picker-input")

    const dateString = defaultRemindDates
      .map((date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}/${month}/${day}`
      })
      .join(", ")

    return dateString
  }
  function setRecurInput() {
    const dateString = defaultRecurringDates
      .map((date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}/${month}/${day}`
      })
      .join(", ")

    return dateString
  }

  function updateRemindDates() {
    //
    let remindDatesList = document.querySelector(".remind-date-picker-input")
    console.log(stringToArrayDates(remindDatesList.value))
    let recurDatesList = stringToArrayDates(remindDatesList.value)
    return recurDatesList
  }

  function updateRecurDates() {
    let recurDates = document.querySelector(".recur-date-picker-input")
    console.log(stringToArrayDates(recurDates.value))
    let recurDatesList = stringToArrayDates(recurDates.value)
    return recurDatesList
  }
  function convertDateFormat(originalDate) {
    // Split the date string into day, month, and year
    var parts = originalDate.split(" ")
    var day = parts[0]
    var month = parts[1]
    var year = parts[2]

    // Convert month name to month number
    var monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1

    // Pad day and month with leading zeros if necessary
    day = day.padStart(2, "0")
    monthNumber = monthNumber.toString().padStart(2, "0")

    // Construct the new date string in "YYYY/MM/DD" format
    var newDate = year + "/" + monthNumber + "/" + day

    console.log(newDate) // Output: 2023/06/19
    return newDate
  }
  function handleDatesAddRemove(date, input, dates, setDates) {
    //date is the new date string to be dealt with
    //input is the dom element on which we will append the string
    //setDates
    //Dates
    console.log(date)
    console.log(input)
    console.log(input.value)
    // clean dates get dates

    if (input.value === "") {
      // console.log(date)
      input.value = date
    } else {
      if (input.value.includes(date + ", ")) {
        console.log("delete triggered")
        input.value = input.value.replace(date + ", ", "")
      } else if (input.value.includes(", " + date)) {
        console.log("delete triggered")
        input.value = input.value.replace(", " + date, "")
      } else if (input.value.includes(date)) {
        console.log("delete triggered")
        input.value = input.value.replace(date, "")
      } else {
        console.log("append triggered")
        input.value += ", " + date
      }
      // defaultRemindDates = input.value
      if (active === "remind") {
        setRemindDateStr(input.value)
      } else if (active === "recur") {
        setRecurDateStr(input.value)
      }
    }

    // setDefaultRemindDates(updateRemindDates())

    const dateObject = new Date(date)
    let isPresent = dates.some(function (date) {
      console.log("date")
      console.log(date)
      console.log("dateObject")
      console.log(dateObject)

      return date.toLocaleDateString() === dateObject.toLocaleDateString()
    })
    if (!isPresent) {
      // dates.push(dateObject)
      console.log("doesnt existsss")
      if (active === "remind") {
        setDefaultRemindDates((prevArray) => [...prevArray, dateObject])
        // console.log(remindDates);
      } else {
        setDefaultRecurringDates((prevArray) => [...prevArray, dateObject])
        // console.log(recurDates);
      }
      // console.log('after adding')
      // console.log(dates)
    } else {
      if (active === "remind") {
        let filteredArray = defaultRemindDates.filter(function (date) {
          return date.toLocaleDateString() !== dateObject.toLocaleDateString()
        })
        console.log("filtereddddddddd")
        console.log(filteredArray)
        setDefaultRemindDates(filteredArray)
        // console.log(remindDates);
      } else {
        let filteredArray = defaultRecurringDates.filter(function (date) {
          return date.toLocaleDateString() !== dateObject.toLocaleDateString()
        })
        setDefaultRecurringDates(filteredArray)
        // console.log(recurDates);
      }
    }
  }

  function onModalOpen() {
    document.body.style.overflow = "hidden"
    setTimeout(() => {
      // somewhere here is the solution to tackle the NLP thing
      // get the element, replace with the dates & BAM rest should be similar to
      // add task model, and its pretty much complete
      // so get back to it
      defaultRemindDates
        .map((date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, "0")
          const day = String(date.getDate()).padStart(2, "0")
          return `${year}/${month}/${day}`
        })
        .join(", ")

      const dateString = defaultRemindDates
        .map((date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, "0")
          const day = String(date.getDate()).padStart(2, "0")
          return `${year}/${month}/${day}`
        })
        .join(", ")
      const dateString2 = defaultRecurringDates
        .map((date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, "0")
          const day = String(date.getDate()).padStart(2, "0")
          return `${year}/${month}/${day}`
        })
        .join(", ")

      console.log(dateString)
      console.log(dateString2)

      let remindDatesInput = document.querySelector(".remind-date-picker-input")
      let recurDatesInput = document.querySelector(".recur-date-picker-input")
      remindDatesInput.value = dateString
      recurDatesInput.value = dateString2

      setRemindDateStr(dateString)

      setRecurDateStr(dateString2)

      let modal = document.querySelector(".modal-container")

      modal.onclick = function (event) {
        // console.log(active)
        if (event.target.className === "remind-date-picker-input") {
          active = "remind"
        }
        if (event.target.className === "recur-date-picker-input") {
          active = "recur"
        }

        console.log(active)

        if (
          event.target.className === "sd " ||
          event.target.className === "rmdp-day rmdp-selected"
        ) {
          // a date is selected
          // console.log("date is selected")
          let day = ""
          if (event.target.className === "rmdp-day rmdp-selected") {
            day = event.target.childNodes[0].textContent
          } else {
            // console.log(event.target.textContent) // date
            day = event.target.textContent
          }

          let header = document.querySelector(".rmdp-header-values")
          let month = header.childNodes[0].textContent
          let year = header.childNodes[2].textContent

          let resultDate = convertDateFormat(`${day} ${month} ${year}`)

          let remindDatesInput = document.querySelector(
            ".remind-date-picker-input"
          )
          let recurDatesInput = document.querySelector(
            ".recur-date-picker-input"
          )

          if (active === "remind") {
            handleDatesAddRemove(
              resultDate,
              remindDatesInput,
              defaultRemindDates,
              setDefaultRemindDates
            )
          } else if (active === "recur") {
            handleDatesAddRemove(
              resultDate,
              recurDatesInput,
              defaultRecurringDates,
              setDefaultRecurringDates
            )
          }
        }

        // console.log(event.target.className)
        if (
          event.target.className === "sd " ||
          event.target.className === "remind-date-picker-input" ||
          event.target.className === "nlp-btn" ||
          event.target.className === "rmdp-day rmdp-selected" ||
          event.target.className === "rmdp-arrow-container rmdp-right " ||
          event.target.className === "rmdp-arrow-container rmdp-left " ||
          event.target.className === "rmdp-arrow" ||
          event.target.className === "rmdp-header-values" ||
          event.target.className === "recur-date-picker-input"
        ) {
          // console.log('Calendar or Buttons are hit')
          // setNLP(true)
        } else {
          console.log("rest of the screen si touched")
          setNLP(false)
          setNLP2(false)
        }
        // console.log(event.target);
      }
    }, 250)
  }

  function getDates(date) {
    console.log(date?.map((t) => new Date(t)))
    return date?.map((t) => new Date(t))
  }

  function closeModal() {
    // Restore the scrollbar on the body element
    document.body.style.overflow = "auto"

    let modal = document.querySelector(".modal-container")
    modal.onClick = null
    setPercentageModal(false)
  }

  function stringToArrayDates(datesString) {
    if (!datesString.length) {
      return null
    }
    const datesArray = datesString.split(",").map((date) => {
      const [year, month, day] = date.trim().split("/")
      return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-")
    })
    return datesArray
  }
  function StringToDate(dateString) {
    console.log(dateString);
    const dateParts = dateString.split(" ");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const dateObj = new Date(
      `${monthNames.indexOf(dateParts[1]) + 1}/${parseInt(dateParts[0])}/${dateParts[2]}`
    );
  
    // Extract year, month, and day from the date object
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
  
    const formattedDate = `${year}-${month}-${day}`;
    console.log("formatted", formattedDate); // Output: YYYY-MM-DD
    return formattedDate;
  }
  

  function StringToTime(timeString) {
    const [time, modifier] = timeString.split(" ")
    let [hours, minutes] = time.split(":")
    //console.log(modifier)
    if (hours === "12") {
      hours = modifier === "AM" ? "00" : "12"
    } else {
      hours = modifier === "PM" ? parseInt(hours, 10) + 12 : hours
    }
    hours = hours.toString().padStart(2, "0")
    minutes = minutes.toString().padStart(2, "0")
    //console.log(hours);
    return `${hours}:${minutes}`
  }
  function hexToColorString(hex) {
    console.log(hex)
    if (hex === "#37d67a") {
      return "Green"
    } else if (hex === "#d9e3f0") {
      return "Light Gray"
    } else if (hex === "#f47373") {
      return "Red"
    } else if (hex === "#697689") {
      return "Dark Blue"
    } else if (hex === "#2ccce4") {
      return "Blue"
    } else if (hex === "#555555") {
      return "Dark Gray"
    } else if (hex === "#dce775") {
      return "Yellow"
    } else if (hex === "#ff8a65") {
      return "Orange"
    } else if (hex === "#ba68c8") {
      return "Purple"
    } else if (hex === "#ffffff") return hex
  }

  console.log(media)

  async function SubmitHandler(e) {
    e.preventDefault()
    console.log(title)
    console.log(description)
    console.log(date)
    console.log(time)
    console.log(color)
    console.log(media)
    console.log(remindMe)
    console.log(recurringTask)

    let email = JSON.parse(localStorage.getItem("loggedEmail"))

    let remindDates = document.querySelector(".remind-date-picker-input")
    let recurDates = document.querySelector(".recur-date-picker-input")

    console.log(stringToArrayDates(remindDates.value))
    console.log(stringToArrayDates(recurDates.value))
    let remindDatesList = stringToArrayDates(remindDates.value) || []
    let recurDatesList = stringToArrayDates(recurDates.value) || []
   
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('color', color);
      if (media!=null) {
        console.log("in if",media)
        formData.append('media', media);
      }
      formData.append('remindMe', remindMe);
      formData.append('remindMeDates', JSON.stringify(remindDatesList));
      formData.append('recurringTask', recurringTask);
      formData.append('recurringTaskDates', JSON.stringify(recurDatesList));
      formData.append('id', task.id);

      const response = await axios.patch("http://127.0.0.1:8000/add", formData);
      console.log(response.data)
      if(status){
        if (status === "inprogress") {
          MoveTaskToProgress()
        } else if (status === "complete") {
          MarkTaskAsComplete()
        } else {
          
        }
      }
      // Restore the scrollbar on the body element
      document.body.style.overflow = "auto"
  
      let modal = document.querySelector(".modal-container")
      modal.onClick = null
      setPercentageModal(false)
      if (endsWithNumber(window.location.pathname)) {
        navigate("/tasks")
      } else {
        navigate(0)
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else if (error.response) {
        console.log("Response error:", error.response.data);
      } else if (error.request) {
        console.log("Request error:", error.request);
      } else {
        console.log("Error:", error.message);
      }
    }
  }

  function convertDateToString(dateObject) {
    // Extract month, day, and year values
    var year = dateObject.getFullYear()
    var month = (dateObject.getMonth() + 1).toString().padStart(2, "0") // Adding 1 since months are zero-based
    var day = dateObject.getDate().toString().padStart(2, "0")

    // Format the date in "YYYY/MM/DD" format
    var formattedDate = year + "/" + month + "/" + day
    return formattedDate
  }

  // const handleSave = () => {
  //   if(status){
  //     if (status === "inprogress") {
  //       MoveTaskToProgress()
  //     } else if (status === "complete") {
  //       MarkTaskAsComplete()
  //     } else {
        
  //     }
  //   }else{
  //   }

  // }

  async function MoveTaskToProgress() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/movetoprogress",
        {
          email: email,
          id: task.id,
        }
      )
      console.log(response.data)
      // if (endsWithNumber(window.location.pathname)) {
      //   navigate("/tasks")
      // } else {
      //   navigate(0)
      // }
    } catch (error) {
      console.error(error)
    }
  }
  async function MarkTaskAsComplete() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/markascomplete",
        {
          email: email,
          id: task.id,
        }
      )
      console.log(response.data)
      // if (endsWithNumber(window.location.pathname)) {
      //   navigate("/tasks")
      // } else {
      //   navigate(0)
      // }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={PercentageModal}
        onAfterOpen={() => onModalOpen()}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        // className={'add-modal'}
      >
        {NLP === true ? (
          <div className="nlp-btn-container">
            <button
              className="nlp-btn"
              onClick={() => {
                setRemindMe(true)

                const currentDate = new Date()
                const nextDate = new Date()
                nextDate.setDate(currentDate.getDate() + 1)
                let remindDatesInput = document.querySelector(
                  ".remind-date-picker-input"
                )
                handleDatesAddRemove(
                  convertDateToString(nextDate),
                  remindDatesInput,
                  defaultRemindDates,
                  setDefaultRemindDates
                )
              }}
            >
              1 day
            </button>
            <button
              className="nlp-btn"
              onClick={() => {
                setRemindMe(true)

                const currentDate = new Date()
                const nextDate = new Date()
                nextDate.setDate(currentDate.getDate() + 2)
                let remindDatesInput = document.querySelector(
                  ".remind-date-picker-input"
                )
                handleDatesAddRemove(
                  convertDateToString(nextDate),
                  remindDatesInput,
                  defaultRemindDates,
                  setDefaultRemindDates
                )
              }}
            >
              2 day
            </button>
            {/* <button className="nlp-btn">+</button> */}
          </div>
        ) : null}

        {NLP2 === true ? (
          <div className="nlp2-btn-container">
            <button
              className="nlp-btn"
              onClick={() => {
                setRecurringTask(true)
                const currentDate = new Date()
                const nextDate = new Date()
                nextDate.setDate(currentDate.getDate() + 1)
                let recurDatesInput = document.querySelector(
                  ".recur-date-picker-input"
                )
                handleDatesAddRemove(
                  convertDateToString(nextDate),
                  recurDatesInput,
                  defaultRecurringDates,
                  setDefaultRecurringDates
                )
              }}
            >
              1 day
            </button>
            <button
              className="nlp-btn"
              onClick={() => {
                setRecurringTask(true)
                const currentDate = new Date()
                const nextDate = new Date()
                nextDate.setDate(currentDate.getDate() + 2)
                let recurDatesInput = document.querySelector(
                  ".recur-date-picker-input"
                )
                handleDatesAddRemove(
                  convertDateToString(nextDate),
                  recurDatesInput,
                  defaultRecurringDates,
                  setDefaultRecurringDates
                )
              }}
            >
              2 day
            </button>
            {/* <button className="nlp-btn">+</button> */}
          </div>
        ) : null}

        <div className="modal-container">
          <form className="my-form" onSubmit={SubmitHandler} >
            <div>
              <label> Title </label>
              <input
                onChange={(e) => {
                  console.log(e.target.value)
                  setTitle(e.target.value)
                }}
                value={title}
                type="text"
                name="title"
              />
            </div>
            <div>
              {/* <TextEditor /> */}
              <label> Description </label>
              <input
                onChange={(e) => setDescription(e.target.value)}
                value={description.replace(/<\/?[^>]+>/gi, "")}
                type="text"
                name="description"
              />
              <FontAwesomeIcon
                onClick={() => setEditorState(true)}
                icon={faKeyboard}
                className="keyboard-icon"
              />
              <EditorModal
                description={description}
                setDescription={setDescription}
                editorState={editorState}
                setEditorState={setEditorState}
                closeModal={closeModal}
              />
            </div>
            <div>
              <label> Date </label>
              <input
                onChange={(e) => setDate(e.target.value)}
                value={date}
                type="date"
                name="date"
                
              />
            </div>
            <div>
              <label> Time </label>
              <input
                onChange={(e) => setTime(e.target.value)}
                value={time}
                type="time"
                name="time"
                
              />
            </div>

            <label> Color </label>
            <input
              onClick={() => setColorState(true)}
              value={hexToColorString(color)}
              type="text"
              name="color"
              className="color"
            />
            <ColorPickerModal
              setColor={setColor}
              color={color}
              colorState={colorState}
              setColorState={setColorState}
            />

            <label> Media </label>
            <input
              onChange={(e) => {
                console.log(e.target)
                setMedia(e.target.files[0])
                setImage(URL.createObjectURL(e.target.files[0]))
              }}
              
              type="file"
              name="media"
              className="media"
              alt=""

            />
            {task.image?<div className="imgdiv">
              <img src={image} alt="" className="media-img" />
              {console.log(image)}
            </div>: null}

            <br />

            <label> Remind Me? </label>
            <Toggle
              onChange={() => {
                setRemindMe(!remindMe)
              }}
              checked={remindMe}
              className="remind"
            />
            <div class="empty-div"></div>

            <label className="when-label"> When? </label>
            <input
              // value={reminddateStr}
              onChange={() => {
                // updateRemindDates()
              }}
              onClick={() => {
                setNLP(true)
                setNLP2(false)
                active = "remind"
              }}
              style={{ width: "42.75vw" }}
              className="remind-date-picker-input"
            />
            {NLP === true ? (
              <Calendar
                onChange={() => setRemindMe(true)}
                multiple
                format="YYYY/MM/DD"
                value={updateRemindDates()}
                className="remindCalendar"
              />
            ) : null}
            <br />

            <label className="recurring-task"> Recurring Task? </label>
            <Toggle
              className="recurring"
              onChange={() => {
                setRecurringTask(!recurringTask)
              }}
              checked={recurringTask}
            />
            <div class="empty-div"></div>

            <label className="when-label"> When? </label>
            <input
              // value={recurdateStr}
              onClick={() => {
                setNLP(false)
                setNLP2(true)
                active = "recur"
              }}
              style={{ width: "42.75vw" }}
              className="recur-date-picker-input"
            />
            {NLP2 === true ? (
              <Calendar
                onChange={() => setRecurringTask(true)}
                multiple
                format="YYYY/MM/DD"
                value={updateRecurDates()}
                className="recurCalendar"
              />
            ) : null}
            {/* <DatePicker
              className="my-date-picker"
              multiple
              onChange={() => setRecurringTask(true)}
              value={defaultRecurringDates}
              render={<input style={{width: '42.75vw'}} className="recur-date-picker-input"/>}
            /> */}

            <br />

            <div className="update-task-container">
              <label>Update Task</label>
              <MoveTask onChange={(e) => setStatus(e.target.value)}
                        value={status} />
            </div>

            <div className="btn-row">
              <button className="btn-grad" onClick={closeModal}>
                Close
              </button>
              <button className="btn-grad">Save</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

function MoveTask({ onChange, value }) {
  return (
    <>
    <select name="update-task" onChange={onChange} value={value}>
      <option value="nada">Update Me</option>
      <option value="inprogress">Move to In-Progress</option>
      <option value="complete">Complete</option>
    </select>
  </>
  )
}

export default EditTaskModal
