const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async(file,folder,height,qulity)=>{
    const options = {folder}
    if(height){
        options.height= height;
    }
    if(qulity){
        options.qulity = qulity;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options)
}