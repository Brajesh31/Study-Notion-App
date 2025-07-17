export default function GetAvgRating(ratingArr) {
    if (!ratingArr?.length) return 0;  // Ensure the array is not empty or undefined

    const totalRating = ratingArr.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avgRating = totalRating / ratingArr.length;

    // Round to 1 decimal place
    return Math.round(avgRating * 10) / 10;
}
