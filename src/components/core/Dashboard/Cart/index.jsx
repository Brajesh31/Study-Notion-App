import React from "react";
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

const Cart = () => {
  const { total, totalItems } = useSelector((state) => state.cart);
  return (
    <div className="text-white w-11/12 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold">My Wishlist</h1>
      <p className="text-sm mb-5 text-richblack-100">
        {" "}
        {totalItems} Courses in wishlist{" "}
      </p>
      {total > 0 ? (
        <div className="border-t py-5 border-richblack-200">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
