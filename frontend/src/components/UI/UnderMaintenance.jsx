import React from "react";

const UnderMaintenance = (props) => {
  return (
    <div className="relative cursor-not-allowed">
      {props.children}
      <div className="bg-black opacity-50 inset-0 w-full h-full absolute rounded-md text-white"></div>
      <div className=" w-full h-full inset-0 absolute rounded-md text-white flex justify-center items-center font-bold">
        Under Maintenance
      </div>
    </div>
  );
};

export default UnderMaintenance;
