import pythonIcon from "../assets/python.png";
import jsIcon from "../assets/js.png";
import { FaRegTrashAlt } from "react-icons/fa";
import { useContext } from "react";
import { DeleteNotebookModalContext } from "../context/delete-notebook-modal-context";
import { NotebookDataContext } from "../context/notebook-data-context";
import { CreateNotebookContext } from "../context/create-notebook-context";
import convertDateTime from "../functions/convertDateTime";
import { useNavigate } from "react-router";
import { getUser } from "../functions/user-management";

const NotebookCard = ({ data }) => {
  const navigate = useNavigate();
  const code_lang_icon = data.type === "python" ? pythonIcon : jsIcon;

  const { setOpenDeleteModal } = useContext(DeleteNotebookModalContext);

  const { setNotebookData, setIsOwner } = useContext(NotebookDataContext);

  const { setNotebookType } = useContext(CreateNotebookContext);

  const handleDeleteButtonClick = (e) => {
    e.stopPropagation();
    setNotebookData(data);
    setOpenDeleteModal(true);
  };

  const handleNotebookCardClick = () => {
    const user = getUser();
    data.author.email == user.email ? setIsOwner(true) : setIsOwner(false);
    setNotebookType(data.type);
    navigate(`/main/notebook/${data._id}`);
  };

  const convertedDateTime = convertDateTime(data.lastOpenAt);

  const isOwner = data.author.email == getUser().email;

  return (
    <div
      className="w-[290px] rounded-lg bg-[#504C4C] h-[180px]  p-4 text-white flex flex-col justify-between cursor-pointer"
      onClick={handleNotebookCardClick}
    >
      {/* Card Title */}
      <div className="flex items-center justify-between">
        <div className="flex">
          {/* Language Icon + Notebook Title */}
          <img src={code_lang_icon} alt="Code Lang Icon" className="mr-2" />
          <div>
            {data.title.length < 20
              ? data.title
              : data.title.substring(0, 20) + "..."}
          </div>
        </div>
        {/* Trashcan Button */}
        <button onClick={handleDeleteButtonClick} disabled={!isOwner}>
          {isOwner && (
            <FaRegTrashAlt className={`text-red-500 cursor-pointer m-4`} />
          )}
        </button>
      </div>

      {/* Author + Last Open At*/}
      <div>
        {/* Author */}
        <div className="flex items-center">
          <img
            src={`http://localhost:5001/api/avatar/email/${data.author.email}`}
            alt="Author's Avatar"
            className="rounded-full w-[30px] h-[30px] mr-2"
          />
          <div>{data.author.email}</div>
        </div>
        {/* Open At */}
        <div>{convertedDateTime}</div>
      </div>
    </div>
  );
};

export default NotebookCard;
