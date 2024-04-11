import { useEffect, useCallback } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";

const TextEditor = ({ editorState, setEditorState, onChange }) => {
  return (
    <div id="textEditorWrapper" className="overflow-y-auto">
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        editorClassName="px-2 text-white"
      />
    </div>
  );
};

export default TextEditor;
