import pythonIcon from "../assets/python.png";
import jsIcon from "../assets/js.png";
import { useContext } from "react";
import { DeleteNotebookModalContext } from "../context/delete-notebook-modal-context";
import { NotebookDataContext } from "../context/notebook-data-context";
import axios from "axios";
import { retrieveAuthHeader } from "../functions/user-management";

const DeleteNotebookContent = () => {
  const { setOpenDeleteModal } = useContext(DeleteNotebookModalContext);
  const { notebookData, setNotebookData } = useContext(NotebookDataContext);

  const requestHeaders = retrieveAuthHeader();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/notebook/${notebookData._id}`,
        {
          headers: requestHeaders,
        }
      );
      if (response.status == 200) {
        setNotebookData(null);
        setOpenDeleteModal(false);
        window.location.reload();
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  return (
    <div className="mt-4 gap-3 text-white flex flex-col justify-between h-full">
      <div className="w-full flex flex-col justify-center items-center gap-4">
        {/* Title Text */}
        <div className="text-xl">
          Are you sure you want to delete this notebook?
        </div>
        {/* Notebook Title + Image */}
        <div className="flex items-center gap-2">
          <div>
            {notebookData.type === "javascript" ? (
              <img src={jsIcon} alt="JavaScript Icon" />
            ) : (
              <img src={pythonIcon} alt="Python Icon" />
            )}
          </div>
          <div className="font-bold">{notebookData.title}</div>
        </div>
      </div>
      {/* Button Group */}
      <div className="flex justify-between w-full">
        <button
          className="bg-blue-500 px-4 py-2 rounded"
          onClick={() => {
            console.log("Cancelled Click");
            setNotebookData(null);
            setOpenDeleteModal(false);
          }}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded"
          onClick={() => {
            handleDelete();
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeleteNotebookContent;
