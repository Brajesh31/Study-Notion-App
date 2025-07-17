const Course = require("../models/Course");
const Category = require("../models/category");
const User = require("../models/User");
// const SubSection = require("../models/Subsection")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const courseProgress = require("../models/courseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const { deleteImage, deleteImages } = require("../utils/deleteImageAndVideos");
const Subsection = require("../models/Subsection");
const Section = require("../models/section");
const RatingAndReview = require("../models/RatingAndReview");
const category = require("../models/category");

//create course handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
      instructions,
      status,
    } = req.body;
    console.log("instructions ", instructions);

    //get thumbnail
    // console.log("before image")
    const thumbnail = req.files.thumbnail;
    // console.log("after image")

    //validations
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status || status == undefined) {
      status = "Draft";
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    // console.log("Instructor Details : ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "instructor not found",
      });
    }

    //check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "category details not found",
      });
    }

    // console.log("bewfore cloud")
    // upload image to cloudinaruy
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // console.log("after cloud")

    //create an entry for new course
    const newCourse = await Course.create({
      name: courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag: tag,
      instructions: instructions,
      status: status,
    });

    //add the new course to the user schema
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update the category schema
    const categor = await Category.findByIdAndUpdate(
      {
        _id: categoryDetails._id,
      },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );
    console.log(categor);

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error while creating course");
    return res.status(500).json({
      success: false,
      message: error.message,
      // error: error.message,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    // let {status} = req.body;
    console.log("updates", updates);
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    console.log("req.files", req.files);

    if (req.files) {
      const thumbnail = req.files.thumbnail;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );

      console.log("thumb", thumbnailImage);
      course.thumbnail = thumbnailImage.secure_url;
    }

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    // const newCourse = await Course.findByIdAndUpdate(
    //   courseId,

    //   {
    //     name: courseName || course.courseName,
    //     courseDescription: courseDescription || course.courseDescription,
    //     instructor: course.instructor,
    //     whatYouWillLearn: whatYouWillLearn || course.whatYouWillLearn,
    //     price: price || course.price,
    //     category: categoryDetails._id,
    //     thumbnail: thumbnailImage.secure_url,
    //     tag: tag || course.tag,
    //     instructions: instructions || course.instructions,
    //     status:status,
    //   },
    //   {new:true}
    // );

    const newCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "course updated successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("error in update course controller", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // console.log(courseId);
    const userId = req.user.id;
    const courseDetails = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });
    // console.log(courseDetails);

    //fetch videoUrl of all subsections
    let videoUrlArray = courseDetails.courseContent.flatMap((section) =>
      section.subSection.map((subsec) => subsec.videoUrl)
    );
    // console.log("videoUrlArray", videoUrlArray);

    // delete videos from cloudinary
    await deleteImages(videoUrlArray);

    //remove course from instructor's array
    const userDetails = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          courses: courseId,
        },
      },
      {
        new: true,
      }
    );
    // console.log("userDetails", userDetails);

    // fetch all sections of the course
    const allSections = courseDetails.courseContent;

    // delete all subsection from each section
    for (let section of allSections) {
      const result = await Subsection.deleteMany({
        _id: { $in: section.subSection },
      });

      // console.log("subsection delete result ",result);
    }

    // delete all sections
    await Section.deleteMany({ _id: { $in: allSections } });
    // console.log("section delete result");

    //rating and review me se sare rating hatane h
    // delete all of the rating and reviews of the course
    await RatingAndReview.deleteMany({ course: courseDetails._id });

    // console.log("rating and review result",ratingandReviewResult);

    // delete course thumbnail
    await deleteImages([courseDetails.thumbnail]);

    // remove this course from the coresponding course
    await category.findByIdAndUpdate(
      { _id: courseDetails.category },
      { $pull: { course: courseDetails._id } }
    );
    // console.log("newCategoryCourse",newCategoryCourse)

    // delete the course progress
    await courseProgress.deleteOne({ courseId: courseId });

    // finally delete the course
    await Course.findByIdAndDelete(courseId);
    // console.log(courseDeleteResult);

    // return the remaining courses to the user
    const allCourses = await Course.find({ instructor: userId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//get all courses handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "cannot fethc course data",
      error: error.message,
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    console.log(courseId);
    //find courses details.
    const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await courseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    console.log("courseProgressCount: ", courseProgressCount);
    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with this ${courseId}`,
      });
    }
    console.log(courseDetails);

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : ["none"],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let allCourses = await Course.find({ instructor: userId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

      // allCourses = allCourses.toObject();
      allCourses = allCourses.map(course => course.toObject());

      // console.log("all courses",allCourses);
      for(var i = 0; i < allCourses.length; i++){
        let totalDurationInSeconds = 0;
        // let SubsectionLength = 0;
        for(var j = 0; j < allCourses[i].courseContent.length; j++){
          totalDurationInSeconds += allCourses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);

          allCourses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
          // console.log(allCourses[i].totalDuration);

        }
      }
      console.log("all courses",allCourses);
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Courses",
      error: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
	try {
	  const { courseId } = req.body
	  // const userId = req.user.id
	  const courseDetails = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
      select:"about"
		  },
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
      select:"title"
		  },
		})
		.exec()

		
	  // let courseProgressCount = await courseProgress.findOne({
		// courseID: courseId,
		// userID: userId,
	  // })
  
	  // console.log("courseProgressCount : ", courseProgressCount)
  
	  if (!courseDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find course with id: ${courseId}`,
		})
	  }
  
	  // if (courseDetails.status === "Draft") {
	  //   return res.status(403).json({
	  //     success: false,
	  //     message: `Accessing a draft course is forbidden`,
	  //   });
	  // }
  
	  let totalDurationInSeconds = 0
	  courseDetails.courseContent.forEach((content) => {
		content.subSection.forEach((subSection) => {
		  const timeDurationInSeconds = parseInt(subSection.timeDuration)
		  totalDurationInSeconds += timeDurationInSeconds;
		})
	  })
  
	  const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
	  return res.status(200).json({
		success: true,
		data: {
		  courseDetails,
		  totalDuration,
		  
		},
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }
