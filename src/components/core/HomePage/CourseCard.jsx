import React from "react";
import { MdOutlineGroup } from "react-icons/md";
import { TbHierarchy3 } from "react-icons/tb";

const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  return (
    <div
      className={`w-full mx-auto md:w-[30%]  ${
        currentCard === cardData.heading ? "bg-white shadow-[12px_12px_0px] shadow-[#FFD60A]" : "bg-richblack-800"
      } transition-all duration-300`  } onClick={()=>{
        setCurrentCard(cardData.heading)
        // console.log(currentCard);
      }  }
      // key={key}
    >
      <div className="flex flex-col px-3">
        <p
          className={`mt-5 mb-3 mx-5 ${
            currentCard === cardData.heading ? "text-richblack-900" : ""
          } text-3xl font-semibold`}
        >
          {cardData.heading}
        </p>
        <p
          className={`${
            currentCard === cardData.heading
              ? "text-richblack-600"
              : "text-richblack-500"
          } mb-16 mx-5`}
        >
          {cardData.description}
        </p>

        <div className={`flex justify-between font-bold py-2 mb-0 items-center border-t-2 border-dashed  ${currentCard === cardData.heading ?"text-blue-200 border-t-richblack-300 " : ""} border-collapse`}>
          <div className="flex gap-2 items-center">
            <MdOutlineGroup className="text-xl font-bold"/>
            <p>{cardData.level} </p>
          </div>
          <div className="flex gap-2 items-center">
            <TbHierarchy3 />
            <p>{cardData.lessionNumber} Lessons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
