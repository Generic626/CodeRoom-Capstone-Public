import { IoIosSearch } from "react-icons/io";
import Avatar from "../assets/avatar1.png";
import { Recent, SharedWithYou, YourNotebook } from "./NotebookLists";

const HomeContent = () => {
  return (
    <div className="bg-[#ECECEC] w-full px-10 py-4 ">
      {/* Top Bar */}
      <div className="mb-8 flex items-center">
        {/* Search Bar */}
        <div className="flex items-center rounded-full shadow-md bg-white text-[#857676] px-2 w-full mr-2">
          <IoIosSearch className="inline w-[25px] h-[25px] mr-2" />
          <input
            type="text"
            placeholder="Search for a notebook"
            className="w-full p-2 outline-0 rounded-full"
          />
        </div>
        {/* User Avatar */}
        <img
          src={Avatar}
          alt="User Avatar"
          className="w-[40px] h-[40px] rounded-full cursor-pointer"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 grid-rows-3">
        <Recent />
        <YourNotebook />
        <SharedWithYou />
      </div>
    </div>
  );
};

export default HomeContent;
