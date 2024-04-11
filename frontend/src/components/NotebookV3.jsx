import Editor from "@monaco-editor/react";
import TabBarCard from "./UI/TabBarCard";
import { FaCode } from "react-icons/fa6";
import { MdOutput } from "react-icons/md";
import {
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { ShareNotebookModalContext } from "../context/share-notebook-modal-context";
import { CreateNotebookContext } from "../context/create-notebook-context.js";
import { NotebookDataContext } from "../context/notebook-data-context.js";
import { SharedNotebookListContext } from "../context/SharedNotebookList.js";
import { IoShareSocial } from "react-icons/io5";
import { MdUploadFile } from "react-icons/md";
import pythonIcon from "../assets/python.png";
import jsIcon from "../assets/js.png";
import { getUser, retrieveAuthHeader } from "../functions/user-management.js";
import axios from "axios";
import BrandLoading from "./BrandLoading.jsx";
import brandLogo from "../assets/brand-logo.png";
import parse from "html-react-parser";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { MdOutlineTerminal } from "react-icons/md";
import { Alert, Modal } from "@mui/material";
import ModalContainer from "./UI/ModalContainer.jsx";
import ShareNotebookContent from "./ShareNotebookContent.jsx";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EditorState } from "draft-js";
import convertHTMLToEditorState from "../functions/convertHTMLToEditorState.js";
import { LuText } from "react-icons/lu";
import TextEditor from "./TextEditor.jsx";
import { convertToHTML } from "draft-convert";

