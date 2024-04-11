const TabBarCard = (props) => {
  return (
    <div
      className={`${props.height} w-[50%] ${props.cardBgColor} rounded-md max-h-full`}
    >
      {/* Tab Bar */}
      <div
        className={`w-full h-[40px] ${props.tabBgColor} rounded-t-md ${props.tabTitleColor} flex items-center px-2`}
      >
        {props.tabBarTitle}
      </div>
      {/* Content */}
      {props.children}
    </div>
  );
};

export default TabBarCard;
