import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from "../../../common/IconButton"
import { useNavigate } from 'react-router-dom';
import {buyCourse} from "../../../../services/operations/StudentFeaturesAPI"

const RenderTotalAmount = () => {
    const {total,cart} = useSelector((state) => state.cart);
    const {token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = ()=>{
        const courses = cart.map((course) => course._id)
        console.log("Bought these courses: ",courses);
        buyCourse(token, courses,user,navigate,dispatch);
        //TODO:Api integrate krna h
    }
    return (
    <div className='relative w-[250px] flex flex-col gap-3 bg-richblack-800 p-4'>
      <p className='text-richblack-100'>Total:</p>
      <p className='text-yellow-50 text-3xl '>Rs. {total - ((10/100) * total)}</p>
      <p className='text-richblack-100 line-through'>Rs {total}</p>

      <IconButton
      text="Buy Now"
      onclick={handleBuyCourse}
      customClasses="w-full h-[50px] bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300"
      />
      
    </div>
  )
}

export default RenderTotalAmount
