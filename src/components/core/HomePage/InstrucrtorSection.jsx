import React from "react";
import Intructor from "../../../Assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRightLong } from "react-icons/fa6";
const InstrucrtorSection = () => {
  return (
    <div className="mt-14 w-11/12 mx-auto">
      <div className="flex flex-col-reverse md:flex-row gap-20 items-center ">
        <div className="w-full md:w-[50%]">
          <img
            src={Intructor}
            alt=""
            className="object-contain shadow-white shadow-lg rounded-lg"
          />
        </div>

        <div className="w-full md:w-[50%] flex flex-col gap-10">
          <div className="text-4xl font-semibold w-full md:w-[50%]">
            Become an <HighlightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[16px] w-[80%] text-richblack-300">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

        </div>
      </div>
          <div className="w-fit mt-8 flex ">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex flex-row items-center gap-3">
                Start Learning Today
                <FaArrowRightLong />
              </div>
            </CTAButton>
          </div>
    </div>
  );
};

export default InstrucrtorSection;
