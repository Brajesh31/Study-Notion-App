import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { sendOTP, signup } from "../services/operations/authAPI";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const [otp, setOtp] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    } = signupData;

    console.log("otp",otp);
    dispatch(
      signup(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };
  return (
    <div className="text-white">
      {loading ? (
        <div className="w-screen h-[calc(100vh-3.5rem)] flex justify-center items-center ">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="w-screen min-h-[calc(100vh-3.75rem)] flex flex-col justify-center items-center gap-4">
          <div className="max-w-[500px] p-10 ">
            <div className="flex flex-col gap-3 mb-3">
              <h1 className="text-4xl font-semibold text-richblack-5">
                Verify Email
              </h1>
              <p className="text-richblack-300 text-[16px] font-semibold ">
                A verification code has been sent to you. Enter the code below
              </p>
            </div>

            <form onSubmit={handleOnSubmit} className="text-white">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                inputStyle={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  border: "1px solid #F1F2FF",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  backgroundColor: "#161D29",
                  color: "#FFFFFF",
                }}
                focusStyle={{
                  border: "5px solid #FFF970",
                  // width:"50px"
                }}
                isInputNum={true}
                shouldAutoFocus={true}
                containerStyle="flex justify-between gap-2 text-richblack-5"
                renderInput={(props) => <input {...props} placeholder="-" />}
              />
              <button
                className="w-full py-3 bg-yellow-50 my-5 rounded-md text-richblack-900 text-[16px] font-semibold"
                type="submit"
              >
                Verfify Email
              </button>
            </form>

            <div className="flex justify-between items-center">
              <Link to="/login">
                <div className="flex gap-3 mt-4 items-center">
                  <FaArrowLeftLong fontSize={20} fill="#AFB2BF" />
                  <p className="text-richblack-5">Back to Login</p>
                </div>
              </Link>

              <button
                onClick={() => dispatch(sendOTP(signupData.email))}
                className="flex gap-2 items-center text-blue-100"
              >
                <FaHistory />
                Resend it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
