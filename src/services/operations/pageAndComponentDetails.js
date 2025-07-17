import toast from "react-hot-toast";
import {apiConnector} from "../apiconnector"
import {categories} from "../apis"

const {CATEGORY_PAGE_DETAILS_API} = categories;

export const getCatalogPageData = async (categoryId)=> {
    const toastId = toast.loading("Loading");
    let result = [];
    try {
        const formData = new FormData();
        formData.append("categoryId",categoryId)
        const response = await apiConnector("POST",CATEGORY_PAGE_DETAILS_API,formData);

        if(!response?.data?.success){
            throw new Error("Error in fetchhing category page details");
        }

        result = response?.data;
    } catch (error) {
        console.log("error in fetching category page details api ",error);
        toast.error(error.message);
        result = error.response?.data;

    }
    toast.dismiss(toastId);
    return result;

}