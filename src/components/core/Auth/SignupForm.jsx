import React, { useState } from "react";
import Tab from "../../common/Tab";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../../services/operations/authAPI";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignupForm = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  const handleOnSubmit = async(e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };

    await dispatch(setSignupData(signupData));
    await dispatch(sendOTP(formData.email, navigate));
  };

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4 ">
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              type="text"
              placeholder="Enter First Name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              type="text"
              placeholder="Enter Last Name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
        </div>
        <label>
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            name="email"
            value={email}
            onChange={handleOnChange}
            type="email"
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Password <sup className="text-pink-200">*</sup>
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
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            <span onClick={()=> setShowPassword( !showPassword)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                {
                    showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )
                }

            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
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
            <span onClick={()=> setShowConfirmPassword( !showConfirmPassword)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                {
                    showConfirmPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )
                }

            </span>
          </label>
        </div>
        <button type="submit" className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
