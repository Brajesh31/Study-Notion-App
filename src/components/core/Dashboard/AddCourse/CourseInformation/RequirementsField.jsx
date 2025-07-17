import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";


const RequirementsField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const [requirements, setRequirements] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  const handleAddRequirement = () => {
    if (requirements) {
      setRequirementList([...requirementList, requirements]);
      setRequirements("");
    }
  };

  const handleRemoveRequirements = (index) => {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);

    setRequirementList(updatedRequirementList);
  };

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
    const data = getValues();
    // console.log("data",data);
    
    setRequirementList((data?.courseRequirements));
  }, []);

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList]);
  return (
    <div className="bg-richblack-700 text-white">
      <label htmlFor={name} className="text-md text-richblack-100 ">
        {label}
        <sup className="text-pink-200 ">*</sup>
      </label>
      <div className="flex flex-col items-start gap-1">
        <input
          type="text"
          id={name}
          value={requirements}
          placeholder="Enter Requirements"
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul className="flex w-[90%] flex-wrap">
          {requirementList.map((requirement, index) => (
            <li key={index} className=" flex items-center gap-1 bg-yellow-400 py-2 px-3 rounded-full w-fit m-2">
              <span className="text-richblack-5 ">{requirement}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirements(index)}
              >
                <MdOutlineCancel className="text-xl text-[#D2122E]"/>

              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequirementsField;
