import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const initialState = {
   totalItems:localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")):0


};

const cartSlice = createSlice({
    name:"cart",
    initialState: initialState,
    reducers :{
        setTotalItems(state,value) {
            state.token=value.payload;
        },
        //add to cart
        //remove from cart
        //resetcart
       
    
    },

      
    
});

export const {setToken,addToCart,removeFormCart,resetCart} = cartSlice.actions;
export default cartSlice.reducer;