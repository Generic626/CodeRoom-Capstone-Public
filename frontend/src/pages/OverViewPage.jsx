import { useEffect } from "react";
import { GrCatalogOption } from "react-icons/gr";
import {
  Recent,
  SharedWithYou,
  YourNotebook,
} from "../components/NotebookLists";
import UserAvatar from "../components/UserAvatar";

const OverViewPage = () => {
  useEffect(() => {
    document.title = "Overview"; // Set the desired page title
    return () => {
      document.title = "CodeRoom"; // Reset the title when the component unmounts
    };
  }, []);
  return (
    <div className="bg-[#ECECEC]  px-10 py-4 ml-[70px] w-auto ">
      {/* Top Bar */}
      <div className="mb-8 flex items-center justify-between bg-white rounded-full py-2 px-4">
        {/* Welcome Title */}
        <div className="font-bold text-2xl flex items-center">
          <GrCatalogOption className="mr-4" />
          Overview
        </div>
        {/* User Avatar */}
        <UserAvatar />
      </div>
      {/* Main Content className="grid gap-6 grid-rows-3"*/}
      <div className="flex flex-col justify-between gap-6">
        <Recent />
        <YourNotebook />
        <SharedWithYou />
      </div>
    </div>
  );
};

export default OverViewPage;
