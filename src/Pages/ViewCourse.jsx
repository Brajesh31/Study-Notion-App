import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { fetchAllCourseDetails } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(null);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("yaha aa kyu ni raha be ?")
    const setCourseSpecificDetails = async () => {
      // console.log("phle yaha aaye ?")
      
      setLoading(true);
      const courseData = await fetchAllCourseDetails(courseId, token);
      console.log("courseData", courseData);
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((element) => {
        lectures += element.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));

      setLoading(false);
    };
    setCourseSpecificDetails();
  }, []);

  return (
    <div className="">
      {loading ? (
        <div className="fixed top-0 left-0 inset-0 flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex justify-between  items-start ">
          <div className="w-[25%]">
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
          </div>
          <div className="w-[75%] border-2">
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      )}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  );
};

export default ViewCourse;
