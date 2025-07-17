import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../Assets/Images/Know_your_progress.png"
import Compare_with_others from "../../../Assets/Images/Compare_with_others.png"
import Plan_your_lessons from "../../../Assets/Images/Plan_your_lessons.png"
import CTAButton from './Button'
const LearningLanguageSection = () => {
  return (
    <div className=' mt-20 mb-32'>
    <div className='flex flex-col gap-5 mt-20 items-center'>
        <div className='text-4xl font-semibold '>
          Your swiss knife for <HighlightText text={"learning any language "}/>
        </div>
        <div className=' text-richblack-600 mx-auto text-base mt-3 font-medium w-full md:w-[70%]'>
          Using spin making learning multiple languages easy. with 20+ langauges realist voice-over progress tracking, custom schedule and more.
        </div>


        <div className='flex flex-col md:flex-row items-center justify-center mt-5'>
            <img src={know_your_progress} alt="know_your_progress" className='object-contain md:-mr-32' />
            <img src={Compare_with_others} alt="Compare_with_others" className='object-contain' />
            <img src={Plan_your_lessons} alt="Plan_your_lessons" className='object-contain md:-ml-36' />
        </div>
        <div className='w-fit'>
          <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
        </div>
    </div>
  </div>
  )
}

export default LearningLanguageSection
