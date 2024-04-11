import Editor from "@monaco-editor/react";
import TabBarCard from "./UI/TabBarCard";
import { FaCode } from "react-icons/fa6";
import { MdOutput } from "react-icons/md";
import { useState, useContext, useEffect, useMemo, useCallback } from "react";
import { ShareNotebookModalContext } from "../context/share-notebook-modal-context";
import { NotebookDataContext } from "../context/notebook-data-context.js";
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
import { LuText } from "react-icons/lu";

import TextEditor from "./TextEditor.jsx";
import { EditorState } from "draft-js";

import convertHTMLToEditorState from "../functions/convertHTMLToEditorState.js";
import { convertToHTML } from "draft-convert";

const NotebookV2 = () => {
  const { notebookId } = useParams();
  const { setOpenShareModal } = useContext(ShareNotebookModalContext);

  const { isOwner } = useContext(NotebookDataContext);
  const user = useMemo(() => {
    return getUser();
  }, []);
  const requestHeaders = useMemo(() => {
    return retrieveAuthHeader();
  }, []);

  const [code, setCode] = useState(null);
  const [title, setTitle] = useState(null);
  const [type, setType] = useState(null);
  const [output, setOutput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const [question, setQuestion] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // const [avatarList, setAvatarList] = useState([]);

  // convert html back to editorState
  const htmlToDraftBlocks = useCallback((html) => {
    return convertHTMLToEditorState(html);
  }, []);

  console.log(convertHTMLToEditorState("<p>Type your question here</p>"));

  // handle code changes
  const handleCodeChange = (value) => {
    console.log(value);
    setCode(value);
    socket.emit("code-changes", value);
  };

  // handle title changes
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    socket.emit("title-changes", e.target.value);
  };

  // handle question changes
  // const handleQuestionChange = (question) => {
  //   setQuestion(question);
  //   if (socket != null) {
  //     socket.emit("question-changes", question);
  //   }
  // };

  // handle form submission
  const handleSubmitCompliation = async () => {
    const payload = {
      // lang: data.type,
      lang: "python",
      sourceCode: code,
      stdin: "",
    };
    console.log(payload);
    try {
      setIsLoading(true);
      await axios
        .post("http://localhost:5001/api/code", payload, {
          headers: requestHeaders,
        })
        .then((result) => {
          // console.log(result);

          const processedOutput = result.data.output.replace("\n", "<br/>");
          setIsLoading(false);
          setOutput(processedOutput);

          console.log(processedOutput);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // initiate socket connection
  useEffect(() => {
    const client = io("http://localhost:5002/");
    setSocket(client);

    console.log("[useEffect] init socket");

    return () => {
      client.disconnect();
    };
  }, []);

  // join room by notebookId
  useEffect(() => {
    console.log("[useEffect] join room");
    if (socket == null) return;

    socket.once("load-notebook", (notebook) => {
      setCode(notebook.code);
      setTitle(notebook.title);
      setType(notebook.type);
      if (isOwner) {
        console.log(notebook.question);
        const htmlState = htmlToDraftBlocks(notebook.question);
        console.log(htmlState);
        setEditorState(htmlState);
      }
      setQuestion(notebook.question);
    });

    socket.emit("get-notebook", { notebookId, requestHeaders });
  }, [socket, notebookId, requestHeaders, isOwner, htmlToDraftBlocks]);

  // recieve code changes
  useEffect(() => {
    console.log("[useEffect] recieve code change");
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
    console.log("[useEffect] recieve title change");
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

  // recieve question changes
  useEffect(() => {
    console.log("[useEffect] recieve question change");
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

  // auto save notebook every 10 seconds
  // useEffect(() => {
  //   console.log("[useEffect] save code change");
  //   if (socket == null) return;

  //   const interval = setInterval(() => {
  //     socket.emit("save-notebook", { code, title, question });
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [socket, code, title, question]);

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
            disabled={!isOwner}
          />
        </div>
        {/* Compile + Share button */}
        <div className="flex gap-x-[1px]">
          <button
            className="text-sm text-white bg-[#222222] hover:bg-gray-600 px-4 py-2 rounded-l-lg flex items-center gap-2"
            onClick={handleSubmitCompliation}
          >
            <MdUploadFile /> Compile
          </button>
          <button
            disabled={!isOwner}
            className="text-sm text-white bg-[#222222] hover:bg-gray-600 px-4 py-2 rounded-r-lg flex items-center gap-2 disabled:cursor-not-allowed"
            onClick={() => {
              setOpenShareModal(true);
            }}
          >
            <IoShareSocial />
            Share
          </button>
        </div>

        {/* Share Button + Language + Avatars */}
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
          {isOwner ? (
            <TextEditor
              editorState={editorState}
              setEditorState={setEditorState}
              // onChange={handleQuestionChange}
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
    </div>
  );
};

export default NotebookV2;
