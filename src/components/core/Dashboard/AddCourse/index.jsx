import React from "react";
import RenderSteps from "./RenderSteps";
import { FaBoltLightning } from "react-icons/fa6";
import Instructions from "./Instructions";


const AddCourse = () => {
  return (
    <>
    <div className="mx-auto flex w-11/12 relative">
      <div className="text-white flex flex-col-reverse lg:flex-row gap-10 mx-auto ">
        <div className="w-full bg-richblack-800 rounded-md p-5">
          {/* <h1 className="text-richblack-100 text-lg font-semibold ">Add Course</h1> */}

          <div className="">
            <RenderSteps />
          </div>
        </div>
        {/* <div className=" mx-auto px-5 w-[60%]  bg-richblack-800 py-8 rounded-md h-[500px]">
          <p className="text-lg flex  items-center font-semibold text-richblack-5 gap-1 mb-3"> <span><FaBoltLightning className="text-yellow-50" />
          </span> Code Upload Tips</p>
          <ul className="list-disc pl-5 text-sm text-richblack-100 space-y-3">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div> */}
        <Instructions />
      </div>

    </div>
    </>
  );
};

export default AddCourse;
