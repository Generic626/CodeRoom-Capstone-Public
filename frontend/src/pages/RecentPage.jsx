import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Avatar from "../assets/avatar1.png";
import notebookList from "../data/notebook-data";
import NotebookCard from "../components/NotebookCard";
import { MdAccessTime } from "react-icons/md";
import NothingHereCard from "../components/NothingHereCard";
import UserAvatar from "../components/UserAvatar";
import axios from "axios";
import { getUser, retrieveAuthHeader } from "../functions/user-management";

const RecentPage = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    document.title = "Recent"; // Set the desired page title
    return () => {
      document.title = "CodeRoom"; // Reset the title when the component unmounts
    };
  }, []);

  // initial get
  useEffect(() => {
    const requestHeaders = retrieveAuthHeader();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/notebook/recent`,
          {
            headers: requestHeaders,
          }
        );
        // adding all results to the initial originalData and filteredData
        setOriginalData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        // handle any errors
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // change when the search keyword is changed
  useEffect(() => {
    const filteredArray = originalData.filter((notebook) =>
      notebook.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredData(filteredArray);
  }, [keyword, originalData]);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  // const filteredData = notebookList
  //   .sort((a, b) => new Date(b.lastOpenAt) - new Date(a.lastOpenAt))
  //   .slice(0, 4);

  return (
    <div className="bg-[#ECECEC] ml-[70px] w-auto px-10 py-4 h-full">
      {/* Top Bar */}
      <div className="mb-8 flex items-center">
        {/* Search Bar */}
        <div className="flex items-center rounded-full shadow-md bg-white text-[#857676] px-2 w-full mr-2">
          <IoIosSearch className="inline w-[25px] h-[25px] mr-2" />
          <input
            type="text"
            placeholder="Search for a notebook"
            className="w-full p-2 outline-0 rounded-full"
            value={keyword}
            onChange={handleKeywordChange}
          />
        </div>
        {/* User Avatar */}
        {/* <img
          src={Avatar}
          alt="User Avatar"
          className="w-[40px] h-[40px] rounded-full cursor-pointer"
        /> */}
        <UserAvatar />
      </div>
      {/* Recent Page Content */}
      <div className="w-full bg-white rounded-lg shadow-lg py-8 px-6">
        {/* Title */}
        <div className="flex items-center mb-4">
          <MdAccessTime className="mr-2 w-[25px] h-[25px]" />
          <div className="font-bold text-2xl">Recent</div>
        </div>
        {/* Notebook List */}
        {filteredData.length > 0 ? (
          <div className="w-full flex flex-wrap gap-4 mb-4">
            {filteredData.map((notebook, index) => {
              return <NotebookCard data={notebook} key={index} />;
            })}
          </div>
        ) : (
          <div className="w-full">
            <NothingHereCard
              title="No Notebooks to be found"
              subtitle='Press "+ Create" to create some'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPage;
