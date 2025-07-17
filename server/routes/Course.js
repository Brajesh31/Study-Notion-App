const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  updateCourse,
  fetchInstructorCourses,
  deleteCourse,
  getFullCourseDetails,
} = require("../controllers/Course");
const {
  showAllCategory,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
const {
  createSubsection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsections");
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middleware/auth");

// const {temp } = require("../controllers/temp")

const { updateCourseProgress } = require("../controllers/CourseProgress")

router.get("/instructorCourses",auth,isInstructor,fetchInstructorCourses);
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse",auth,isInstructor,updateCourse)
router.post("/deleteCourse",auth,isInstructor,deleteCourse)
router.post("/updateCourseProgress",auth,isStudent,updateCourseProgress);


router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection",auth,isInstructor, deleteSection);

router.put("/updateSubSection",auth,isInstructor,updateSubSection)
router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection)
router.post("/addSubSection",auth,isInstructor,createSubsection)

router.get("/getAllCourses",showAllCourses);
router.post("/getCourseDetails",auth,getCourseDetails)
router.post("/getFullCourseDetails",getFullCourseDetails)

router.post("/createCategory",auth,isAdmin,createCategory)
router.post("/getCategoryPageDetails",categoryPageDetails);
router.get("/showAllCategories",showAllCategory);
router.get("/getAverageRating",getAverageRating)
router.post("/createRating",auth,isStudent,createRating)

router.get("/getReviews",getAllRating)
// router.delete("/temp",auth,isInstructor,temp)

module.exports = router;