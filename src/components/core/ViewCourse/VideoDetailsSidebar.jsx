import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconButton from "../../common/IconButton";
import { IoChevronBackCircle } from "react-icons/io5";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videobarActive, setVideobarActive] = useState("");
  const navigate = useNavigate();
  const { sectionId, subsectionId } = useParams();
  const location = useLocation();

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    
    (() => {
      // console.log("video deatail me aa rha hu ")
      if (!courseSectionData.length) return;

      const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubsectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subsectionId);

      const activeSubsectionId =
        courseSectionData[currentSectionIndex]?.subSection?.[
          currentSubsectionIndex
        ]?._id;

      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      setVideobarActive(activeSubsectionId);
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);
  return (
    <>
      <div className="text-white h-full w-full py-4">
        {/* for button and headings */}
        <div>
          {/* for buttons */}
          <div className="flex justify-between px-2">
            <div 
              onClick={() => {
                navigate("/dashboard/enrolled-courses");
              }}
              className="flex items-center "
            >
              <IoChevronBackCircle size={26} />
            </div>

            <div>
              <IconButton
                text="Add review"
                onclick={() => setReviewModal(true)}
              />
            </div>
          </div>
          {/* for heading or title */}
          <div className="px-3 bg-richblack-800 mt-4 py-2  border-b border-richblack-600">
            <p className="truncate text-lg font-semibold">{courseEntireData?.name}</p>
            <p className="text-sm text-richblack-100">{completedLectures?.length} / {totalNoOfLectures}</p>
          </div>

          {/* for sections and subsections */}
          <div className=" mt-2 bg-richblack-700 ">
            {courseSectionData.map((section, index) => (
              <div key={index} onClick={() => setActiveStatus(section?._id)}>
                <div className="px-3 py-2">
                  <div>{section?.sectionName}</div>
                  {/* icon lagana h */}
                </div>

                <div>
                  
                  {
                    activeStatus === section?._id && (
                      <div>
                        {
                          section.subSection.map((topic,index) => (
                            <div key={index} 
                            className={`flex  p-4 gap-3 ${videobarActive === topic?._id ? "bg-yellow-200 text-richblack-900" : "bg-richblack-900 text-richblack-5"} `}
                            onClick={() => {
                              navigate(`view-course/course/${courseEntireData?._id}/section/${section?._id}/subSection/${topic?._id}`)

                              setVideobarActive(topic._id);
                            }}
                            >
                              <input type="checkbox"
                                checked={completedLectures.includes(topic?._id)}
                                onChange={ () => {}}

                              />
                              <span className="truncate">
                                {
                                  topic.title  
                                }
                              </span>
                            </div>
                          ) )
                        }
                      </div>
                    )
                  }
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;
