import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { render } from "react-dom";
import IconButton from "../../common/IconButton";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const ref = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, []);

  const onSubmit = async (data) => {
    console.log("data", data);
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
  };

  useOnClickOutside(ref, () => setReviewModal(false));
  return (
    <div>
      <div
        className="w-11/12 max-w-[550px] rounded-lg border-richblack-400 bg-richblack-800  z-50 fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
        ref={ref}
      >
        <div >
          {/* Modal header */}
          <div className="flex justify-between border-b border-richblack-600 py-3 px-6 bg-richblack-700 border rounded-lg">
            <p className="text-richblack-5">Add review</p>
            <button
              className="text-richblack-5"
              onClick={() => setReviewModal(false)}
            >
              close
            </button>
          </div>

          {/* modal body */}
          <div className="my-5 w-full">
            <div className="flex items-center justify-center gap-3">
              <img
                src={user?.image}
                alt="instructor"
                className="aspect-square w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-lg text-richblack-5">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-richblack-100">posting Publicly</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex flex-col justify-center px-6 "
            >
              <div className="flex justify-center">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={30}
                activeColor="#ffd700"
              />

              </div>

              <div>
                <label htmlFor="courseExperience" className="text-richblack-5">Add Your Experience <sup className="text-pink-200">*</sup></label>
                <textarea
                  name=""
                  id="courseExperience"
                  placeholder="Add your experience here"
                  {...register("courseExperience", { required: true })}
                  className="form-style min-h-[130px] w-full bg-richblack-600 p-2 text-richblack-5"
                ></textarea>
                {errors.courseExperience && (
                  <span>Please add your course experience</span>
                )}
              </div>

              <div className="flex justify-between w-full px-6">
                <button onClick={() => setReviewModal(false)}
                  className="bg-richblack-700 py-2 px-3 rounded-md text-richblack-5">Cancel</button>
                <IconButton text="save" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-10 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm over"></div>
    </div>
  );
};

export default CourseReviewModal;