const Notebook = () => {
  const navigate = useNavigate();
  const { notebookId } = useParams();
  const { openShareModal, setOpenShareModal } = useContext(
    ShareNotebookModalContext
  );
  const { isOwner, setNotebookData } = useContext(NotebookDataContext);
  const { notebookType } = useContext(CreateNotebookContext);

  const { sharedNotebookList, setSharedNotebookList } = useContext(
    SharedNotebookListContext
  );

  const user = useMemo(() => {
    return getUser();
  }, []);
  const requestHeaders = useMemo(() => {
    return retrieveAuthHeader();
  }, []);

  const [code, setCode] = useState(null);
  const [title, setTitle] = useState(null);
  const [type, setType] = useState(notebookType);
  const [output, setOutput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState({ isError: false, errorText: "" });
  const [success, setSuccess] = useState({ isSuccess: false, successText: "" });
  const [question, setQuestion] = useState("");
  const [cloned, setCloned] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // const [sharedList, setSharedList] = useState(sharedNotebookList);

  const htmlToDraftBlocks = useCallback((html) => {
    return convertHTMLToEditorState(html);
  }, []);

  const readOnlyRef = useRef();
  // const [avatarList, setAvatarList] = useState([]);

  // handle code changes
  const handleCodeChange = (value) => {
    // console.log(value);
    setCode(value);
    socket.emit("code-changes", value);
  };

  // handle title changes
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    socket.emit("title-changes", e.target.value);
  };

  // handle when read only onClick
  const handleReadOnlyClick = () => {
    if (!isOwner) {
      return;
    }
    readOnlyRef.current.checked = !readOnlyRef.current.checked;
    setReadOnly(readOnlyRef.current.checked);
    socket.emit("readonly-changes", readOnlyRef.current.checked);
  };

  // handle when clone onClick
  const handleCloneClick = async () => {
    const payload = { email: user.email };
    await await axios
      .post(`http://localhost:5001/api/notebook/clone/${notebookId}`, payload, {
        headers: requestHeaders,
      })
      .then(() => {
        setSuccess({
          successText: "Clone succeeded",
          isSuccess: true,
        });
      });
  };

  // handle form submission
  const handleSubmitCompliation = async () => {
    const payload = {
      // lang: data.type,
      lang: type,
      sourceCode: code,
      stdin: "",
    };
    // console.log(payload);
    try {
      setIsLoading(true);
      await axios
        // "http://localhost:5001/api/code"
        .post("http://localhost:5001/api/code/v2", payload, {
          headers: requestHeaders,
        })
        .then((result) => {
          // console.log(result);

          const processedOutput = result.data.output.replace("\n", "<br/>");
          setIsLoading(false);
          setOutput(processedOutput);

          // console.log(processedOutput);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // initiate socket connection
  useEffect(() => {
    const client = io("http://localhost:5002/");
    setSocket(client);

    // console.log("[useEffect] init socket");

    return () => {
      client.disconnect();
    };
  }, []);

  // join room by notebookId
  useEffect(() => {
    // console.log("[useEffect] join room");
    if (socket == null) return;

    socket.once("load-notebook", (notebook) => {
      // console.log("Load");
      // console.log(notebook);

      setType(notebook.type);
      setCode(notebook.code);
      setTitle(notebook.title);
      setReadOnly(notebook.readOnly);
      setCloned(notebook.cloned);
      const emailList =
        notebook.sharedWith.length > 0
          ? notebook.sharedWith.map((user) => user.email)
          : [];
      // setSharedList(emailList);
      setSharedNotebookList(emailList);
      if (isOwner) {
        // console.log(notebook.question);
        const htmlState = htmlToDraftBlocks(notebook.question);
        // console.log(htmlState);
        setEditorState(htmlState);
      }
      setQuestion(notebook.question);
    });

    socket.emit("get-notebook", { notebookId, requestHeaders });
  }, [
    socket,
    notebookId,
    requestHeaders,
    setSharedNotebookList,
    htmlToDraftBlocks,
    isOwner,
  ]);

  // recieve code changes
  useEffect(() => {
    // console.log("[useEffect] recieve code change");
    if (socket == null) return;
    // onReceieve changes from socket

    const handler = (value) => {
      setCode(value);
    };
    socket.on("receive-code-changes", handler);

    return () => {
      socket.off("receive-code-changes", handler);
    };
  }, [socket]);

  // recieve title changes
  useEffect(() => {
    // console.log("[useEffect] recieve title change");
    if (socket == null) return;
    // onReceieve changes from socket

    const handler = (value) => {
      setTitle(value);
    };
    socket.on("receive-title-changes", handler);

    return () => {
      socket.off("receive-title-changes", handler);
    };
  }, [socket]);

  // recieve readonly changes
  useEffect(() => {
    // console.log("[useEffect] recieve readonly change");
    if (socket == null) return;
    // onReceieve changes from socket

    const handler = (value) => {
      setReadOnly(value);
    };
    socket.on("receive-readonly-changes", handler);

    return () => {
      socket.off("receive-readonly-changes", handler);
    };
  }, [socket]);

  // recieve question changes
  useEffect(() => {
    // console.log("[useEffect] recieve question change");
    if (socket == null) return;
    // onReceieve changes from socket

    const handler = (value) => {
      if (!isOwner) {
        setQuestion(value);
      }
    };
    socket.on("receive-question-changes", handler);

    return () => {
      socket.off("receive-question-changes", handler);
    };
  }, [socket, isOwner]);

  // convert editorState to HTMK
  useEffect(() => {
    if (editorState != null) {
      var state = editorState.getCurrentContent();
      let html = convertToHTML(state);

      setQuestion(html);
      if (socket != null) {
        socket.emit("question-changes", html);
      }
    }
  }, [editorState, socket]);

  // auto save notebook every 5 seconds
  useEffect(() => {
    // console.log("[useEffect] save code change");
    if (socket == null) return;
    const interval = setInterval(() => {
      socket.emit("save-notebook", { code, title, question, readOnly });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, code, title, question, readOnly]);

  return (
    <div className="h-screen bg-[#333333] px-2 py-2 flex flex-col ml-[70px] w-auto">
      {/* Top Bar */}
      <div className="h-[40px] flex items-center justify-between mb-2">
        {/* Title Input */}
        <div className="flex items-center ">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter a title here"
            className=" w-[300px] outline-0 text-sm font-bold text-white bg-inherit hover:bg-gray-600 rounded-lg p-2"
            onChange={handleTitleChange}
            value={title}
            disabled={!isOwner || (isOwner && cloned)}
          />
        </div>

        {/* Button Group button */}
        <div className="flex gap-x-[1px]">
          {/* Run and execute */}
          <button
            className="text-sm text-white bg-[#222222] hover:bg-gray-600 px-4 py-2 rounded-l-lg flex items-center gap-2"
            onClick={handleSubmitCompliation}
          >
            <MdUploadFile /> Run
          </button>
          {/* Share */}
          {isOwner && !cloned && (
            <button
              className="text-sm text-white bg-[#222222] hover:bg-gray-600 px-4 py-2 flex items-center gap-2 disabled:cursor-not-allowed"
              onClick={() => {
                setOpenShareModal(true);
              }}
            >
              <IoShareSocial />
              Share
            </button>
          )}

          {/* Clone */}
          {!isOwner && !cloned && (
            <button
              // disabled={!isOwner}
              className="text-sm text-white bg-[#222222] hover:bg-gray-600 px-4 py-2 flex items-center gap-2 disabled:cursor-not-allowed"
              onClick={handleCloneClick}
            >
              <MdOutlineTerminal />
              Clone
            </button>
          )}

          {/* Toggle read only */}
          <div
            className={`text-sm text-white bg-[#222222] hover:bg-gray-600 px-4 py-2 rounded-r-lg flex items-center gap-2 ${
              isOwner ? "cursor-pointer" : "cursor-not-allowed"
            } `}
            onClick={handleReadOnlyClick}
          >
            <input
              checked={readOnly}
              type="checkbox"
              disabled={!isOwner}
              name="readOnly"
              ref={readOnlyRef}
              className={`${
                isOwner ? "cursor-pointer" : "cursor-not-allowed"
              } `}
            />
            <label
              htmlFor="readOnly"
              className={`${
                isOwner ? "cursor-pointer" : "cursor-not-allowed"
              } `}
            >
              Read Only
            </label>
          </div>
        </div>

        {/* Language + Avatars */}
        <div className="flex items-center">
          {/* Language + Avatars */}
          <img
            src={type == "python" ? pythonIcon : jsIcon}
            // src={pythonIcon}
            alt="Language Type Icon"
            className="mr-4"
          />
          <img
            src={`http://localhost:5001/api/avatar/email/${user.email}`}
            alt="User's Avatar"
            className="rounded-full w-[30px] h-[30px]"
          />
        </div>
      </div>

      {/* Text Editor + Code Editor + Output */}
      <div className="flex gap-[6px] h-full items-center">
        {/* Text Editor */}
        <TabBarCard
          height="h-full"
          tabBarTitle={
            <div className="flex items-center gap-2">
              <LuText />
              Question
            </div>
          }
          cardBgColor={`${isOwner ? "bg-[#222222]" : "bg-[#222222]"}`}
          tabBgColor="bg-[#444444]"
          tabTitleColor="text-white"
        >
          {isOwner && !cloned ? (
            <TextEditor
              editorState={editorState}
              setEditorState={setEditorState}
            />
          ) : (
            <div className="text-white px-4">{parse(question)}</div>
          )}
        </TabBarCard>
        <TabBarCard
          height="h-full"
          tabBarTitle={
            <div className="flex items-center gap-2 ">
              <FaCode />
              Code
            </div>
          }
          cardBgColor="bg-[#222222]"
          tabBgColor="bg-[#444444]"
          tabTitleColor="text-white"
        >
          <Editor
            height="95%"
            // defaultLanguage={data.type}
            defaultLanguage={type}
            theme="vs-dark"
            options={{
              scrollBeyondLastLine: false,
              fontSize: "16px",
              readOnly: isOwner ? false : readOnly,
            }}
            onChange={handleCodeChange}
            value={code}
          />
        </TabBarCard>
        {/* Output */}
        <TabBarCard
          height="h-full"
          tabBarTitle={
            <div className="flex items-center gap-2">
              <MdOutput />
              Output
            </div>
          }
          cardBgColor="bg-[#222222]"
          tabBgColor="bg-[#444444]"
          tabTitleColor="text-white"
        >
          {output != null && isLoading == false && (
            <div className="h-[95%] text-white pl-4 font-consolas">
              {parse(output)}
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col justify-center items-center text-white h-[95%]">
              <BrandLoading
                brandLogo={brandLogo}
                imgAlt="Loading Logo"
                imgClassName="w-[60px] h-[70px] mb-4"
                circularColor="inherit"
              />
            </div>
          )}
        </TabBarCard>
      </div>

      {/* Share Notebook Modal */}
      <Modal
        open={openShareModal}
        onClose={() => {
          setNotebookData(null);
          setOpenShareModal(false);
        }}
        className="flex justify-center items-center"
      >
        {/* the empty react shard is used to prevent mui from producing warning */}
        <>
          <ModalContainer
            modalTitle="Share Notebook"
            className="p-8 rounded-lg w-[40%]  bg-[#333333]"
          >
            <ShareNotebookContent />
          </ModalContainer>
        </>
      </Modal>

      {/* Snackbar for error */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={error.isError}
        autoHideDuration={6000}
        onClose={() => {
          setError({ errorText: "", isError: false });
        }}
      >
        <Alert
          onClose={() => {
            setError({ errorText: "", isError: false });
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error.errorText}
        </Alert>
      </Snackbar>

      {/* Snackbar for sucess */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={success.isSuccess}
        autoHideDuration={6000}
        onClose={() => {
          setError({ successText: "", isSuccess: false });
        }}
      >
        <Alert
          onClose={() => {
            setError({ successText: "", isSuccess: false });
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success.successText}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Notebook;
