const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req
    const { email } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    //check uniqness
    const result = await OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };

    //create entry for otp
    const otpBody = await OTP.create(otpPayload);
    // console.log(otpBody);

    // return response
    res.status(200).json({
      success: true,
      meassage: "OTP sent successfully",
      // otp,
    });
  } catch (error) {
    console.log("Error in generating opt", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup
exports.signUp = async (req, res) => {
  try {
    //fetch details
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      // contactNumber,
      otp,
    } = req.body;
    console.log("req.bodY",req.body);

    //validations
    if (
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !email ||
      // !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please fill all details",
      });
    }

    //pass and confirm pass same or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password should be same ",
      });
    }

    //check for existinig user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exits",
      });
    }

    //find most recent otp
    // const recentOtp = await OTP.find({ email })
    //   .sort({ createdAt: -1 })
      // .limit(1);

      const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    //validate otp
    console.log(recentOtp)
    // console.log(otp);
    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        meassage: "Enter correct Otp",
      });
    }

    //Hash password
    const hashedPassord = await bcrypt.hash(password, 10);

    //entry in db

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      // contactNumber,
      password: hashedPassord,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error in signup process", error);

    return res.status(500).json({
      success: false,
      message: "User cannot be registered. please try again",
    });
  }

  //
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check user exists or not
    const existingUser = await User.findOne({ email }).populate("additionalDetails");

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Use not found",
      });
    }

    //generated jwt , after passord match
    const payload = {
      email: existingUser.email,
      id: existingUser._id,
      accountType: existingUser.accountType,
    };
    // console.log(password);
    // console.log(existingUser.password);
    if (await bcrypt.compare(password, existingUser.password)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      //create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user:existingUser,
        message: "Logged in succesfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        meassage: "Password didn't match",
      });
    }
  } catch (error) {
    console.log("Error while logging in", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// change pass
exports.changePassword = async (req, res) => {
  try {
    // console.log("entered backend")
    const { password, newPassword } = req.body;
    const userId = req.user.id;

    if (!password || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details",
      });
    }

    // if (newPassword !== confirmNewPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "New password and confirm password do not match",
    //   });
    // }
    const userDetails = await User.findById(userId);

    if(!userDetails){
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const passMatch = await bcrypt.compare(password, userDetails.password);

    if(!passMatch){
      return res.status(403).json({
        success:false,
        message:"Password did'nt mathced",
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDetails.password = hashedPassword;
    // console.log("after hashing of password")
    await userDetails.save();
    return res.status(200).json({
      success: true,
      
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
