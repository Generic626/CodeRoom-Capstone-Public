const DividerCard = (props) => {
  const displayStyle = props.mode == "row" ? "flex" : "flex flex-col";
  return (
    <div
      className={`${props.cardHeigh} ${props.cardWidth} ${props.cardBgColor} ${displayStyle} items-center rounded-md shadow-md p-4`}
    >
      {/* Title + Divider */}
      <div className={`${props.mode == "col" ? "w-full mb-4" : ""}`}>
        <div className={`font-bold ${props.mode == "row" ? "mr-4" : ""}`}>
          {props.cardTitle}
        </div>
        {props.mode == "col" && (
          <hr className="mt-2 w-full h-[1px] bg-gray-500" />
        )}
      </div>
      {props.children}
    </div>
  );
};

export default DividerCard;
