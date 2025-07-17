import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../services/operations/StudentFeaturesAPI";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFullCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "../Pages/Error";
import ConfirmationModal from "../components/common/ConfimationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formatDate";
import { setLoading } from "../slices/profileSlice";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { FaChevronDown } from "react-icons/fa";
import { LuTvMinimalPlay } from "react-icons/lu";
import Footer from "../components/common/Footer"


const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user, loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [courseData, setCourseData] = useState(null);
  useEffect(() => {
    const getCourseFullDetails = async () => {
      dispatch(setLoading(true));
      // console.log(user)
      try {
        const result = await fetchFullCourseDetails(courseId,token);
        // console.log(result.courseDetails)
        if (result) {
          setCourseData(result.courseDetails);
        }
      } catch (error) {
        console.log("could not fetch courses");
      }
      dispatch(setLoading(false));
    };
    getCourseFullDetails();
  }, []);

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [avgReviewCount, setAverageReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(courseData?.ratingAndReviews);

    let lectures = 0;
    courseData?.courseContent?.forEach((element) => {
      lectures += element.subSection.length || 0;
    });

    setAverageReviewCount(count);
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  const [isActive, setIsActive] = useState(Array(0));
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat(id)
        : isActive.filter((e) => e != id)
    );
  };

  const handleBuyCourse = async () => {
    if (token) {
      // console.log("courseId",courseId)
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }

    setConfirmationModal({
      text1: "You are not Logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 top-0 left-0 flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div>
        <Error />
      </div>
    );
  }

  const {
    _id: course_id,
    name,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentEnrolled,
    createdAt,
  } = courseData;

  return (
    <div className="flex flex-col items-center text-white  mx-auto w-screen">
      <div className="bg-richblack-800 w-screen relative">
        <div className=" py-12  w-10/12 mx-auto">
          <div className="w-[65%] flex flex-col gap-3 border-r">
            <p className="text-richblack-100">
              Home / Learning /{" "}
              <span className="text-yellow-50">
                {courseData?.category?.name}
              </span>
            </p>
            <p className="text-3xl text-richblack-5 font-semibold">{name}</p>
            <p className="text-lg text-richblack-100">{courseDescription}</p>
            <div className="flex flex-row gap-2">
              <span>{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
              <span> {`(${ratingAndReviews.length}) reviews`} </span>
              <span> {`(${studentEnrolled.length}) students`} </span>
            </div>
            <div>
              <p>
                created by{" "}
                <span>
                  {instructor.firstName} {instructor.lastName}
                </span>
              </p>
            </div>
            <div className="flex gap-x-3">
              <p>Created at {formatDate(createdAt)} </p>

              <p> English</p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <CourseDetailsCard
          course={courseData}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
        />
      </div>
      <div className="w-10/12 mt-8">
        <div className=" w-[65%] border border-richblack-600  p-4">
          <p className="text-3xl">What you'll learn</p>
          <div className="flex flex-col gap-2">{
            whatYouWillLearn.split("\r\n").map((item,index) => 
              <p key={index}>{item}</p>) 
            
            }</div>
        </div>
      </div>
      <div className="w-10/12 mt-8 ">
        <div className="w-[65%]">
          <p className="text-3xl">Course Content</p>
        </div>

        <div className=" gap-x-3 justify-between">
          <div className="flex justify-between  w-[65%]">

          <div>
            <span>{courseContent.length} section(s) </span>

            <span>{totalNoOfLectures} lecture(s)</span>
            {/* <span>{courseData.timeDuration} total length</span> */}
          </div>

          <div >
            <button onClick={() => setIsActive([])}
              
              className="text-yellow-50">
              Collapse all sections
            </button>
          </div>
          </div>

          {/* to do 
          yaha pe lectures ka section aur subsection show karana h 
         */}
          <div className="mt-4 w-[65%]">
            {courseContent?.map((section, index) => (
              <div key={index} className=" rounded-lg overflow-hidden border border-richblack-600 mb-5">
                {/* Section Button */}
                <button
                  className={` flex flex-row items-center gap-2 px-6 w-full text-left p-4 text-richblack-5 bg-richblack-700 cursor-pointer transition-all duration-300 ${
                    isActive.includes(section._id) ? "bg-richblack-200" : ""
                  }`}
                  onClick={() => handleActive(section._id)}
                >
                  <div className="flex justify-between w-full">
                    <p className="flex flex-row items-center justify-center gap-2">
                  <FaChevronDown size={14} className={`${isActive.includes(section._id) ? "rotate-180" : ""} transition-all duration-300`}/> 
                  <span className="truncate">
                  {section.sectionName}
                    </span>

                    </p>

                    <div className="flex gap-3 ">
                      <span className="text-yellow-25">{section.subSection.length} Lectures</span>
                      {/* <span>{yaha pe abhi kam baki h time duration add krna h}</span> */}
                      <span>30 min</span>
                    </div>
                  </div>
                  


                </button>

                {/* Collapsible Content with Animation */}
                <div
                  className={`px-4 py-3 bg-transparent text-richblack-5 transition-[max-height h,opacity,py] duration-300  overflow-hidden ${
                    isActive.includes(section._id)
                      ? "max-h-40 opacity-100 py-3"
                      : "h-0  py-0"
                  }`}
                  style={{ overflow: "hidden" }}
                >
                  {section.subSection.map((subsection, index) => (
                    <div key={index} className="py-2"> 
                    
                    <p className="flex flex-row items-center gap-2 ">
                    <LuTvMinimalPlay /> {subsection.title}

                    <FaChevronDown size={14} className={`${isActive.includes(section._id) ? "rotate-180" : ""} transition-all duration-300 text-richblack-100`}/> 
                    </p>
                    
                    
                    </div>
                  ))}
                </div>
              </div>
            ))}


          </div>


        </div >

        <div className="w-[65%] mb-10 flex flex-col gap-3">
          <p className="text-3xl ">Author</p>

          <div className="flex items-center justify-start gap-3">
            <img src={instructor?.image} alt="" className="aspect-square w-12 rounded-full object-cover"/>
            <p className="text-richblack-5 font-semibold">{instructor?.firstName} {instructor?.lastName}</p>
          </div>

          <p className="text-richblack-100">{instructor?.additionalDetails?.about}</p>
          

        </div>
      </div>

      <div className="w-screen">
      <Footer />

      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetails;
