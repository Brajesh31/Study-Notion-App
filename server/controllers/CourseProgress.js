const courseProgress = require("../models/courseProgress");
const Subsection = require("../models/Subsection")

exports.updateCourseProgress = async(req,res)=>{
    const {courseId,subsectionId} = req.body;
    const userId = req.user.id;

    try {
        console.log("i am inside the course progress");
        if(!courseId || !subsectionId){
            return res.status(400).json({
                success:false,
                message:"Invalid details",
            })
        }

        const subSection = await Subsection.findById(subsectionId);
        if(!subSection) {
            return res.status(404).json({
                sucess:false,
                error:"Invalid subsection id"
            })
        }

        let courseprogress = await courseProgress.findOne({
            courseId:courseId,
            userId:userId,
        });

        if(!courseprogress){
            return res.status(404).json({
                success:false,
                message:"Course doesn't exists"
            })
        }else{
            if(courseprogress.completedVideos.includes(subsectionId)){
                return res.status(400).json({
                    error:"Subsection is already completed"
                })
            }

            courseprogress.completedVideos.push(subsectionId);


        }

        await courseprogress.save();
        return res.status(200).json({
            success:true,
            message:"Lecture marked as completed"

        })

    } catch (error) {
        console.log("error in course progress",error);
        return res.status(500).json({
            error:"Internal server error",
        })
    }
}