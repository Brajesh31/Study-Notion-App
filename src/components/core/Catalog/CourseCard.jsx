import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";

const CourseCard = ({ course }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    // console.log("course inside courseCard", course?.ratingAndReviews);
    const count = GetAvgRating(course?.ratingAndReviews);
    // console.log("count",count);
    setAvgReviewCount(count);
  }, []);

  return (
    <div className="">
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="mb-4">
            <img
              src={course?.thumbnail}
              alt=""
              className="h-[250px] w-full rounded-xl object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <p className="text-lg font-semibold text-richblack-5">
              {course?.name}
            </p>
            <p className="text-lg text-richblack-100 ">
              {" "}
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex gap-x-3">
              <span className="text-lg font-semibold">
                {avgReviewCount || 0}
              </span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={25} />
              <span className="text-lg font-semibold">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-lg font-semibold">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;