import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { loading } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(getPasswordResetToken(email, setEmailSent));
    
      // toast.success()
    } catch (error) {
      
    }
  };
  
  return (
    <div className=" justify-center items-center min-h-[calc(100vh-3.5rem)] grid w-full ">
      {loading ? (
        <span className="loader"></span>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-3xl font-bold mb-3 text-richblack-5">
            {!emailSent ? "Reset your Password" : "Check your email"}
          </h1>
          <p className="text-richblack-100 font-semibold mb-6">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full ">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  type="email"
                  name="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                />
              </label>
            )}
            <button
              type="submit"
              className="w-full mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 "
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
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
  );
};

export default ForgotPassword;
