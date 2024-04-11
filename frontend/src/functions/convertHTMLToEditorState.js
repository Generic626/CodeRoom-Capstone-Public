import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";

const convertHTMLToEditorState = (html) => {
  // const blocksFromHtml = htmlToDraft(html);
  // const { contentBlocks, entityMap } = blocksFromHtml;
  // const contentState = ContentState.createFromBlockArray(
  //   contentBlocks,
  //   entityMap
  // );
  // const editorState = EditorState.createWithContent(contentState);
  // return editorState;

  const blocksFromHtml = htmlToDraft(html);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  const editorState = EditorState.createWithContent(contentState);
  return editorState;
};

export default convertHTMLToEditorState;
