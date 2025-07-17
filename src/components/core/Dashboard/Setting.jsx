import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProfileFunction,
  updatePersonalDetails,
  updateProfilePicture,
} from "../../../services/operations/profileAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changepassword } from "../../../services/operations/authAPI";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const profilePic = user.image;
  const { token } = useSelector((state) => state.auth);
  // const token = localStorage.getItem("token");
  const [newProfilePic, setNewProfilePic] = useState(profilePic);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passForm, setPassForm] = useState({
    password: "",
    newPassword: "",
  });
  const [deleteProfile, setDeleteProfile] = useState(false);

  const { password, newPassword } = passForm;
  const handlePasswordChange = (e) => {
    setPassForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileUpload = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    // console.log(token);
    updateProfilePicture(token, file);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    about: "",
  });

  // const {firstName,lastName,dateOfBirth,gender,contactNumber,about} = formData;
  const handelAdditionalDetails = async (e) => {
    e.preventDefault();
    await updatePersonalDetails(token, formData);
  };
  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //Password Updation
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    await changepassword(token, passForm);
  };


  //Delete Profile 
  const [deletePass, setDeletePass] = useState("");
  const [showDelPass, setShowDelPass] = useState(false);
  // const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteProfileHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Deleting you profile...")
    // setLoading(true);
    try {
      await deleteProfileFunction(token,deletePass,navigate,dispatch);
      
    } catch (error) {
      toast.error(error.message);
    }
    // setLoading(false);
    toast.dismiss(toastId)

  };

  return (
     (
    <div>
      <div className=" flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <h1 className="mb-10 text-3xl font-medium text-richblack-5">
            Edit Profile
          </h1>

          {/* update profile */}
          <div className="flex items-center justify-between  rounded-md border-richblack-700 bg-richblack-800 md:p-8  md:px-12 px-3 py-3 text-richblack-5 ">
            <div className="flex items-center gap-x-4">
              <img
                src={newProfilePic}
                alt=""
                className="aspect-square object-cover w-[78px] rounded-full"
              />
              <div className="space-y-2">
                <p>Change Profile picture</p>
                <form onSubmit={handleProfileUpload}>
                  <div className="flex flex-row gap-3">
                    <label
                      className="cursor-pointer rounded-md bg-yellow-50 text-richblack-900 py-2 px-5 font-semibold text-richblack-50'"
                      htmlFor="upload"
                    >
                      Select
                      <input
                        id="upload"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewProfilePic(
                              URL.createObjectURL(e.target.files[0])
                            );
                          }
                        }}
                        className="hidden"
                        accept="image/png, image/gif, image/jpeg"
                      />
                    </label>
                    <button
                      type="submit"
                      className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <form onSubmit={handelAdditionalDetails}>
            <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
              <h2 className="text-lg font-semibold text-richblack-5">
                Profile Information
              </h2>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="firstName" className=" text-richblack-50">
                    First Name
                  </label>
                  <input
                    defaultValue={user.firstName || null}
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter first name"
                    className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    onChange={handleOnChange}
                  />
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="lastName" className="text-richblack-50">
                    Last Name
                  </label>
                  <input
                    defaultValue={user.lastName || null}
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter first name"
                    className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="dateOfBirth" className="text-richblack-50">
                    Date of Birth
                  </label>
                  <input
                    defaultValue={user?.additionalDetails?.dateOfBirth || null}
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    onChange={handleOnChange}
                  />
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="gender" className="text-richblack-50">
                    Gender
                  </label>
                  <select
                    defaultValue={user?.additionalDetails?.gender || null}
                    type="text"
                    name="gender"
                    id="gender"
                    className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    onChange={handleOnChange}
                  >
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="contactNumber" className="text-richblack-50">
                    Contact Number
                  </label>
                  <input
                    defaultValue={user?.additionalDetails?.contactNumber || null}
                    type="tel"
                    name="contactNumber"
                    id="contactNumber"
                    placeholder="Enter Contact Number"
                    className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    onChange={handleOnChange}
                  />
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="about" className="text-richblack-50">
                    About
                  </label>
                  <input
                    defaultValue={user?.additionalDetails?.about || null}
                    type="text"
                    name="about"
                    id="about"
                    placeholder="Enter Bio Details"
                    className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordUpdate}>
            <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
              <h2 className="text-lg font-semibold text-richblack-5">
                Password
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 place-content-center gap-3">
                <div className="flex flex-col gap-2 lg:w-[90%]">
                  <label className="relative">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                      current Password <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                      required
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      type={`${showPassword ? "text" : "password"}`}
                      placeholder="Enter current Password"
                      style={{
                        boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
                      }}
                      className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                      ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                      )}
                    </span>
                  </label>
                </div>
                <div className="flex flex-col gap-2 lg:w-[90%]">
                  <label className="relative">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                      New Password <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                      required
                      name="newPassword"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      type={`${showNewPassword ? "text" : "password"}`}
                      placeholder="Enter New Password"
                      style={{
                        boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
                      }}
                      className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                    >
                      {showNewPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                      ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                      )}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
                type="submit"
              >
                Change Password
              </button>
            </div>
          </form>

          <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-[#400707]  p-8 px-12">
            <div className="flex gap-3">
              <div className="aspect-square w-[60px] bg-[#7d0707] h-fit flex justify-center items-center rounded-full">
                <MdDelete className="text-3xl text-[#ed3434]" />
              </div>

              <div>
                <h2 className="text-richblack-5 font-semibold">
                  Delete Account
                </h2>
                <p className="text-richblack-50">
                  Would you like to delete account?
                </p>
                <p className="text-richblack-50">
                  This account contains Paid Courses. Deleting your account will
                  remove all the contain associated with it.
                </p>

                <p
                  className="text-[#ed3434] cursor-pointer"
                  onClick={() => setDeleteProfile(!deleteProfile)}
                >
                  I want to delete my account.
                </p>

                <div
                  className={`${
                    deleteProfile ? "flex" : "hidden"
                  } transition-all duration-300 flex-col gap-2 lg:w-[90%]`}
                >
                  <form onSubmit={deleteProfileHandler}>

                  <label className="relative">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                      Password <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                      required
                      name="password"
                      value={deletePass}
                      onChange={(e) => setDeletePass(e.target.value)}
                      type={`${showDelPass ? "text" : "password"}`}
                      placeholder="Enter Password"
                      style={{
                        boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
                      }}
                      className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
                    />
                    <span
                      onClick={() => setShowDelPass(!showDelPass)}
                      className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                    >
                      {showDelPass ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                      ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                      )}
                    </span>
                  </label>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
                      // onClick={deleteProfileHandler}
                      type="submit"
                    >
                      Delete Profile
                    </button>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  );
};

export default Setting;
