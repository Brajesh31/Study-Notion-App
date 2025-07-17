import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourse/RenderSteps";
import { fetchAllCourseDetails } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice";
const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      // console.log("courseId", courseId);
      const result = await fetchAllCourseDetails(courseId, token);
      if (result) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result.courseDetails));
        dispatch(setStep(1));
      }

      setLoading(false);
    };

    populateCourseDetails();
  }, [courseId, token, dispatch]);

  return (
    <div className="w-full bg-richblack-800">
      <h1 className="text-3xl text-richblack-5 ml-8">Edit course</h1>
      <div className=" flex justify-center items-center mx-auto">

      <div className=" ">{course ? <RenderSteps /> : <p>Course not found</p>}</div>
      </div>
    </div>
  );
};

export default EditCourse;
