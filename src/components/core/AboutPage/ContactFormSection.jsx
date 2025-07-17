import React from 'react'
import ContactUsForm from '../../common/ContactPage.jsx/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto flex flex-col gap-5'>
      <div className='flex flex-col gap-3'>

        <h1 className='text-center text-4xl font-semibold text-richblack-5 '>Get in Touch </h1>
        <p className='text-[16px] text-richblack-300 font-semibold'>We'd love to here for you, Please fill out this form.</p>
      </div>
      
      <div>
        <ContactUsForm/>
      </div>
    </div>
  )
}

export default ContactFormSection
