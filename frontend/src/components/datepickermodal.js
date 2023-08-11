import Modal from "react-modal"
import { Calendar } from "react-multi-date-picker"
import { useState } from "react"
import "react-tooltip/dist/react-tooltip.css"

// import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"

const customDatePickerStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: 'translate(-41%, -76%)',
    padding: "0",
    borderRadius: '1rem',
    // width: "200px",
    // height: "300px",
    background: "transparent",
  },
}

function DatePickerModal({ datePickerModalState, setDatePickerModalState }) {
  function closeModal() {
    setDatePickerModalState(false)
  }
  const [dates, setDates] = useState([new Date()])

  return (
    <Modal
      ariaHideApp={false}
      isOpen={datePickerModalState}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customDatePickerStyles}
      contentLabel="Example Modal"
    >
      <div>
        <div className="btns">
          <button onClick={() => setDates()}>1 Day</button>
          <button>2 Day</button>
          <button>1 Week</button>
        </div>
        <Calendar 
        value={dates} 
        multiple  />
      </div>
    </Modal>
  )
}

export default DatePickerModal
