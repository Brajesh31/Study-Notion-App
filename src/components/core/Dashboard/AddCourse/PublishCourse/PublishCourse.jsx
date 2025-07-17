import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../../../../common/IconButton";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";


const PublishCourse = () => {
  const { register, handleSubmit, errors, getValues, setValue } = useForm();
  const { course } = useSelector((state) => state.course);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (course?.status === "Published") {
      setValue("public", true);
    } else {
      setValue("public", false);
    }
  }, []);

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");

  };

  const handleCoursePublish = async() => {
    if (
      (course?.status === "Published" && getValues("public") === true) ||
      (course.status === "Draft" && getValues("public") === false)
    ) {
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId",course._id);

    const courseStatus = getValues("public") ? "Published" : "Draft";

    formData.append("status",courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData,token);

    if(result){
        goToCourses();
    }

    setLoading(false);
  };
  const onSubmit = () => {
  handleCoursePublish();
  };

  const goBack = () => {
    dispatch(setStep(2));
  };

  return (
    <div >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md border border-richblack-600 bg-richblack-800 p-5 flex flex-col gap-3">
      <p className="text-3xl text-richblack-5">Publish Course</p>
          <label htmlFor="public" >
            <input
              type="checkbox"
              id="public"
              {...register("public", { required: true })}
              className=""
              />
              
            <span className="ml-3 text-richblack-100 text-lg">Make this Course as Public</span>
          </label>
        </div>
        <div className="mt-14 flex flex-row justify-between px-5">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="bg-richblack-800 px-3 py-2 rounded-lg flex flex-row gap-2 items-center text-richblack-5 "
          >
            <FaAngleLeft />

            Back
          </button>

          <IconButton disabled={loading} text={"save changes"} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
