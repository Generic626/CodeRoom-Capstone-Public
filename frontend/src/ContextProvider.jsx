import { useState } from "react";
import { CreateNotebookModalContext } from "./context/create-notebook-modal-context";
import { DeleteNotebookModalContext } from "./context/delete-notebook-modal-context";
import { ShareNotebookModalContext } from "./context/share-notebook-modal-context";
import { SuccessContext } from "./context/success-context";
import { LoadingContext } from "./context/loading-context";
import { NotebookDataContext } from "./context/notebook-data-context";
import { CreateNotebookContext } from "./context/create-notebook-context";
import { SharedNotebookListContext } from "./context/SharedNotebookList";

const ContextProvider = (props) => {
  // Create Notebook Modal
  const [openNotebookModal, setOpenNotebookModal] = useState(false);
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  // Delete Notebook Modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // Sharing Notebook Modal
  const [openShareModal, setOpenShareModal] = useState(false);
  // Sucesss
  const [success, setSuccess] = useState(false);
  // Notebook Data
  const [notebookData, setNotebookData] = useState(null);
  const [isOwner, setIsOwner] = useState(true);
  // Create Notebook Type
  const [notebookType, setNotebookType] = useState(null);

  // Shared Notebook List
  const [sharedNotebookList, setSharedNotebookList] = useState([]);
  return (
    <SharedNotebookListContext.Provider
      value={{ sharedNotebookList, setSharedNotebookList }}
    >
      <CreateNotebookContext.Provider value={{ notebookType, setNotebookType }}>
        <NotebookDataContext.Provider
          value={{ notebookData, setNotebookData, isOwner, setIsOwner }}
        >
          <SuccessContext.Provider value={{ success, setSuccess }}>
            <ShareNotebookModalContext.Provider
              value={{ openShareModal, setOpenShareModal }}
            >
              <DeleteNotebookModalContext.Provider
                value={{
                  openDeleteModal,
                  setOpenDeleteModal,
                }}
              >
                <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                  <CreateNotebookModalContext.Provider
                    value={{ openNotebookModal, setOpenNotebookModal }}
                  >
                    {props.children}
                  </CreateNotebookModalContext.Provider>
                </LoadingContext.Provider>
              </DeleteNotebookModalContext.Provider>
            </ShareNotebookModalContext.Provider>
          </SuccessContext.Provider>
        </NotebookDataContext.Provider>
      </CreateNotebookContext.Provider>
    </SharedNotebookListContext.Provider>
  );
};

export default ContextProvider;
