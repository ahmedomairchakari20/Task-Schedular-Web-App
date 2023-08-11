import Modal from "react-modal"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlassWater, faKeyboard } from "@fortawesome/free-solid-svg-icons"
import {useRef} from 'react'
import EditorModal from "./richeditormodal" // Rich Text Editor Modal
import ColorPickerModal from "./colorpickermodal" // Color Picker Modal
import axios from "axios"
import DatePickerModal from "./datepickermodal"
// import DatePicker from "react-multi-date-picker"
import Toggle from "react-styled-toggle"
import Confirm from "./Confirm"
import { Calendar} from "react-multi-date-picker"

import "../styles/tasks.css"
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

function AddTaskModal({ modalIsOpen, setModalIsOpen }) {
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [confirmed, setConfirmed] = useState(false)

  function closeModal() {
    document.body.style.overflow = "auto";

    let modal = document.querySelector('.modal-container')
    modal.onClick = null
    setModalIsOpen(false)
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

  const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    const handleConfirm = () => {
      onConfirm()
    }

    const handleCancel = () => {
      onCancel()
    }

    return (
      <div>
        <p>{message}</p>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    )
  }

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
    // const media2 = fileInputRef.current.files[0];
    const media2="nknk";
    let email = JSON.parse(localStorage.getItem("loggedEmail"))

    let remindDates = document.querySelector(".remind-date-picker-input")
    let recurDates = document.querySelector(".recur-date-picker-input")

    console.log(stringToArrayDates(remindDates.value))
    console.log(stringToArrayDates(recurDates.value))

    let remindDatesList = stringToArrayDates(remindDates.value) || []
    let recurDatesList = stringToArrayDates(recurDates.value) || []
    const file=media;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("color", color);
    formData.append("media", media); // Assuming `media` is the File object
    formData.append("remindMe", remindMe);
    formData.append("remindMeDates", JSON.stringify(remindDatesList));
    formData.append("recurringTask", recurringTask);
    formData.append("recurringTaskDates", JSON.stringify(recurDatesList));
    formData.append("existing", false);
    formData.append("dayLimit", false);

    try {
      const response = await axios.post("http://127.0.0.1:8000/add", formData);
      console.log(response.data.exist);
      if (response.data.exist != null) {
        const inp = window.confirm(response.data.exist)

        if (inp) {
          const formData2 = new FormData();
          formData2.append("email", email);
          formData2.append("title", title);
          formData2.append("description", description);
          formData2.append("date", date);
          formData2.append("time", time);
          formData2.append("color", color);
          formData2.append("media", media); // Assuming `media` is the File object
          formData2.append("remindMe", remindMe);
          formData2.append("remindMeDates", JSON.stringify(remindDatesList));
          formData2.append("recurringTask", recurringTask);
          formData2.append("recurringTaskDates", JSON.stringify(recurDatesList));
          formData2.append("existing", true);
          formData2.append("dayLimit", false);

          const response2 = await axios.post("http://127.0.0.1:8000/add",formData2)

          console.log(response2.data)
          alert(response2.data.msg)
          navigate(0)
        }
      }
      else if(response.data.limit != null){
        const inp = window.confirm(response.data.limit)

        if (inp) {
          const formData3 = new FormData();
          formData3.append("email", email);
          formData3.append("title", title);
          formData3.append("description", description);
          formData3.append("date", date);
          formData3.append("time", time);
          formData3.append("color", color);
          formData3.append("media", media); // Assuming `media` is the File object
          formData3.append("remindMe", remindMe);
          formData3.append("remindMeDates", JSON.stringify(remindDatesList));
          formData3.append("recurringTask", recurringTask);
          formData3.append("recurringTaskDates", JSON.stringify(recurDatesList));
          formData3.append("existing", true);
          formData3.append("dayLimit", true);

          const response3 = await axios.post("http://127.0.0.1:8000/add", formData3)
          console.log(response3.data);
          alert(response3.data.msg);
          navigate(0);
        }

      } else {
        alert(response.data.msg)
        navigate(0)
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  function hexToColorString(hex) {
    // console.log(hex)
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
    } else if (hex === "#ffffff") {
      return "White"
    }
    return hex
  }
  // console.log(response.data)
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
  function convertDateToString(dateObject){
    // Extract month, day, and year values
    var year = dateObject.getFullYear();
    var month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 since months are zero-based
    var day = dateObject.getDate().toString().padStart(2, "0");
    
    // Format the date in "YYYY/MM/DD" format
    var formattedDate = year + "/" + month + "/" + day;
    return formattedDate
  }
  // function

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [color, setColor] = useState("#ffffff")
  const [media, setMedia] = useState()
  const fileInputRef = useRef(null);
  const [remindMe, setRemindMe] = useState(false)
  const [recurringTask, setRecurringTask] = useState(false)
  const [editorState, setEditorState] = useState(false)
  const [colorState, setColorState] = useState(false)
  let [remindDates, setRemindDates] = useState([])
  let [recurDates, setRecurDates] = useState([])
  const [NLP, setNLP] = useState(false)
  const [NLP2, setNLP2] = useState(false)
  const [shouldCloseCalendar, setShouldCloseCalendar] = useState(false)

  // const [active, setActive] = useState('') //recur || remind

  let active = ""


  function updateRemindDates(){ //
    let remindDates = document.querySelector(".remind-date-picker-input")
    console.log(stringToArrayDates(remindDates.value))
    let remindDatesList = stringToArrayDates(remindDates.value)
    return remindDatesList
  }
  function updateRecurDates(){
    let recurDates = document.querySelector(".recur-date-picker-input")
    console.log(stringToArrayDates(recurDates.value))
    let recurDatesList = stringToArrayDates(recurDates.value)
    return recurDatesList
  }

  function handleDatesAddRemove(date, input, dates, setDates) {
    //date is the new date string to be dealt with
    //input is the dom element on which we will append the string
    //setDates
    //Dates 
    console.log(date)
    // clean dates get dates

    if (input.value === "") {
      // console.log(date)
      input.value = date
    } else {
      if (input.value.includes(date + ", ")) {
        input.value = input.value.replace(date + ", ", "")
      } else if (input.value.includes(', ' + date)) {
        input.value = input.value.replace(', ' + date, "")
      } else if(input.value.includes(date)){
        input.value = input.value.replace(date, "")
      }else {
        input.value += ", " + date
      }
    }

    const dateObject = new Date(date)
    let isPresent = dates.some(function (date) {
      return date.toLocaleDateString() === dateObject.toLocaleDateString()
    })
    if (!isPresent) {
      // dates.push(dateObject)
      if(active=== 'remind'){
        setRemindDates(prevArray => [...prevArray, dateObject]);
        console.log(remindDates);

      }else{
        setRecurDates(prevArray => [...prevArray, dateObject]);
        console.log(recurDates);
      }
      // console.log('after adding')
      // console.log(dates)
    } else {      
      if(active === 'remind'){
        let filteredArray = remindDates.filter(function (date) {
          return date.toLocaleDateString() !== dateObject.toLocaleDateString()
        })
        setRemindDates(filteredArray);
        console.log(remindDates);

      }else{
        let filteredArray = recurDates.filter(function (date) {
          return date.toLocaleDateString() !== dateObject.toLocaleDateString()
        })
        setRecurDates(filteredArray);
        console.log(recurDates);

      }
    }
  }


  function onModalOpen(){
    document.body.style.overflow = "hidden";

    setTimeout(() => {

      // setRemindDateStr(setRemindInput())
      // setRecurDateStr(setRecurInput())
      let modal = document.querySelector('.modal-container')

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
            handleDatesAddRemove(resultDate, remindDatesInput, remindDates, setRemindDates)
          } else if (active === "recur") {
            handleDatesAddRemove(resultDate, recurDatesInput, recurDates, setRecurDates)
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
          console.log('rest of the screen si touched');
          setNLP(false)
          setNLP2(false)
        }
        // console.log(event.target);
      }
    }, 250)
  }
  const handleMediaChange = (e) => {
    console.log(e)
    var file = e.target.files[0];
    setMedia(file);
  };

  
  

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onAfterOpen={()=>onModalOpen()}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
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
                let remindDatesInput = document.querySelector(".remind-date-picker-input" )
                handleDatesAddRemove(convertDateToString(nextDate), remindDatesInput, remindDates, setRemindDates)

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
                let remindDatesInput = document.querySelector(".remind-date-picker-input" )
                handleDatesAddRemove(convertDateToString(nextDate), remindDatesInput, remindDates, setRemindDates)

              }}
            >
              2 day
            </button>
            <button className="nlp-btn">+</button>
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
                let recurDatesInput = document.querySelector(".recur-date-picker-input" )
                handleDatesAddRemove(convertDateToString(nextDate), recurDatesInput, recurDates, setRecurDates)
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
                let recurDatesInput = document.querySelector(".recur-date-picker-input" )
                handleDatesAddRemove(convertDateToString(nextDate), recurDatesInput, recurDates, setRecurDates)
              }}
            >
              2 day
            </button>
            <button className="nlp-btn">+</button>
          </div>
        ) : null}

        <div className="modal-container">
          <form className="my-form" onSubmit={SubmitHandler}>
            <div>
              <label> Title </label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                name="title"
              />
            </div>
            <div>
              {/* <TextEditor /> */}
              <label> Description </label>
              <input 
              onChange={(e)=> setDescription(e.target.value)}
              value={description.replace(/<\/?[^>]+>/gi, '')} 
              type="text" 
              name="description" />
              <FontAwesomeIcon
                onClick={() => setEditorState(true)}
                icon={faKeyboard}
                className="keyboard-icon"
              />
              <EditorModal
                setDescription={setDescription}
                editorState={editorState}
                setEditorState={setEditorState}
                closeModal={closeModal}
                description={description}
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
              // onChange={(e) => setColor(e.target.value)}
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
                handleMediaChange(e)
              }}
              
              type="file"
              name="media"
              className="media"
              alt=""
            />

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
            {/* <input onClick={()=> setDatePickerModalState(true)} className="when-input" type="text" name="when1" /> */}

            <input
              // value={remindDates}
              onChange={()=>{
                // updateRemindDates()
              }}
              onClick={() => {
                setNLP(true)
                setNLP2(false)

                // setActive('remind')
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
            {/* <input
                value={remindDates}
                onClick={() => setNLP(true)}
                style={{ width: "42.75vw" }}
                className="remind-date-picker-input"
              /> */}

            {/* {
              <DatePicker
                onClose={() => shouldCloseCalendar}

                className="my-date-picker"
                multiple
                onChange={() => {
                  setRemindMe(true)
                }}
                render={
                  <input
                    onClick={() => setNLP(true)}
                    style={{ width: "42.75vw" }}
                    className="remind-date-picker-input"
                  />
                }
                value={remindDates}

              />
            } */}

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
              // value={remindDates}
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
              render={
                <input
                  style={{ width: "42.75vw" }}
                  className="recur-date-picker-input"
                />
              }
            /> */}

            <br />

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

export default AddTaskModal
