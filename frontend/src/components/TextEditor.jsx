import { useEffect, useCallback } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";

const TextEditor = ({ editorState, setEditorState, onChange }) => {
  // const handleQuestionChange = useCallback(
  //   (value) => {
  //     onChange(value);
  //   },
  //   [onChange]
  // );

  // convert html into draft.js editorState
  //   setEditorState(htmlToDraftBlocks(question));

  // convert editorState into html
  // useEffect(() => {
  //   if (editorState != null) {
  //     var state = editorState.getCurrentContent();
  //     console.log(state);
  //     console.log(state);
  //     let html = convertToHTML(state);
  //     handleQuestionChange(html);
  //   }
  // }, [editorState, handleQuestionChange]);

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        editorClassName="px-2 text-white"
      />
    </div>
  );
};

export default TextEditor;
