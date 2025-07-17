import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { ratingEndpoints } from "../apis";

const {REVIEWS_DETAILS_API} = ratingEndpoints;

export const getAllRating = async() => {
    let result = [];
    try {
        console.log(REVIEWS_DETAILS_API);
        const res = await apiConnector("GET",REVIEWS_DETAILS_API);
        if(!res.data.success){
            throw new Error("Error while fetching reviews");

        }

        console.log("GEt reviews api response...",res);

        result = res.data.data;
    } catch (error) {
        console.log("Error in fetching reviews...",error);

    }

    return result;

}