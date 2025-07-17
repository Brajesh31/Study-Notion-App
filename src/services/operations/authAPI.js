import {toast} from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { setUser } from "../../slices/profileSlice";
import { setLoading, setToken } from "../../slices/authSlice";
import { endpoints } from "../apis";
import { resetCart } from "../../slices/cartSlice";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  CHANGE_PASSWORD_API
} = endpoints

export function login(email, password, navigate) {
  
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("Login api response...",response)

      if(!response.data.success){
        
        if(response.data.data){
          toast.error(response.data.message);

        }else{
          throw new Error(response.data.message);
        }
      }

      toast.success("Login Successfull");
      dispatch(setToken(response.data.token));
      console.log(response.data.token);
      const userImage = response.data?.user?.image?  response.data?.user?.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({...response.data.user,image:userImage}))
      localStorage.setItem("token",JSON.stringify(response.data.token))
      localStorage.setItem("user",JSON.stringify(response.data.user))
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("Login api error...",error);
      toast.error(error.message);
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId)
  };
}

export function sendOTP(email,navigate){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST",SENDOTP_API,{email,checkUserPresent:true})
      console.log("opt api response...",response);

      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("OTP sent on your email ");
      navigate("/verify-email");
    } catch (error) {
      console.log("Send otp api error...",error);
      toast.error(error?.response?.data?.message)
    }
    dispatch(setLoading(false));
  }
}

export function signup (accountType,firstName,lastName,email,password,confirmPassword,otp,navigate){
  return async (dispatch)=>{
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST",SIGNUP_API,{
        accountType,firstName,lastName,email,password,confirmPassword,otp,
      })

      console.log("Signup Api response...",response);
      if(!response.data.success){
        throw new Error(response.data.message);
      }

      toast.success("Signup successfull");
      navigate("/login")


    } catch (error) {
      console.log("Signup Api error...", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

export function getPasswordResetToken(email,setEmailSent){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST",RESETPASSTOKEN_API,{email});
      console.log("reset password token response...",response);
      if(!response.data.success){
        throw new Error (response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);

    } catch (error) {
      dispatch(setLoading(false));
      console.log("Reset password token error...",error)
      toast.error(error.message)
    }

    dispatch(setLoading(false));
  }
}

export function resetPassword(password,confirmPassword,token){
  return async(dispatch)=>{
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token})

      console.log("Reset password response...",response);

      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Password has been reset successfully")
    } catch (error) {
      console.log("error in reseting password...",error.message)
      toast.error("Error in reseting password");
    }
    dispatch(setLoading(false))
  }
}

export async function changepassword(token,formData){
  const toastId = toast.loading("Updating Password...")
  try {
    const {password,newPassword} = formData;
    const response = await apiConnector("PUT",CHANGE_PASSWORD_API,{password,newPassword} ,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if(!response.data.success){
      throw new Error(response.data.message);
    }else{
      toast.dismiss(toastId);
      toast.success("Password Updated");

    }

    
  } catch (error) {
    console.log(error.message);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
}

export function logout(navigate){
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/");
    
  }
}

