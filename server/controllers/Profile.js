const Profile = require("../models/Profile");
const Courses = require("../models/Course");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const courseProgress = require("../models/courseProgress");
const Course = require("../models/Course");
const { deleteImages} = require("../utils/deleteImageAndVideos");
// const courseProgress = require("../models/courseProgress")

exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,
      firstName,
      lastName,
    } = req.body;

    const id = req.user.id;
    // if (!contactNumber || !gender || !id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required",
    //   });
    // }
    const userDetail = await User.findById(id);
    const profile = await Profile.findById(userDetail.additionalDetails);
    console.log("Additonal details",profile);

    const profileDetails = await Profile.findByIdAndUpdate(
      userDetail.additionalDetails,
      {
        firstName: firstName || userDetail.firstName,
        lastName: lastName || userDetail.lastName,
        dateOfBirth: dateOfBirth || profile.dateOfBirth,
        about: about || profile.about,
        contactNumber: contactNumber || profile.contactNumber,
        gender: gender,
      },
      {
        new: true,
      }
    );
    console.log("after profile details");


    return res.status(200).json({
      success: true,
      message: "Profile details updated successfully",
      profileDetails,
    });
  } catch (error) {
    console.log("error in update profile controller",error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete account

exports.deleteAccount = async (req, res) => {
  try {
    //fetch details
    // console.log(id)
    console.log("Entered backend");
    const id = req.user.id;
    const { password } = req.body;
    console.log("password is ", password);
    // validation
    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Details",
      });
    }

    // delete profile first

    const userDetails = await User.findById({ _id: id });
    const progressDetails = await courseProgress.find({userId: userDetails._id});
    console.log("progressDetails",progressDetails);

    const passMatch = await bcrypt.compare(password, userDetails.password);

    if (!passMatch) {
      return res.status(401).json({
        success: false,
        message: "Password didn't matched",
      });
    }
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.accountType != "Student") {
      return res.status(400).json({
        success: false,
        message: "Instructor Account can't be deleted",
      });
    }

    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //khud se krna h ye
    // for (const courseId of userDetails.courses) {
    //   await Courses.findByIdAndUpdate(
    //     courseId,
    //     { $pull: { studentEnrolled: id } }, // Removes the user ID from the studentEnrolled array
    //     { new: true } // Returns the updated document
    //   );
    // }

    // another method of deleting students enrolled
    if (userDetails.courses && userDetails.courses.length > 0) {
      await Courses.updateMany(
        { _id: { $in: userDetails.courses } },
        { $pull: { studentEnrolled: id } }
      );
    }



    // delete user
    await deleteImages([userDetails.image])
    await User.findByIdAndDelete({ _id: id });
    // return
    return res.status(200).json({
      success: true,
      message: "User Account deleted",
    });
  } catch (error) {
    // console.log(error.message);
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Not a user",
      });
    }

    const userDetails = await User.findById(id)
      .populate([{ path: "additionalDetails" }, { path: "courses" }])
      .exec();

    return res.status(200).json({
      success: true,
      message: "User details fethced successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    // console.log("inside the updateDisplayPicture")
    const userId = req.user.id;

    // Check if a file is uploaded
    const dp = req.files?.pfp; // Access the uploaded file
    if (!dp) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload an image.",
      });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // // Remove the previous image from Cloudinary if it exists
    // if (user.displayPicture) {
    //   const publicId = user.displayPicture.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
    //   await deleteImageFromCloudinary(publicId);
    // }

    // Upload the new image to Cloudinary
    const result = await uploadImageToCloudinary(dp, process.env.FOLDER_NAME);

    // Update the user's display picture
    user.image = result.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      image: user.image,
    });
  } catch (error) {
    console.error("Error in updateDisplayPicture:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

//copied from somewhere
exports.getEnrolledCourses = async (req, res) => {
  try {
    // console.log("Yaha to aa rha hu ")
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    // console.log("user details", userDetails)
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
        
        userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await courseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      });
      // console.log("courseProgress count",courseProgressCount)
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

exports.instructorDashboard = async(req,res) => {
  try {
    const courseDetails = await Course.find({instructor: req.user.id})

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id:course._id,
        courseName: course.name,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
      return courseDataWithStats
    })

    console.log("courseData" ,courseData)
    return res.status(200).json({
      success:true,
      data:courseData
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
}
