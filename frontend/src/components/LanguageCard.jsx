const LanguageCard = (props) => {
  return (
    <div
      className="rounded-md bg-[#504C4C] w-[250px] h-[150px] p-4 cursor-pointer text-white"
      onClick={props.onClickHandler}
    >
      <img
        src={props.langIcon}
        alt="Language Icon"
        className="h-[30px] w-[30px] mb-4"
      />
      <div>
        <div className="text-sm">{props.langTitle}</div>
        <div className="text-gray-400 text-sm">{props.langDesc}</div>
      </div>
    </div>
  );
};

export default LanguageCard;
