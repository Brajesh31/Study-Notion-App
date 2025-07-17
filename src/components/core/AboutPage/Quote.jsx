import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri'

const Quote = () => {
  return (
    <div className=' text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white relative'>
      <RiDoubleQuotesL className='inline absolute -top-1 -left-10'/> We are passionate about revolutionizing the way we learn. Our innovative platform {" "}
      <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold'>"combines technology</span>
      <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>
        {" "}
        expertise
      </span>
      , and community to create an 
      <span  className='bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>
      {" "}
        unparalleled educational experience.
        <RiDoubleQuotesR className='inline absolute -top-1 -right-10 text-white'  />
      </span>
    </div>
  )
}

export default Quote