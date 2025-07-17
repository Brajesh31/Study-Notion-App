import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseCategory,
  editCourseDetails,
  addCourseDetails,
} from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementsField from "./RequirementsField";
import IconButton from "../../../../common/IconButton";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import { current } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ChipInput from "./ChipInput";
import Upload from "./Upload";

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  //   const {setStep} = useSelector((state)=> state.course)
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [requirementList, setRequirementList] = useState([]);


  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCetegories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategory();

      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
    if (editCourse) {
      setValue("courseTitle", course.name);
      setValue("courseDescription", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTag", course.tag);
      setValue("courseBenifits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
      // console.log("couse",course);
    getCetegories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseDescription !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      // currentValues.courseTag !== course.courseName ||

      currentValues.courseTag.toString() !== course.tag.toString() ||
      currentValues.courseBenifits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString()
    )
      return true;
    else return false;
  };

  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (currentValues.courseDescription !== course.courseDescription) {
          formData.append("courseDescription", data.courseDescription);
        }

        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }

        if (currentValues.courseBenifits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenifits);
        }

        // console.log("course",course);

        // console.log("course category",course.category)
        if (currentValues.courseCategory !== course.category._id) {
          formData.append("category", data.courseCategory);
        }

        if (currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }

        formData.append("thumbnail",currentValues.courseImage);



        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setEditCourse(false));
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }

        console.log("PRINTING FORMDATA", formData);
        console.log("PRINTING result", result);
      } else {
        toast.error("NO Changes made so far");
      }
      

      return;
    }

    //create a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseDescription);
    formData.append("price", data.coursePrice);
    formData.append("whatYouWillLearn", data.courseBenifits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    // formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("tag", JSON.stringify(data.CourseTag));
    formData.append("thumbnail", data.courseImage);

    setLoading(true);
    // console.log("BEFORE add course API call");
    // console.log("PRINTING FORMDATA", [...formData]);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
    console.log("AFTER add course API call");
    console.log("PRINTING FORMDATA", [...formData]);
    console.log("PRINTING result", result);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border-richblack-700 w-[90%] mx-auto space-y-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="courseTitle" className="text-md text-richblack-100 ">
          Course Title<sup className="text-pink-200 ">*</sup>
        </label>
        <input
          type="text"
          id="courseTitle"
          placeholder="Enter Course Title"
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("courseTitle", { required: true })}
        />
        {errors.courseTitle && <span>Course Title is Required</span>}
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="courseDescription"
          className="text-md text-richblack-100 "
        >
          Course Short Discription<sup className="text-pink-200 ">*</sup>
        </label>
        <textarea
          type="text"
          id="courseDescription"
          placeholder="Enter Description"
          className="w-full min-h-[140px] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("courseDescription", { required: true })}
        />
        {errors.courseDescription && <span>Course Description is Required</span>}
      </div>
      <div className="relative">
        <label htmlFor="coursePrice" className="text-md text-richblack-100 ">
          Course Price <sup className="text-pink-200 ">*</sup>
        </label>
        <input
          type="text"
          id="coursePrice"
          placeholder="Enter Price"
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 !pl-12"
          {...register("coursePrice", { required: true, valueAsNumber: true })}
        />
        <HiOutlineCurrencyRupee className="absolute top-1/2 text-richblack-400 text-2xl left-3" />
        {errors.courseDescription && <span>Course Description is Required</span>}
      </div>

      <div className="text-richblack-500">
        <label htmlFor="courseCategory" className="text-md text-richblack-100 ">
          Course Category<sup className="text-pink-200 ">*</sup>
        </label>
        <select
          name=""
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        >
          <option value="" disabled>
            {" "}
            chose a category
          </option>
          {!loading &&
            courseCategories.map((category, index) => (
              <option value={category?._id} key={index}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && <span>Course Category is Required</span>}
      </div>

      {/* create a custom component for handeling tags */}
      <ChipInput
        label="Tag"
        name="CourseTag"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* create a component for uploading and showing previews */}
      <Upload
        title={"Course Thumbnail"}
        label={"CourseImage"}
        name={"courseImage"}
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        editData={course?.thumbnail}
      />

      {/* Benifits of the course */}
      <div>
        <label htmlFor="courseBenifits" className="text-md text-richblack-100 ">
          Benifits of the Course<sup className="text-pink-200 ">*</sup>
        </label>
        <textarea
          name=""
          id="courseBenifits"
          placeholder="Enter Benifits of the course"
          className="w-full min-h-[140px] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("courseBenifits",{required:true})}
        >
          {errors.courseBenifits && (
            <span>Benifits of the course are required</span>
          )}
        </textarea>
      </div>

      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <div className="flex gap-3 justify-between px-3 ">
      <div>
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            className="w-fit mt-10 h-[40px] bg-richblack-900 border-2 border-richblack-600 text-richblack-5 font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-richblack-800 transition duration-300 hover:scale-95"
          >
            continue without saving
          </button>
        )}
      </div>

      <div className="flex ">
        <IconButton
          text={!editCourse ? "Next" : "Save Changes"}
          customClasses="w-full mt-10 h-[40px] bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300 hover:scale-95"
        />
      </div>

      </div>
    </form>
  );
};

export default CourseInformationForm;
