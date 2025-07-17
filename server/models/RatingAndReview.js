const mongoose =  require('mongoose');

const ratingAndReviews = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course"
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }
})


module.exports = mongoose.model("RatingAndReview", ratingAndReviews);