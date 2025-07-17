import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";

import rzpLogo from "../../Assets/Images/rzp.png"
import { useSelector } from "react-redux";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice"
const { StudentEndpoints } = require("../apis");

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = StudentEndpoints;

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src;

        script.onload= () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch){
    const toastId = toast.loading("Loading...")
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("RazorPay SDK failed to load")
            return ;
        }

        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,{courses}, {
            
            Authorization: `Bearer ${token}`
        })
        console.log("order response...",orderResponse)

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }
        console.log("response.data",orderResponse.data)
        // console.log("response.data.data",orderResponse.data.data)


        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.currency,
            amount: `${orderResponse.data.amount}`,
            order_id: orderResponse.data.orderId,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            image: rzpLogo,
            prefil: {
                name:`${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response){
                sendPaymentSuccessEmail(response,orderResponse.data.amount,token);

                verifyPayment({...response,courses},token,navigate,dispatch )
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("Payment.failed",function(response){
            toast.error("oops, payment failed")
            console.log(response);

        })
    } catch (error) {
        console.log("Payment api error...",error)
        toast.error("Could not make payement")
    }

    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount,token){
    try {
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API , {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
            token
        },{
            
            Authorization: `Bearer ${token}`
        })
    } catch (error) {
        console.log("error in  payment mail sender api",error);
        toast.error(error.message);
    }
}

async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId = toast.loading("Verifying Payment")

    dispatch(setPaymentLoading(true))

    try {
        const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Payment Successfull , you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());

    } catch (error) {
        console.log("Payment verification api error...",error);
        toast.error(error.message);
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}