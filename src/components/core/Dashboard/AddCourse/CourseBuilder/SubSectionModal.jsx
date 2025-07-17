import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubsection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross2 } from "react-icons/rx";
import Upload from "../CourseInformation/Upload";
import IconButton from "../../../../common/IconButton";
import useOnClickOutside from "../../../../../hooks/useOnClickOutside";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const ref = useRef(null);
  useEffect(() => {
    console.log("inside subsection module");
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("description", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.description !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    } else {
      return false;
    }
  };

  //Edit subsection 
  const handleEditSubSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subsectionId", modalData._id);

    if (currentValues.lectureTitle !== modalData.title);
    {
      formData.append("title", currentValues.lectureTitle);
    }

    if (currentValues.description !== modalData.description);
    {
      formData.append("description", currentValues.description);
    }

    if (currentValues.lectureVideo !== modalData.videoUrl);
    {
      formData.append("video", currentValues.lectureVideo)
    }

    setLoading(true);
    const result = await updateSubSection(formData, token);

    if (result) {
      const updatedCourseContent = course.courseContent.map((section)=> section._id === modalData.sectionId ? result : section);
      const updatedCourse  = {...course,courseContent:updatedCourseContent}
      dispatch(setCourse(updatedCourse));
    }

    setModalData(null);
    setLoading(false);

  };

  const onSubmit = async (data) => {
    if (view) {
      return;
    }

    //edit

    if (edit) {
      if (!isFormUpdated) {
        toast.error("No Changes made to the form ");
      } else {
        handleEditSubSection();
      }
      return;
    }

    //Add

    if (add) {
      const formData = new FormData();

      formData.append("sectionId", modalData);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.description);
      formData.append("video", data.lectureVideo);
      setLoading(true);

      const result = await createSubsection(formData, token);
      if (result) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result : section
        );
        const updatedCourse = {
          ...course,
          courseContent: updatedCourseContent,
        };
        dispatch(setCourse(updatedCourse));
      }

      setModalData(null);
      setLoading(false);
    }
  };



  useOnClickOutside(ref,() => setModalData(null));
  return (
    <div  onClick={(e) => {e.stopPropagation()}} >
      
      <div className="absolute top-0 translate-y- left-1/4 w-1/2 z-50  bg-richblack-600 p-3  rounded-lg h-[calc(100vh-3.5rem)]  scrollbar-hide "
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      
      ref={ref}>
        <div className="h-full overflow-y-auto">
        <div className="bg-richblack-800 w-full py-2 px-4 rounded-lg flex justify-between mb-5">
          <p className="text-xl ">
            {view && "Viewing"}
            {add && "Adding"}
            {edit && "Editing"} Lecture
          </p>
          <button onClick={() => {
            !loading && setModalData(null)
          }}
          className="bg-richblack-800 rounded-full aspect-square w-8 flex items-center justify-center"
          >
            <RxCross2 />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Upload
            title={"Course Video"}
            label={"lectureVideo"}
            name={"lectureVideo"}
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          <div>
            <label htmlFor="lectureTitle" className="text-md text-richblack-5  ">Lecture Title<sup className="text-pink-200">*</sup></label>
            <input
              type="text"
              id="lectureTitle"
              placeholder="Enter lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            {errors.lectureTitle && <span>Lecture Title is required</span>}
          </div>
          <div>
            <label htmlFor="description" className="text-md text-richblack-5 ">Lecture Description<sup className="text-pink-200">*</sup></label>
            <textarea
              id="description"
              placeholder="Enter Description"
              {...register("description", { required: true })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 h-[140px]"
            ></textarea>
            {errors.description && (
              <span>Lecture description is required</span>
            )}
          </div>
          <div className="flex items-center justify-end">
          {!view && (
            <IconButton
              disabled={loading}
              text={loading ? "Loading..." : edit ? "save changes" : "save"}
              customClasses="w-fit mt-10 h-fit bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300 hover:scale-95"

            />
          )}

          </div>
        </form>
      </div>
        </div>
        

      <div className='absolute inset-0 z-10 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-[3px] over'></div>
    </div>
  );
};

export default SubSectionModal;
