import { useContext } from "react";
import SideNav from "../components/SideNav";
import { Outlet } from "react-router";
import LoadingPage from "../pages/LoadingPage";
import Modal from "@mui/material/Modal";
import ModalContainer from "../components/UI/ModalContainer";
import CreateNotebookContent from "../components/CreateNotebookContent";
import DeleteNotebookContent from "../components/DeleteNotebookContent";
// import ShareNotebookContent from "../components/ShareNotebookContent";

import { LoadingContext } from "../context/loading-context";
import { CreateNotebookModalContext } from "../context/create-notebook-modal-context";
import { DeleteNotebookModalContext } from "../context/delete-notebook-modal-context";
// import { ShareNotebookModalContext } from "../context/share-notebook-modal-context";
import { NotebookDataContext } from "../context/notebook-data-context";

const SideNavLayout = () => {
  const { isLoading } = useContext(LoadingContext);
  const { setNotebookData } = useContext(NotebookDataContext);

  const { openNotebookModal, setOpenNotebookModal } = useContext(
    CreateNotebookModalContext
  );

  const { openDeleteModal, setOpenDeleteModal } = useContext(
    DeleteNotebookModalContext
  );

  // const { openShareModal, setOpenShareModal } = useContext(
  //   ShareNotebookModalContext
  // );

  return (
    <div className="w-screen h-screen flex">
      {/* Side Navigational Bar */}
      {!isLoading && <SideNav />}

      {/* Enable vertical scrolling */}
      <div className="overflow-y-auto w-full ">
        <Outlet />
      </div>
      {/* Create Notebook Modal */}
      <Modal
        open={openNotebookModal}
        onClose={() => setOpenNotebookModal(false)}
        className="flex justify-center items-center"
      >
        {/* the empty react shard is used to prevent mui from producing warning */}
        <>
          <ModalContainer
            modalTitle="Create Notebook"
            className="p-8 rounded-lg w-[60%] h-[50%] bg-[#333333]"
          >
            <CreateNotebookContent />
          </ModalContainer>
        </>
      </Modal>

      {/* Delete Notebook Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => {
          console.log("Hello");
          setNotebookData(null);
          setOpenDeleteModal(false);
        }}
        className="flex justify-center items-center"
      >
        {/* the empty react shard is used to prevent mui from producing warning */}
        <>
          <ModalContainer
            modalTitle="Delete Notebook"
            className="p-8 rounded-lg w-[60%] h-[30%] bg-[#333333]"
          >
            <DeleteNotebookContent />
          </ModalContainer>
        </>
      </Modal>

      {/* Share Notebook Modal */}
      {/* <Modal
        open={openShareModal}
        onClose={() => {
          setNotebookData(null);
          setOpenShareModal(false);
        }}
        className="flex justify-center items-center"
      >
        <>
          <ModalContainer
            modalTitle="Share Notebook"
            className="p-8 rounded-lg w-[40%]  bg-[#333333]"
          >
            <ShareNotebookContent />
          </ModalContainer>
        </>
      </Modal> */}

      {/* Display loading screens */}
      {isLoading && <LoadingPage />}
    </div>
  );
};

export default SideNavLayout;
