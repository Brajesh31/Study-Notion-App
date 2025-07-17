import React from "react";

const IconButton = ({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  icon,
  customClasses,
  type,
}) => {
  return (
    <button className={`${customClasses} bg-yellow-50 px-4 py-2 rounded-md text-richblack-900`} disabled={disabled} onClick={onclick} type={type}>
      {children ? (
        <>
          <span className="w-full ">{text}</span>
          {children}
          {/* {children} */}
        </>
      ) : (
        <span>
          {text}
        </span>
        
      )}
    </button>
  );
};

export default IconButton;
