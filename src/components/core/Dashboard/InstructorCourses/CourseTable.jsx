import React, { useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { LuTimerReset } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import ConfirmationModal from "../../../common/ConfimationModal";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  //handle delete course
  const handleCourseDelete = async (courseId) => {
    //  pending
    console.log("courseId,", courseId);
    const res = await deleteCourse(courseId, token);
    console.log(res);
    if (res) {
      // const updatedCourse = course.filter
      setCourses(res);
    }
    setConfirmationModal(null);
  };

  return (
    <div className="w-11/12  mx-auto">
      <Table className="w-11/12 border-collapse border border-richblack-800 text-sm bg-richblack-900 text-richwhite-100 rounded-lg shadow-lg">
        <Thead className="bg-richblack-800">
          <Tr className="text-center border-b border-richblack-700">
            <Th className="px-6 py-3 w-[60%] ">Courses</Th>
            <Th className="px-6 py-3 w-[10%] ">Duration</Th>
            <Th className="px-6 py-3 w-[10%] ">Price</Th>
            <Th className="px-6 py-3 w-[20%] ">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr className="text-center border-b border-richblack-700">
              <Td
                className="px-6 py-3 text-center text-richgray-400"
                colSpan="4"
              >
                No Courses Found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="border-b border-richblack-700 hover:bg-richblack-800 transition-all"
              >
                <Td className="px-6 py-3 flex gap-x-4 items-start">
                  <img
                    src={course.thumbnail}
                    alt="Thumbnail"
                    className="h-[150px] w-[220px] rounded-lg object-cover shadow-md border border-richblack-700"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-richwhite-100 truncate text-wrap max-w-[25-rem]">
                      {course.name}
                    </p>
                    <p className="text-sm text-richgray-400 truncate max-w-[25rem]">
                      {course.courseDescription}
                    </p>
                    <p className="text-xs text-richgray-500">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                    {course.status !== "Published" ? (
                      <p className="flex items-center gap-2 text-pink-100 text-xs">
                        <LuTimerReset /> <span>DRAFTED</span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 text-yellow-50 text-xs">
                        <CiCircleCheck /> <span>PUBLISHED</span>
                      </p>
                    )}
                  </div>
                </Td>

                <Td className="px-6 py-3 text-center">
                  {course.totalDuration || "2h 25min"}
                </Td>
                <Td className="px-6 py-3 text-center font-semibold">
                  Rs {course.price}
                </Td>
                <Td className="px-6 py-3  w-full flex flex-row gap-2 justify-center items-center my-auto">
                  <button
                    className="aspect-square w-10 flex items-center justify-center rounded-full text-white hover:bg-richblack-600 transition-all duration-300 disabled:opacity-50"
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                  >
                    <MdEdit size={24} />
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all disabled:opacity-50"
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be permanently deleted.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => {
                              // console.log("course_uid",course._id)
                              handleCourseDelete(course._id);
                            }
                          : () => {},
                        btn2Handler: () => setConfirmationModal(null),
                      });
                    }}
                  >
                    <div className="aspect-square w-10 rounded-full bg-[#420606] flex justify-center items-center">
                      <MdDelete size={24} color="#963333" />
                    </div>
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
