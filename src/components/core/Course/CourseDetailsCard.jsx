import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../slices/cartSlice";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { thumbnail, price } = course;

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (user && user?.accountType === "Instructor") {
      toast.error("You are an Instructor, you cann't buy this course");
      return;
    }

    if (token) {
      dispatch(addToCart(course));
      return;
    }

    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to add to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link is copied to clipboard");
    //mujhe new window open krna h jisme sare apps khule
  };

  return (
    <div
      className="absolute top-0 left-1/2 transform translate-x-1/2 translate-y-[20%] 
    bg-richblack-700 rounded-lg shadow-lg overflow-hidden w-[420px]"
    >
      <img
        src={thumbnail}
        alt="course thumbnail"
        className="w-full h-[220px] object-cover"
      />
      <div className="p-5 flex flex-col gap-4">
        <p className="text-3xl font-bold text-richblack-5">Rs. {price}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={
              user && course?.studentEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : () => handleBuyCourse()
            }
            className="w-full bg-yellow-50 py-3 text-richblack-900 text-lg font-semibold 
       rounded-lg hover:scale-95 hover:bg-yellow-100 transition-all duration-300"
          >
            {user && course?.studentEnrolled.includes(user?._id)
              ? "Go to course"
              : "Buy Now"}
          </button>

          {!course?.studentEnrolled.includes(user?._id) && (
            <button
              onClick={handleAddToCart}
              className="w-full bg-richblack-900 py-3 text-white text-lg font-semibold 
         rounded-lg hover:scale-95 hover:bg-yellow-200 hover:text-black 
         transition-all duration-300"
            >
              Add to Cart
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 ">
          <p className="text-richblack-100">30-Day Money-Back Guarantee</p>
          <p className="font-semibold">This Course Includes:</p>
          <div className="border border-richblack-600 p-3 rounded-lg bg-richblack-800 flex flex-col gap-1">
            {JSON.parse(course?.instructions || "[]")?.map((item, index) => (
              <p key={index} className="text-caribbeangreen-200 text-sm">
                • {item}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center mt-2">
          <button
            className="text-yellow-50 font-medium hover:underline"
            onClick={handleShare}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
