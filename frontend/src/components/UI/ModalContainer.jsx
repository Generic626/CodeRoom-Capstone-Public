const ModalContainer = (props) => {
  // const { setOpenNotebookModal } = useContext(CreateNotebookModalContext);
  return (
    <div className={props.className}>
      <div className="modal-box flex flex-col h-full">
        <div className="w-full flex justify-between">
          {/* Modal Title */}
          <h3 className="font-bold text-md text-white">{props.modalTitle}</h3>
          {/* Modal Action */}
          {/* <div>
            <button
              className="outline-0 text-white"
              onClick={() => setOpenNotebookModal(false)}
            >
              X
            </button>
          </div> */}
        </div>
        {/* Modal Content */}
        {props.children}
      </div>
    </div>
  );
};

export default ModalContainer;
