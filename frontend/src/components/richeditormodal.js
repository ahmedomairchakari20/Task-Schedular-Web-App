import TextEditor from "./texteditor"
import Modal from "react-modal"

const customEditorStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // height: "50vh",
    // width: "50vw",
    padding: "0",
  },
}
function EditorModal({ editorState, setEditorState, description, setDescription }) {
  function closeModal() {
    setEditorState(false)
  }
  // console.log('value of description is: ' + description)
  return (
    <Modal
      ariaHideApp={false}
      isOpen={editorState}
      onRequestClose={closeModal}
      style={customEditorStyles}
      contentLabel="Example Modal"
      overlayClassName="overlay" // Apply the overlay styles

    >
      <TextEditor description={description} setDescription={setDescription} />
    </Modal>
  )
}

export default EditorModal
