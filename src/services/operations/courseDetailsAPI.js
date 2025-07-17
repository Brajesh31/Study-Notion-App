import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { categories, courseEndpoints, ratingEndpoints, sectionEndpoints ,subSectionEndpoints} from "../apis";
import { data } from "react-router-dom";

const { CATEGORIES_API } = categories;
const { CREATE_COURSE_API,EDIT_COURSE_API ,FETCH_INSTRUCTOR_COURSES_API,FETCH_FULL_COURSE_DETAILS_API,FETCH_ALL_COURSE_DETAILS_API,LECTURE_COMPLETE_API,DELETE_COURSE_API} = courseEndpoints;
const { EDIT_SECTION_API , CREATE_SECTION_API,DELETE_SECTION_API} = sectionEndpoints;
const {CREATE_SUBSECTION_API,EDIT_SUBSECTION_API,DELETE_SUBSECTION_API} = subSectionEndpoints;
const {CREATE_RATING_API,GET_AVG_RATING_API} = ratingEndpoints;

export const fetchCourseCategory = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", CATEGORIES_API);

    // console.log(response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response?.data?.data;
    // toast.success("")
  } catch (error) {
    console.log("Course Category Api error...", error.message);
    toast.error(error.message);
  }

  return result;
};

export const addCourseDetails = async (formData, token) => {
  let result = null;
  const toastId = toast.loading("Adding course details...");

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, formData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log(response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    toast.success("Course Detais added successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Create course api error...", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async (formData, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, formData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log(response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    toast.success("Course Detais updated successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Update course api error...", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data,token)=>{
    let result = null;
    const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "POST",
      CREATE_SECTION_API,
      data ,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("create secttion api response ...",response)
    if(!response.data.success){
        throw new Error("could not create section");
    }

    toast.success("Section Create successfully");
    result = response?.data?.data;

  } catch (error) {
    console.log("create Section api error....",error);
    toast.error(error.message)
  }

  toast.dismiss(toastId);
  return result
}

export const updateSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "PUT",
      EDIT_SECTION_API,
      data ,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("update secttion api response ...",response)
    if(!response.data.success){
        throw new Error("could not update section");
    }

    toast.success("Course Section Updated");
    result = response?.data?.data;

  } catch (error) {
    console.log("Update Section api error....",error);
    toast.error(error.message)
  }

  toast.dismiss(toastId);
  return result
};

export const deleteSection = async(data,token) => {
  let result ;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE",
      DELETE_SECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("delete section api response...",response);
    if(!response.data.success){
      throw new Error("Error in deleting the section");
    }

    result = response.data.data;

    toast.success("section deleted")

  } catch (error) {
    console.log("Delete section api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
}

export const deleteSubSection = async (data,token) => {
  let result ;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE",
      DELETE_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("delete subsection api response...",response);
    if(!response.data.success){
      throw new Error("Error in deleting the subsection");
    }

    result = response.data.data;

    toast.success("subsection deleted")

  } catch (error) {
    console.log("Delete sub-section api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;

}
export const createSubsection = async (data,token) => {
  let result ;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST",
      CREATE_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("CREATE subsection api response...",response);
    if(!response.data.success){
      throw new Error("Error in deleting the subsection");
    }

    result = response.data.data;

    toast.success("Lecture Created")

  } catch (error) {
    console.log("Create sub-section api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;

}
export const updateSubSection = async (data,token) => {
  let result ;
  const toastId = toast.loading("updating...");
  try {
    const response = await apiConnector("PUT",
      EDIT_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("update subsection api response...",response);
    if(!response.data.success){
      throw new Error("Error in updating the subsection");
    }

    result = response.data.data;

    toast.success("Lecture updated")

  } catch (error) {
    console.log("update sub-section api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;

}

export const fetchInstructorCourses= async(token)=>{
  let result=[] ;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET",
      FETCH_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("FETCH INSTRUCTOR COURSE api response...",response);
    if(!response.data.success){
      throw new Error("Error while fetching instructor courses");
    }

    result = response.data.data;

    // toast.success("Lecture updated")

  } catch (error) {
    console.log("fetch instructor's courses error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
}
export const fetchAllCourseDetails= async(courseId,token)=>{
  let result=[] ;

  const toastId = toast.loading("Loading...");
  const formData = new FormData();
  formData.append("courseId",courseId);
  try {
    const response = await apiConnector("POST",
      FETCH_ALL_COURSE_DETAILS_API,
      formData,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("FETCH all COURSE details  api response...",response);
    if(!response.data.success){
      throw new Error("Error while fetching all course details");
    }

    result = response.data.data;

    // toast.success("Lecture updated")

  } catch (error) {
    console.log("fetch all course details api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
}
export const fetchFullCourseDetails= async(courseId)=>{
  let result=[] ;

  const toastId = toast.loading("Loading...");
  const formData = new FormData();
  formData.append("courseId",courseId);
  try {
    const response = await apiConnector("POST",
      FETCH_FULL_COURSE_DETAILS_API,
      formData
    )

    console.log("FETCH full COURSE details  api response...",response);
    if(!response.data.success){
      throw new Error("Error while fetching full course details");
    }

    result = response.data.data;

    // toast.success("Lecture updated")

  } catch (error) {
    console.log("fetch all course details api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
}
export const markLectureAsComplete= async(data,token)=>{
  let result=[] ;
  console.log("data",data);
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST",
      LECTURE_COMPLETE_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("MARK LECTURE AS COMPLETE api response...",response);
    if(!response.data.success){
      throw new Error("Error while MARKING AS COMPLETE");
    }

    result = response.data.success;

    // toast.success("")

  } catch (error) {
    console.log("fetch all course details api error...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
}

export const createRating = async(data,token)=>{
  const toastId = toast.loading("Loading")
  try {
    const res = await apiConnector("POST",CREATE_RATING_API,data,{
      Authorization : `Bearer ${token}`
    })

    if(!res.data.success){
      throw new Error("Error in giving rating to the course");
      
    }

    toast.success("Rating added successfully");
    
  } catch (error) {
    console.log("error in adding rating to the course....",error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
}

export const getAverageRating = async(courseId)=>{
  const result = 0;
  try {
    const res = await apiConnector("POST",GET_AVG_RATING_API,{courseId});

    console.log("get aaverage rating api response",res);
    
    result = res?.data?.averageRating;
  } catch (error) {
    console.log("Error in get average rating api ",error);
  }

  return result;
}

export const deleteCourse = async(courseId,token)=>{
  const toastId = toast.loading("Deleting this course...");
  let result = null;
  // console.log("data",data);
  const formData = new FormData();
  formData.append("courseId",courseId)
  try {
    const res = await apiConnector("POST",DELETE_COURSE_API,formData,{
      Authorization: `Bearer ${token}`
    })
    console.log("delete course api response...",res);
    if(!res.data.success){
      throw new Error("Error in delete course api ");

    }

    toast.success("course deleted");
    result = res?.data?.data;
  } catch (error) {
    console.log("Error in delete course api...",error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
}