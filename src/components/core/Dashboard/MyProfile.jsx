import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "../../common/IconButton";
import { FaRegEdit } from "react-icons/fa";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="text-white w-full px-10 flex flex-col gap-5">
      <h1 className="text-4xl font font-semibold ">My Profile</h1>

      {/* section 1 */}
      <div className=" w-full flex justify-between px-10 bg-richblack-800 rounded-md items-center">
        <div className="flex  items-center gap-5 py-4">
          <img
            src={`${user.image}`}
            alt={`${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-3">
            <p>{user?.firstName + " " + user?.lastName}</p>
            <p className="text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconButton
            text="Edit"
            
            customClasses="w-[100px] h-[50px] bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300"
            onclick={() => {
              navigate("/dashboard/setting");
            }}
          >
            <FaRegEdit className="text-lg"/>
          </IconButton>
      </div>

      {/* section 2 */}
      <div className=" w-full flex justify-between px-10 bg-richblack-800 rounded-md py-4">
        <div className="flex flex-col gap-3">
          <p className="text-2xl">About</p>
          <p className="text-richblack-300">
            {user?.additionalDetails?.about ?? "Write something about yourself"}
          </p>
        </div>
        <IconButton
            text="Edit"
            
            customClasses="w-[100px] h-[50px] bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300"
            onclick={() => {
              navigate("/dashboard/setting");
            }}
          >
            <FaRegEdit className="text-lg"/>
          </IconButton>
      </div>

      {/* section 3 */}
      <div className=" w-full flex flex-col justify-between px-10 bg-richblack-800 rounded-md py-4 gap-8">
        <div className="flex w-full justify-between">
          <p>Personal Details</p>
          <IconButton
            text="Edit"
            
            customClasses="w-[100px] h-[50px] bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300"
            onclick={() => {
              navigate("/dashboard/setting");
            }}
          >
            <FaRegEdit className="text-lg"/>
          </IconButton>
        </div>

        <div className="grid w-[90%] grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <p className="text-richblack-300">First Name</p>
            <p className="">{user?.firstName}</p>
          </div>
          <div>
            <p className="text-richblack-300">Last Name</p>
            <p>{user?.lastName}</p>
          </div>
          <div>
            <p className="text-richblack-300">Email</p>
            <p>{user?.email}</p>
          </div>
          <div>
            <p className="text-richblack-300">Gender</p>
            <p>{user?.additionalDetails?.gender ?? "Not Specified"}</p>
          </div>
          <div>
            <p className="text-richblack-300">Phone number</p>
            <p>
              {user?.additionalDetails?.contactNumber ?? "Add contact Number"}
            </p>
          </div>
          <div>
            <p className="text-richblack-300">Date of Birth</p>
            <p>{user?.additionalDetails?.dateOfBirth ?? "Add your dob"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
