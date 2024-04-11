import { FaUser } from "react-icons/fa6";
import DividerCard from "../components/UI/DividerCard";
// import Avatar from "../assets/avatar1.png";
import { getUser, retrieveAuthHeader } from "../functions/user-management";
import { useEffect, useState, useRef } from "react";
import { MdOutlinePermMedia } from "react-icons/md";
import axios from "axios";
import { updateName } from "../functions/user-management";

const AccountPage = () => {
  const { name, email } = getUser();

  const fileRef = useRef(null);

  const [user, setUser] = useState({
    avatar: `http://localhost:5001/api/avatar/email/${email}`,
    name,
  });
  const [imgObj, setImgObj] = useState(null);

  const requestHeaders = retrieveAuthHeader();

  useEffect(() => {
    document.title = "Account"; // Set the desired page title
    return () => {
      document.title = "CodeRoom"; // Reset the title when the component unmounts
    };
  }, []);

  const handleImageOnclick = () => {
    fileRef.current.click();
  };

  const handleFileOnchange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImgObj(selectedFile);
      setUser((prev) => {
        return { ...prev, avatar: URL.createObjectURL(e.target.files[0]) };
      });
    }
  };

  const handleNameOnchange = (e) => {
    console.log(e.target.value);
    setUser((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (imgObj != null) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", user.name);
      formData.append("avatar", imgObj);

      try {
        const response = await axios.patch(
          "http://localhost:5001/api/user/",
          formData,
          {
            headers: {
              ...requestHeaders,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        window.location.reload();
      } catch (error) {
        console.log(error.status);
      }
    }
  };
  // console.log(user);
  return (
    <div className="bg-[#ECECEC] ml-[70px] w-auto px-10 py-4 h-full flex flex-col gap-4">
      {/* Page Title */}
      <div>
        {/* Title + Avatar */}
        <div className="flex items-center gap-2">
          <FaUser className="w-[20px] h-[20px]" />
          <div className="font-bold text-[25px]">Account</div>
        </div>
        {/* Subtitle */}
        <div className="text-gray-500 text-base">
          Manage your account setting
        </div>
      </div>
      {/* Profile + Divider */}
      <div className="w-full">
        <div className="font-bold">Profile</div>
        <hr className="w-full h-[2px] bg-gray-300" />
      </div>
      {/* User Profile */}
      <div className="w-full h-full flex gap-2">
        {/* User Avatar */}
        <div className="h-full w-[50%]">
          <DividerCard
            cardHeigh="h-full"
            cardWidth="w-full"
            cardTitle="Change Avatar"
            cardBgColor="bg-[#AFA9A9]"
            mode="col"
          >
            <form
              action=""
              className="h-full w-full flex flex-col items-center"
              encType="multipart/form-data"
              onSubmit={handleFormSubmit}
            >
              <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                {/* Upload user avatar input field */}
                <div
                  className="relative rounded-full h-[50%] w-[50%] cursor-pointer group"
                  onClick={handleImageOnclick}
                >
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="rounded-full h-full w-full object-cover"
                  />
                  <div className="h-full w-full absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-50 bg-black">
                    {/* <span className="text-white">Hello</span> */}
                    <MdOutlinePermMedia className="text-white h-[20%] w-[20%]" />
                    <span className="text-center text-white">
                      Upload new avatar
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  onChange={handleFileOnchange}
                  name="avatar"
                />
                {/* User name input field */}
                <input
                  type="text"
                  value={user.name}
                  className="w-[50%] p-2 rounded"
                  name="name"
                  onChange={handleNameOnchange}
                />
              </div>
              <div className="w-full flex justify-end">
                {/* Upload button */}
                <button className="bg-blue-500 px-4 py-2 rounded text-white">
                  Upload
                </button>
              </div>
            </form>
          </DividerCard>
        </div>
        {/* Email + Reset Password */}
        <div className="h-full w-[50%] flex flex-col gap-2">
          <DividerCard
            cardHeigh="h-[10%]"
            cardWidth="w-full"
            cardTitle="Email"
            cardBgColor="bg-[#AFA9A9]"
            mode="row"
          >
            <div className="w-full">
              <input
                type="text"
                disabled
                value={email}
                className="w-full p-2 rounded"
              />
            </div>
          </DividerCard>
          <DividerCard
            cardHeigh="h-[90%]"
            cardWidth="w-full"
            cardTitle="Reset Password"
            cardBgColor="bg-[#AFA9A9]"
            mode="col"
          >
            <form className="w-full h-full flex flex-col items-center justify-between">
              <div className="w-full flex flex-col gap-4 mt-8">
                <div className="w-full">
                  <label htmlFor="" className="mb-4">
                    New Password
                  </label>
                  <input type="text" value="" className="w-full p-2 rounded" />
                </div>
                <div className="w-full">
                  <label htmlFor="" className="mb-4">
                    Re-confirm Password
                  </label>
                  <input type="text" value="" className="w-full p-2 rounded" />
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button className="bg-blue-500 px-4 py-2 rounded text-white">
                  Reset
                </button>
              </div>
            </form>
          </DividerCard>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
