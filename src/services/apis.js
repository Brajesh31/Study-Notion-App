const BASE_URL = process.env.REACT_APP_BASE_URL

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword"
  };

  
export const categories = { 
    CATEGORIES_API : BASE_URL + "/course/showAllCategories",
    CATEGORY_PAGE_DETAILS_API: BASE_URL + "/course/getCategoryPageDetails",
}


export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/contact/contactUs",
};

export const profileEndpoints = {
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  UPDATE_PROFILE_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_USER_DETAILS_API: BASE_URL + "/profile/updateProfile",
  DELETE_USER_PROFILE_API: BASE_URL + "/profile/deleteProfile",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard"
}

export const courseEndpoints = {
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  CREATE_COURSE_API : BASE_URL + "/course/createCourse",
  FETCH_INSTRUCTOR_COURSES_API :BASE_URL + "/course/instructorCourses",
  FETCH_ALL_COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  LECTURE_COMPLETE_API: BASE_URL + "/course/updateCourseProgress",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  FETCH_FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails"
}

export const sectionEndpoints = {
  CREATE_SECTION_API : BASE_URL + "/course/addSection",
  EDIT_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection"
}

export const subSectionEndpoints = {
  CREATE_SUBSECTION_API : BASE_URL + "/course/addSubSection",
  EDIT_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection"
}

export const StudentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifySignature",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  
}

export const ratingEndpoints = {
  CREATE_RATING_API : BASE_URL + "/course/createRating",
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
  GET_AVG_RATING_API: BASE_URL + "/course/getAverageRating"
}