import { BlockPicker } from "react-color"
import Modal from "react-modal"
const customColorPickerStyles = {
  content: {
    top: "70%",
    left: "30%",
    transform: "translate(-35%, -40%)",
    padding: "0",
    width: "170px",
    height: "248px",
    background: "transparent",
    overflow: 'none'
    // zindex:'5'
  },
}
//translate(-35%, -40%)
function ColorPickerModal({ color, setColor, colorState, setColorState }) {
  function closeModal() {
    setColorState(false)
  }

  return (
    <Modal
      ariaHideApp={false}
      isOpen={colorState}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customColorPickerStyles}
      contentLabel="Example Modal"
      overlayClassName="overlay" // Apply the overlay styles

    >
      <BlockPicker
        color={color}
        onChange={(color) => {
          setColor(color.hex)
        }}
      />
    </Modal>
  )
}

export default ColorPickerModal