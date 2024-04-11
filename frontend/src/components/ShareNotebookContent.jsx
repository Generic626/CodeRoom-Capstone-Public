import axios from "axios";
import AutoCompleteChip from "./UI/AutoCompleteChip";
import { useState, useEffect, useContext } from "react";
import { retrieveAuthHeader } from "../functions/user-management";
import { ShareNotebookModalContext } from "../context/share-notebook-modal-context";
import { SharedNotebookListContext } from "../context/SharedNotebookList";
import { useParams } from "react-router";

const ShareNotebookContent = () => {
  // shared notebook list
  const { sharedNotebookList } = useContext(SharedNotebookListContext);

  // modal control state
  const { setOpenShareModal } = useContext(ShareNotebookModalContext);

  // store the all user's email
  const [emailList, setEmailList] = useState([]);

  // stores the user's select email
  // const [selectedEmail, setSelectedEmail] = useState(sharedNotebookList);

  // access params
  const params = useParams();

  // console.log(selectedEmail);
  // console.log(sharedNotebookList);

  // retrieve user's email
  useEffect(() => {
    // retrieve token header for submitting requests
    const requestHeaders = retrieveAuthHeader();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/emails`,
          {
            headers: requestHeaders,
          }
        );
        setEmailList(response.data);
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // handling share button click request
  const handleShareNotebook = async () => {
    // setSharedNotebookList(selectedEmail);

    // retrieve token header for submitting requests
    const requestHeaders = retrieveAuthHeader();
    const id = params.notebookId;
    const payload = {
      // sharedWith: selectedEmail,
      sharedWith: sharedNotebookList,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5001/api/notebook/shared/${id}`,
        payload,
        {
          headers: requestHeaders,
        }
      );
      if (response.status == 200) {
        // close share modal
        setOpenShareModal(false);
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  return (
    <div className="mt-4 gap-3 text-white flex flex-col justify-between h-full">
      {/* <input
        type="text"
        className="shadow-md rounded h-[40px] text-black p-2"
      /> */}
      <AutoCompleteChip
        className="bg-white shadow-md rounded text-black"
        placeholder="Add people to this notebook"
        options={emailList}
        // setState={setSelectedEmail}
        // value={selectedEmail}
      />
      <div className="flex justify-end">
        <button
          className="bg-blue-500 px-4 py-2 rounded"
          onClick={handleShareNotebook}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareNotebookContent;
