const Course = require("../models/Course");
const Section = require("../models/section");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }
    // creat section
    const newSection = await Section.create({
      sectionName,
    });
    // update course with object id
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection" 
      },
    });
    // how to populate subsection here?

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section , please try again ",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );

    const courseDetails = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection" 
      },
    });

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section , please try again ",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // Assuming that we are sending id in params
    // const {sectionId} = req. ;
    const { sectionId, courseId } = req.body;
    const courseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $pull: {
          courseContent: sectionId,
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path:"courseContent",
        populate : {
          path:"subSection"
        }
      })
      .exec();

    await Section.findByIdAndDelete(sectionId);

    //do we need to delete the entry from schema?

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section , please try again ",
      error: error.message,
    });
  }
};
