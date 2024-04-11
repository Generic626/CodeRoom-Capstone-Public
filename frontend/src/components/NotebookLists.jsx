import { MdAccessTime } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { FaRegHandshake } from "react-icons/fa6";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import notebookList from "../data/notebook-data";
import NotebookCard from "./NotebookCard";
import NothingHereCard from "./NothingHereCard";
import { retrieveAuthHeader } from "../functions/user-management";

export const Recent = () => {
  // Step 1. Fetch from api http://localhost:5001/api/notebook/recent and store it in filtered Data
  const [filteredData, setFilteredData] = useState([]);

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
        // Step 2: Set the fetched data to filteredData state variable
        setFilteredData(response.data.slice(0, 4));
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
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
        <div className="w-full h-auto">
          <NothingHereCard
            title="No Notebooks to be found"
            subtitle='Press "+ Create" to create some'
          />
        </div>
      )}

      <div className="flex items-center justify-end">
        <Link to="/main/recent" className="flex items-center">
          <MdOutlineKeyboardDoubleArrowRight className="h-[20px] w-[20px]" />
          <div>Go to Recent</div>
        </Link>
      </div>
    </div>
  );
};

export const YourNotebook = () => {
  // Step 1. Fetch from mongoose where author.email = the user
  // (No need to additionally filter result)
  // const filteredData = notebookList.filter(
  //   (item) => item.author.email === "matttfung@gmail.com"
  // );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const requestHeaders = retrieveAuthHeader();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/notebook/author`,
          {
            headers: requestHeaders,
          }
        );
        // Step 2: Set the fetched data to filteredData state variable
        setFilteredData(response.data.slice(0, 4));
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg py-8 px-6">
      {/* Title */}
      <div className="flex items-center mb-4">
        <IoBookOutline className="mr-2 w-[25px] h-[25px]" />
        <div className="font-bold text-2xl">Your Notebooks</div>
      </div>
      {/* Notebook List */}
      {filteredData.length > 0 ? (
        <div className="w-full flex flex-wrap gap-4 mb-4">
          {filteredData.map((notebook, index) => {
            return <NotebookCard data={notebook} key={index} />;
          })}
        </div>
      ) : (
        <div className="w-full h-auto">
          <NothingHereCard
            title="No Notebooks to be found"
            subtitle='Press "+ Create" to create some'
          />
        </div>
      )}
      <div className="flex items-center justify-end">
        <Link to="/main/your-notebooks" className="flex items-center">
          <MdOutlineKeyboardDoubleArrowRight className="h-[20px] w-[20px]" />
          <div>Go to Your Notebooks</div>
        </Link>
      </div>
    </div>
  );
};

export const SharedWithYou = () => {
  // Step 1. Fetch from mongoose where sharedWith.email = the user
  // (No need to additionally filter result)
  // const filteredData = notebookList.filter(
  //   (item) => item.sharedWith.email === "matttfung@gmail.com"
  // );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const requestHeaders = retrieveAuthHeader();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/notebook/shared`,
          {
            headers: requestHeaders,
          }
        );
        // Step 2: Set the fetched data to filteredData state variable
        setFilteredData(response.data.slice(0, 4));
      } catch (error) {
        // Handle any errors
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full bg-white rounded-lg shadow-lg py-8 px-6">
      {/* Title */}
      <div className="flex items-center mb-4">
        <FaRegHandshake className="mr-2 w-[25px] h-[25px]" />
        <div className="font-bold text-2xl">Shared With You</div>
      </div>
      {/* Notebook List */}
      {filteredData.length > 0 ? (
        <div className="w-full flex flex-wrap gap-4 mb-4">
          {filteredData.map((notebook, index) => {
            return <NotebookCard data={notebook} key={index} />;
          })}
        </div>
      ) : (
        <div className="w-full h-auto">
          <NothingHereCard
            title="No Notebooks to be found"
            subtitle="Go find someone to share you some"
          />
        </div>
      )}

      <div className="flex items-center justify-end">
        <Link to="/main/shared-with-you" className="flex items-center">
          <MdOutlineKeyboardDoubleArrowRight className="h-[20px] w-[20px]" />
          <div>Go to Shared With You</div>
        </Link>
      </div>
    </div>
  );
};
