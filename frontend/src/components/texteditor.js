import React, { useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import draftToHtml from "draftjs-to-html"

export default function TextEditor({ description, setDescription }) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(description !== ''? description + ' ': "<p>&nbsp;</p>")
      )
    )
  )

  return (
    <div>
      <div
        style={{
          border: "1px solid black",
          padding: "2px",
          minHeight: "400px",
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={(e) => {
            setEditorState(e)
            setDescription(
              draftToHtml(convertToRaw(editorState.getCurrentContent()))
            )}}
            wrapperClassName = "wrapperClassName"
            editorClassName = "editorClassName"
            toolbarClassName = "toolbarClassName"
            placeholder = "Enter your text here:"
        />
      </div>
    </div>
  )
}
