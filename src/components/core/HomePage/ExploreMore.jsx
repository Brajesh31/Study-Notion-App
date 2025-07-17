import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";
const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value); //
    setCurrentCard(result[0].courses[0].heading);
    setCourses(result[0].courses);
  };
  return (
    <div className="flex w-11/12 md:full flex-col justify-center items-center mb-5">
      <div className="text-4xl font-semibold ">
        Unlock the <HighlightText text={"Power of Code"} />
      </div>

      <p className="text-center text-richblack-300 text-sm text-[16px] mt-3">
        {" "}
        Learn to build anything you can imagine
      </p>

      <div
        className="flex flex-row bg-richblack-800 mb-7 justify-between px-4 border-richblack-100 py-1 rounded-full gap-1 
  overflow-x-auto w-full scrollbar-hide md:flex-wrap  md:gap-4"
      >
        {tabsName.map((element, index) => (
          <div
            className={`text-[14px] sm:text-[16px] flex flex-row items-center ${
              currentTab === element
                ? "bg-richblack-900 text-richblack-5 font-medium"
                : "text-richblack-200"
            } rounded-full transition-all duration-300 hover:bg-richblack-900 cursor-pointer hover:text-richblack-5 
        px-3 py-2 w-fit whitespace-nowrap`}
            key={index}
            onClick={() => setMyCards(element)}
          >
            {element}
          </div>
        ))}
      </div>

      <div className="lg:h-[150px] ">
        <div className="flex flex-col gap-5 md:flex-row md:gap-5 justify-between ">
          {courses.map((element, index) => {
            return (
              <CourseCard
                key={index}
                cardData={element}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreMore;
