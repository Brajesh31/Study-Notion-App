import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ChipInput = ({label,name,register,errors,setValue,getValue}) => {
    const [tags,setTags] = useState([]);
    const {editCourse,course} = useSelector((state)=>state.course)

    useEffect(()=>{
        register(name,{
            required:true,
        });

        if(editCourse){
            setTags(JSON.parse(course?.tag));
            setValue(name,JSON.parse(course?.tag));
        }
    },[])
  return (
    <div>
      <label className="text-md text-richblack-100 " htmlFor={name}>{label} <sup>*</sup></label>
      <div className='flex flex-wrap gap-2 m-2'>
        {
            tags.map((tag,index)=>(
                <div className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5' key={index}>
                    <span className='text-richblack-5'>{tag}</span>
                    <button type='button' className='ml-2 text-richblack-5' onClick={()=>{
                        const updatedTag = [...tags];
                        updatedTag.splice(index,1);
                        setTags(updatedTag);
                        setValue(name,updatedTag);
                    }}
                    ><FaTimes/></button>
                </div>
            ))
        }
      </div>

      <input type="text" id={name} 
      placeholder='Press Enter or , to add a tag'
      onKeyDown={(e) => {
        if(e.key === 'Enter' || e.key === ','){
            e.preventDefault();
            if(e.target.value){
                setTags([...tags,e.target.value]);
                setValue(name,[...tags,e.target.value])
                e.target.value = "";
            }
        }
      }}
      className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
      
      />
      {
        errors[name] && <span>Tags are required</span>
      }
    </div>
  )
}

export default ChipInput
