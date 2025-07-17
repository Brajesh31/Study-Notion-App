import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">

    <div className="">
      {loading ? (
        <span className="loader"></span>
      ) : (
        <div className="max-w-[400px]">
          <h1 className="text-richblack-5 text-3xl font-semibold mb-3">Chose a new password</h1>
          <p className="text-richblack-100 text-lg mb-3">Almost done. Enter your new password and youre all set.</p>

          <form onSubmit={handleOnSubmit}>
            <div className="gap-x-4 flex flex-col gap-4">
              <label className="relative ">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-50">
                  New Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  type={`${showPassword ? "text" : "password"}`}
                  placeholder="Enter Password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 "
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
              <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-50">
                  Confirm New Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  type={`${showConfirmPassword ? "text" : "password"}`}
                  placeholder="confirm password"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 w-full"
            >
              Reset Password
            </button>
          </form>
          <Link to="/login">
            <div className="flex gap-3 mt-4 items-center">
              <FaArrowLeftLong fontSize={20} fill="#AFB2BF" />
              <p className="text-richblack-5">Back to Login</p>
            </div>
          </Link>
        </div>
      )}
    </div>
    </div>
  );
};

export default UpdatePassword;
