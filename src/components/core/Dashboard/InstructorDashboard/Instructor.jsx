import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";
import { FaHandSparkles } from "react-icons/fa";

const Instructor = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      const instructorApiData = await getInstructorData(token);
      console.log("instructor api data", instructorApiData);

      if (instructorApiData) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }

      setLoading(false);
    };

    getCourseDataWithStats();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );
  return (
    <div className="text-white ">
      <div className="w-4/5 mx-auto py-5">
      <div className="px-4 mb-5">
        <h1 className="text-3xl text-richblack-5 font-semibold flex gap-2 items-start ">Hi {user?.firstName} 
        <FaHandSparkles size={24} className="text-yellow-50 -rotate-45" />
        </h1>
        <p className="text-richblack-100">Let's start something new</p>
      </div>

      {loading ? (
        <div className="w-full inset-0 left-0 top-0 fixed flex justify-center items-center">
          <div className="loader">

          </div>
        </div>
      ) : courses.length > 0 ? (
        <div>
          <div>
            <div className="flex gap-5 ">
              <div className="w-[65%]">
              <InstructorChart courses={instructorData} />

              </div>
              <div className="bg-richblack-800 w-[30%] flex flex-col gap-3 px-5 py-8 rounded-lg">
                <p className="text-xl text-richblack-5">Statistics</p>
                <div>
                  <p className="text-richblack-100 ">Total Courses</p>
                  <p className="text-richblack-5 text-xl font-semibold">{courses.length}</p>
                </div>

                <div>
                  <p className="text-richblack-100 ">Total Students</p>
                  <p className="text-richblack-5 text-xl font-semibold">{totalStudents}</p>
                </div>
                <div>
                  <p className="text-richblack-100 ">Total income</p>
                  <p className="text-richblack-5 text-xl font-semibold">{totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* render courses */}
            <div  className="bg-richblack-800 p-5 mt-5 rounded-lg">
              <div className="flex justify-between mb-5">
              <p>Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-yellow-50">View all</p>
              </Link>

              </div>
            <div className="flex gap-5">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-[30%] flex flex-col gap-3">
                  <img src={course.thumbnail} alt="" 
                  className="rounded-md object-cover"/>
                  <div>
                    <p className="text-lg text-richblack-100">{course.name}</p>

                    <div className="flex gap-3">
                      <p>{course.studentEnrolled.length} students</p>
                      <p> | </p> 
                      <p>Rs {course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>You have not created any courses yet</p>
          <Link to="/dashboard/add-course">Create a course</Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default Instructor;
