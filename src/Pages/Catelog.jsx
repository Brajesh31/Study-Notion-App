import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { getCatalogPageData } from "../services/operations/pageAndComponentDetails";
import { fetchCourseCategory } from "../services/operations/courseDetailsAPI";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import CourseCard from "../components/core/Catalog/CourseCard";

const Catelog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchCourseCategory();
        console.log("response", response);

        const matchingCategory = response?.find(
          (ct) =>
            ct.name.split(" ").join("-").toLowerCase() ===
            catalogName.toLowerCase()
        );

        if (matchingCategory) {
          setCategoryId(matchingCategory._id);
        } else {
          console.warn("No matching category found for:", catalogName);
          setCategoryId(""); // Set to empty string to prevent invalid queries
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    getCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        if (!categoryId) {
          console.warn("Category id is not set or invalid");
          return;
        }
        const res = await getCatalogPageData(categoryId);
        console.log("res", res);
        // console.log("abc", res?.selectedCourses[0]?.name);
        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getCategoryDetails();
  }, [categoryId]);

  return (
    <div >
      {loading ? (
        <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center">
          <div className="loader"></div>

        </div>
      ) : (
        <div className="text-white  mx-auto">
          <div className="w-full bg-richblack-800">
          <div className=" py-10 w-11/12 mx-auto ">
            {/* route */}
            <p className="text-richblack-100 mb-4">
              {`Home / Catalog / `}
              <span className="text-yellow-50">{catalogPageData?.selectedCategory?.name}</span>
            </p>
            {/* name */}
            <p className="text-3xl font-semibold text-richblack-5 mb-4">{catalogPageData?.selectedCategory?.name}</p>
            {/* description */}
            <p className="text-richblack-100 ">{catalogPageData?.selectedCategory?.description}</p>
          </div>
          </div>
          

          <div className="w-11/12 mx-auto ">
            {/* section 1 */}
            <div className="my-10">
              <div className="text-3xl font-semibold text-richblack-5 mb-4">Courses to get you started</div>
              <div className="flex gap-x-3 w-full border-b mb-8">
                <p className="border-b-2 border-yellow-50 px-3 py-1">Most Popular </p>
                <p>New </p>
              </div>
              <div >
                <CourseSlider courses={catalogPageData?.selectedCourses} />
              </div>
            </div>

            {/* section 2 */}
            <div className="my-10">
              <div  className="text-3xl font-semibold text-richblack-5 mb-4">
                Top courses in {catalogPageData?.selectedCategory?.name}
              </div>

              <div>
                <CourseSlider courses={catalogPageData?.differentCourses} />
              </div>
            </div>

            {/* section 3 */}
            <div  className="text-3xl font-semibold text-richblack-5 mb-4">
              <p>Frequently bought courses</p>
              <div className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 ">
                  {catalogPageData?.mostSellingCourses
                    ?.slice(0, 4)
                    .map((course, index) => (
                      <CourseCard course={course} key={index} />
                    ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Catelog;
