import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import SubSectionModal from "./SubSectionModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import ConfimationModal from "../../../../common/ConfimationModal";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, seteditSubSection] = useState(null);

  const [confimationModal, setConfirmationModal] = useState(null);
  const dispatch = useDispatch();

  const handleDeleteSection = async (sectionId) => {
    // setLoading(true);
    const result = await deleteSection(
      { sectionId, courseId: course._id },
      token
    );

    if (result) {
      dispatch(setCourse(result));
      setConfirmationModal(null);
    }
    // setLoading(false);
  };

  const handleDeleteSubSection = async (subsectionId, sectionId) => {
    const result = await deleteSubSection(
      {
        subsectionId,
        sectionId,
      },
      token
    );

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
      setConfirmationModal(null);
      setAddSubSection(null);
    }
    // console.log("nested",result);
  };
  return (
    <div >
      <div className="rounded-lg relative bg-richblack-700 p-6 px-8">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open className="mb-3">
            <summary className="flex items-center justify-between gap-x-3 border-b-2 ">
              <div className="flex items-center gap-x3">
                <RxDropdownMenu />
                <p>{section.sectionName}</p>
              </div>
              <div className="flex gap-x-1">
                <button
                  className=""
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => {
                    setConfirmationModal({
                      text1: "Delete this section",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    });
                    // console.log("Inside confirmation modal")
                  }}
                >
                  <RiDeleteBin6Line />
                </button>
                <span>|</span>
                <FaAngleDown className={`text-xl text-richblack-300`} />
              </div>
            </summary>
            <div>
              {section?.subSection?.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => {
                    // console.log("data",data);
                    setViewSubSection(data);
                  }}
                  className="flex items-center justify-between gap-x-3 px-5 border-b-2 my-2"
                >
                  <div className="flex items-center gap-x3">
                    <RxDropdownMenu />
                    <p>{data.title}</p>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <button
                      className=""
                      onClick={(e) => {
                        e.stopPropagation();
                        seteditSubSection({ ...data, sectionId: section._id });
                      }}
                    >
                      <MdEdit />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmationModal({
                          text1: "Delete this subSection",
                          text2: "selected lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  // console.log(section._id);
                  setAddSubSection(section._id);
                }}
                className="mt-4 flex items-center gap-x-3 text-yellow-50"
              >
                <FaPlus />
                <p>Add lectures</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
          
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
         
        />
      ) : (
        editSubSection && (
          <SubSectionModal
            modalData={editSubSection}
            setModalData={seteditSubSection}
            edit={true}
            
          />
        )
      )}

      {confimationModal && <ConfimationModal modalData={confimationModal} />}
    </div>
  );
};

export default NestedView;
