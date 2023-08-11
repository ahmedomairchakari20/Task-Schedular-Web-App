import Modal from "react-modal"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const customCompletePercentageStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "40vh",
    width: "40vw",
    backgroundColor: "lightgray",
    overflow: "hidden",
    // padding: "3rem 1rem",
  },
}

function ConfirmationModal({ removeAllModal, setRemoveAllModal }) {
  const navigate = useNavigate()

  function closeModal() {
    setRemoveAllModal(false)
  }

  async function removeAllTasks() {
    let email = JSON.parse(localStorage.getItem("loggedEmail"))
    console.log(email)
    try {
      const response = await axios.delete(
        "http://127.0.0.1:8000/markascomplete",
        {
          params: {
            email: email,
          },
        }
      )
      console.log(response.data)
      navigate(0)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Modal
      ariaHideApp={false}
      isOpen={removeAllModal}
      style={customCompletePercentageStyles}
      contentLabel="Example Modal"
      overlayClassName="overlay" // Apply the overlay styles
      onRequestClose={closeModal}
    >
      <div className="confirmation-modal-container">
        <div>
          <h3>Are you sure you want to remove all the tasks?</h3>
        </div>
        <div className="btn-confirmation-container">
          <button onClick={() => removeAllTasks()} className="btn-grad ">
            {" "}
            Yes{" "}
          </button>
          <button onClick={() => closeModal()} className="btn-grad ">
            {" "}
            No{" "}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
