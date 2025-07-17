const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// const { useId } = require("react");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");
const crypto = require("crypto");
const courseProgress = require("../models/courseProgress");
// const courseProgress = require("../models/courseProgress");
//

exports.capturePayment = async (req, res) => {
  // get courseId and UserId
  const { courses } = req.body;
  console.log(courses);
  const userId = req.user.id;

  // validation
  if (courses.length 
    === 0) {
    return res.json({
      success: false,
      message: "Please provide valid course ID",
    });
  }

  let totalAmount = 0;
  for (const course_id of courses) {
    // valid courseId
    let course;
    try {
      // console.log("course_id",course_id);
      // const {courseId} = course_id;
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: "Could not find the course",
        });
      }
      // check if user already paid for the same course
      const uid = new mongoose.Types.ObjectId(userId);

      if (course.studentEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled",
        });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // order create
  const currency = "INR";

  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: courses,
      userId,
    },
  };

  try {
    //initiate the pauyment using razorpay
    console.log(process.env.RAZORPAY_KEY);
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    // return response
    return res.status(200).json({
      success: true,
      // courseName: course.courseName,
      // courseDescription: course.courseDescription,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

exports.verifySignature = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;

  const razorpay_payment_id = req.body?.razorpay_payment_id;

  const razorpay_signature = req.body?.razorpay_signature;

  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(401).json({
      success: false,
      message: "Validation failed",
      data: error.message,
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrolledStudents(courses, userId, res);

    return res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  }

  return res.status(200).json({
    success: false,
    message: "Payment failed",
  });
};

const enrolledStudents = async (courses, userId, res) => {
  try {
    if (!courses || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide data for courses or userId",
      });
    }

    for (const courseId of courses) {
      try {
        const enrolledCourse = await Course.findByIdAndUpdate(
          { _id: courseId },
          { $push: { studentEnrolled: userId } },
          { new: true }
        );
        if (!enrolledCourse) {
          return res.status(500).json({
            success: false,
            message: "Course not found",
          });
        }

        const courseProgres = await courseProgress.create({
          courseId:courseId,
          userId:userId,
          completedVideos : [],
        })
        const enrolledStudent = await User.findByIdAndUpdate(
          { _id: userId },
          { $push: {
             courses: courseId ,
             courseProgress: courseProgres._id,
            
            } },
          { new: true }
        );

        console.log(enrolledCourse);
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.name}`,
          courseEnrollmentEmail(
            enrolledCourse.name,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        );

        console.log("Email sent successfully ", emailResponse);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sendPaymentSuccessEmail = async(req,res) => {
  const {orderId,paymentId,amount} = req.body;
  const userId = req.user.id;

  if(!orderId || !paymentId || !amount || !userId){
    return res.status(400).json({
      success:false,
      message: "provide all fields"
    })

  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Recived`,
      paymentSuccessEmail(`${enrolledStudent.firstName} ${enrolledStudent.lastName}`, amount/100,orderId,paymentId)
    )
  } catch (error) {
    console.log("Error in sending mail",error);
    return res.status(500).json({
      success:false,
      message:error.message,
    })
  }
}
