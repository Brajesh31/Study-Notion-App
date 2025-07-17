import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { FaRegistered } from 'react-icons/fa'
import { IoCloudUploadOutline } from "react-icons/io5";

const Upload = ({title, name, label, register, errors, setValue, getValues,viewData,editData }) => {
  const [image, setImage] = useState(null);
  const { editCourse, course } = useSelector((state) => state.course);

  useEffect(()=>{
    // console.log("Edit data",editData)
    // console.log()
    if(editData){
      setImage(editData);
    }else if(viewData){
      setImage(viewData);
    }
  },[])

  const handleOnChange = (e) => {
    const file = e.target.files[0]; // Get the first file
    if (file) {
      setValue(name, file);
  
      // Check if the file is an image or a video based on the MIME type
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi"];
  
      if (validImageTypes.includes(fileType) || validVideoTypes.includes(fileType)) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImage(reader.result); // This can be used for both images and videos
        };
  
        reader.readAsDataURL(file); // Read the file as a data URL (works for both images and videos)
      } else {
        console.log("Unsupported file type. Please select an image or video.");
      }
    } else {
      console.log("No File is Selected");
    }
  };
  
  return (
    <div>
      {image ? (
        <div className="flex flex-col space-y-2">
        <>
          {image?.startsWith("data:image") || /\.(jpg|jpeg|png|gif|webp)$/i.test(image) ? (
            // Display image preview
            <div className="flex flex-row items-center justify-center w-full bg-richblack-800 py-4 rounded-lg">
  <img
    src={image}
    alt="Uploaded Media"
    className="rounded-lg object-cover max-w-[90%] max-h-[300px] w-auto h-auto"
  />
</div>

          ) : image?.startsWith("data:video") || /\.(mp4|webm|ogg)$/i.test(image) ? (
            // Display video preview
            <div className="flex flex-row items-center justify-center w-full bg-richblack-800 space-y-2 py-4 rounded-lg">

            <video
              controls
              className="h-full rounded-md object-cover w-[90%]"
            >
              <source src={image} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setValue(name, null);
            }}
            className="text-sm text-richblack-5"
          >
            Remove
          </button>
        </>
      </div>
      
      
      ) : (
        <div>
          <label htmlFor={label} className="text-sm text-richblack-5 ">
            <div>
             {title}<sup className="text-pink-200">*</sup>
            </div>

            <div className="w-full min-h-[140px] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 flex flex-col items-center gap-5">
              <div>
                <input
                  type="file"
                  id={label}
                  {...register(name, { required: true })}
                  onChange={handleOnChange}
                  className="hidden"
                />
              </div>
              <div className="aspect-square w-14 bg-richblack-900 rounded-full flex items-center justify-center">
                <IoCloudUploadOutline className="text-3xl" />
              </div>
              <div className="text-richblack-200 flex flex-col items-center justify-center gap-2">
                <p>
                  Drag and drop an image, or click to{" "}
                  <span className="font-semibold text-yellow-50">Browse</span> a
                  file
                </p>
                <p>Max 6MB each (12MB for videos)</p>
              </div>

              <ul className="mb-5 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
              </ul>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default Upload;
