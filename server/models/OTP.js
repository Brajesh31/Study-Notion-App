const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerficationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "verifaction email",
      emailTemplate(otp)
    );
    console.log("email sent successfully", mailResponse);
  } catch (error) {
    console.log("Error in sending mail ", error);
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerficationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
