import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import Slider from "@mui/material/Slider"
import { Progress } from "react-sweet-progress"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import Modal from "react-modal"

import "../styles/task.css"
// import CircularProgress from '@mui/joy/CircularProgress';
// import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const customCompletePercentageStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "40vh",
    width: "30vw",
    backgroundColor: 'lightgray',
    overflow: 'hidden'
    // padding: "3rem 1rem",
  },
}

export function ProgressCheck({ color, value, id}) {

  const [pUpdateModal, setPUpdateModal] = useState(false)
  return (
    <>
      <PercentageNumberUpdateModal
        pUpdateModal={pUpdateModal}
        setPUpdateModal={setPUpdateModal}
        percentage={value}
        id={id}
      />

        <div onClick={(e)=>{setPUpdateModal(true)}}>

        {/* <div style={{ width: 150, marginLeft: 550}}> */}
        <CircularProgressbar 
         value={value} text={`${value}%`} 
         styles={buildStyles({
          textColor: "white",
          pathColor: color,
          trailColor: "white"
        })}
         />
        </div>
    </>
  )
}

function PercentageNumberUpdateModal({
  pUpdateModal,
  setPUpdateModal,
  percentage,
  id,
}) {
  const navigate = useNavigate()

  function closeModal() {
    setPUpdateModal(false)
  }

  function updateLocalStorage() {
    //updates the pinned tasks

    let pinnedUpcomingTasks =
      JSON.parse(localStorage.getItem("pinnedInprogressTasks")) || []

    let filteredTasks = pinnedUpcomingTasks.map((task) => {
      if (id === task.id) {
        task["complete_percentage"] = perc
      }
      return task
    }) // gets that task
    console.log(filteredTasks)
    // const replacement = filteredTask[0]["complete_percentage"] = perc

    localStorage.setItem("pinnedInprogressTasks", JSON.stringify(filteredTasks))
  }
  async function updatePercentage() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.patch("http://127.0.0.1:8000/percentage", {
        email: email,
        id: id,
        percentage: perc,
      })
      console.log(response.data)
      updateLocalStorage()
      closeModal()
      navigate(0)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (event, newValue) => {
    setPerc(newValue);
    // Additional logic or actions you want to perform when the value changes
  };

  const [perc, setPerc] = useState(percentage || 0)
  return (
    <Modal
      ariaHideApp={false}
      isOpen={pUpdateModal}
      style={customCompletePercentageStyles}
      contentLabel="Example Modal"
      overlayClassName="overlay" // Apply the overlay styles
      onRequestClose={closeModal}
    >
      <Progress
        percent={perc}
        theme={{
          success: {
            symbol: `${perc}`,
            color: "rgb(223, 105, 180)",
          },
          active: {
            symbol: `${perc}`,
            color: "#69f679",
          },
          default: {
            symbol: `${perc}`,
            color: "#3bd7da",
          },
        }}
      />
      <Slider
        min={0}
        max={100}
        value={perc}
        onChange={handleChange}
      />

      <div className="btn-row-container">
        <button onClick={() => updatePercentage()} className="btn-grad w100">
          {" "}
          Update{" "}
        </button>
        <button onClick={() =>closeModal()} className="btn-grad w100">
          {" "}
          Close{" "}
        </button>
      </div>
    </Modal>
  )
}
