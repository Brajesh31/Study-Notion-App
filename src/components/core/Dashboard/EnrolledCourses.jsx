import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import {  useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const [loading, setloading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate();
  const getEnrolledCourses = async () => {
    setloading(true);
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to fetch enrolled courses");
    }
    setloading(false);
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);


  return (
    <div className="text-white bg-gray-900 min-h-[100vh-3.5rem] z-[999]">
      <p className="w-11/12 mx-auto">Home / Dashboard / <span className="text-sm text-yellow-100 mb-5">Enrolled Courses</span></p>
  <div className="text-2xl font-semibold mb-6 w-11/12 mx-auto">Enrolled Courses</div>
  {!enrolledCourses ? (
    <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="loader"></div>
    </div>
  ) : !enrolledCourses.length ? (
    <p className="text-center text-lg text-gray-400">
      You have not enrolled in any courses.
    </p>
  ) : (

    <div className="flex flex-col gap-3 w-11/12 mx-auto border border-richblack-600 rounded-md">
      <div className="flex justify-between w-full border-b border-gray-700 bg-richblack-600 px-2 py-2 rounded-md pb-2 text-gray-400 text-sm">
        <p className="w-1/2">Course Name</p>
        <p className="w-1/4 text-center">Duration</p>
        <p className="w-1/4 text-right">Progress</p>
      </div>

      {enrolledCourses.map((course, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border-b border-b-richblack-600"
          onClick={() => {
            navigate(`/view-course/course/${course._id}/section/${course.courseContent?.[0]?._id}/subSection/${course?.courseContent?.[0]?.subSection?.[0]?._id}`)
          }}
        >
          <div className="flex flex-col items-start md:flex-row gap-4 lg:items-center w-1/2">
            <img
              src={course.thumbnail}
              alt="Course thumbnail"
              className="w-24 h-16 object-cover rounded-lg"
            />
            <div className="text-sm">
              <p className="font-medium text-white truncate max-w-[10rem] md:max-w-[12rem]">
                {course.name}
              </p>
              <p className="text-gray-400 text-xs truncate max-w-[10rem] lg:max-w-[12rem]">
                {course.courseDescription}
              </p>
            </div>
          </div>

          <div className="w-1/4 text-center text-sm text-gray-300">
            {course?.totalDuration}
          </div>

          <div className="w-1/4 flex flex-col-reverse lg:flex-col">
            <p className="text-sm text-gray-300 mb-2 flex">
              Progress: {course?.progressPercentage}%
            </p>
            <ProgressBar
              completed={course?.progressPercentage || 0}
              height="8px"
              isLabelVisible={false}
              baseBgColor="#374151"
              bgColor="#22c55e"
            />
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default EnrolledCourses;
