const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    //fetch data from req.body
    const { rating, review, courseId } = req.body;

    //check if user is already enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }
    //check if user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    //create rating review

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    // add id to the course
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      {
        new: true,
      }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and review create successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get average Rating

exports.getAverageRating = async (req, res) => {
  try {
    //get course Id
    const {courseId} = req.body;

    //calculate avg rating 
    const result = await RatingAndReview.aggregate([
      {
        $match:{
          course: new mongoose.Types.objectId(courseId)
        },
      },
      {
        $group:{
          _id:null,
          averageRating: { $avg:"$rating"}
        }
      }
    ])
    // return rating 
    if(result.length > 0){
      return res.status(200).json({
        success:true,
        averageRating: result[0].averageRating
      })
    }

    return res.status(200).json({
      success:true,
      message:"Average Rating is 0",
      averageRating: 0
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// fget all Rating and reviews

exports.getAllRating = async(req,res)=>{
  try {
    const allReviews = await RatingAndReview.find({}).sort({rating: "desc"})
    .populate({
      path:"user",
      select:"firstName lastName email image"
    })
    .populate({
      path:"course",
      select:"courseName"
    }).exec();

    return res.status(200).json({
      success:true,
      message:"All reviews fethced successfully",
      data:allReviews
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}