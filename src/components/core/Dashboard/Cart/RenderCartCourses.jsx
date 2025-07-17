import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import {
  MdOutlineStarHalf,
  MdOutlineStarOutline,
  MdOutlineStarPurple500,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFormCart } from "../../../../slices/cartSlice";
import RatingStars from "../../../common/RatingStars";
import GetAvgRating from "../../../../utils/avgRating";
const RenderCartCourses = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  // const [avgRating, setAvgRating] = useState(0);

  // useEffect(() => {
  //   console.log(cart);
  //   const avgrating = GetAvgRating(cart?.ratingAndReviews);
  //   console.log(avgrating)
  //   setAvgRating(avgrating)
  // }, []);

  return (
    <div className="text-white flex flex-col gap-3 p-6 bg-gray-900 rounded-lg shadow-lg">
      {cart.map((course, index) => (
        <div
          key={index}
          className="flex flex-row justify-between items-start gap-6 bg-gray-800 p-4 rounded-lg"
        >
          {/* Course Thumbnail */}
          <img
            src={course?.thumbnail}
            alt=""
            className="h-28 w-48 rounded-lg object-cover border border-gray-700"
          />
          {/* Course Details */}
          <div className="flex-grow flex flex-col justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">{course?.courseName}</p>
              <p className="text-sm text-gray-400">{course?.category?.name}</p>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="text-sm font-medium">
                {GetAvgRating(course?.ratingAndReviews)}{" "}
              </span>
              <RatingStars
                Review_Count={GetAvgRating(course?.ratingAndReviews)}
                Star_Size={24}
              />
              <span className="text-sm text-gray-400">
                ({course?.ratingAndReviews?.length} reviews)
              </span>
            </div>
          </div>
          {/* Course Actions */}
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => dispatch(removeFormCart(course._id))}
              className="flex items-center gap-1 text-red-500 hover:text-red-600"
            >
              <RiDeleteBin6Line size={20} />
              <span className="text-sm font-medium">Remove</span>
            </button>
            <p className="text-lg font-semibold">Rs {course.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
