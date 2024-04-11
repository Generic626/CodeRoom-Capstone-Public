import axios from "axios";
import LanguageCard from "./LanguageCard";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { LoadingContext } from "../context/loading-context";
import { CreateNotebookModalContext } from "../context/create-notebook-modal-context";
import { CreateNotebookContext } from "../context/create-notebook-context";
import { retrieveAuthHeader } from "../functions/user-management";
import pythonIcon from "../assets/python.png";
import jsIcon from "../assets/js.png";
import { NotebookDataContext } from "../context/notebook-data-context";

const CreateNotebookContent = () => {
  const navigate = useNavigate();
  const requestHeaders = retrieveAuthHeader();

  const { setIsLoading } = useContext(LoadingContext);
  const { setNotebookType } = useContext(CreateNotebookContext);

  const { setOpenNotebookModal } = useContext(CreateNotebookModalContext);

  const { setIsOwner } = useContext(NotebookDataContext);

  const handleOnClick = async (lang) => {
    // 1. set is loading as true, which would render the loading modal
    setIsLoading(true);
    setNotebookType(lang);

    // { notebookData, setNotebookData, isOwner, setIsOwner }

    setIsOwner(true);

    const input = {
      lang,
    };

    console.log("Handle On Click");
    // 2. pass lang along the request to the backend server

    console.log(requestHeaders);
    await axios
      .post("http://localhost:5001/api/notebook", input, {
        headers: requestHeaders,
      })
      .then((result) => {
        console.log("Result Receieved");
        // 3. redirect the user to the notebook page with the created notebook id
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/main/notebook/${result.data.id}`);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-4 gap-3 flex">
      <LanguageCard
        langTitle="Python"
        langIcon={pythonIcon}
        langDesc="General purpose"
        type="python"
        onClickHandler={() => {
          setOpenNotebookModal(false);
          handleOnClick("python");
        }}
      />
      {/* <UnderMaintenance> */}
      <LanguageCard
        langTitle="JavaScript"
        langIcon={jsIcon}
        langDesc="Web Development"
        type="javascript"
        onClickHandler={() => {
          setOpenNotebookModal(false);
          handleOnClick("javascript");
        }}
      />
      {/* </UnderMaintenance> */}
    </div>
  );
};

export default CreateNotebookContent;
