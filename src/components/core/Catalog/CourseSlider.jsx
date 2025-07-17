import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Autoplay, Pagination, Navigation, FreeMode } from "swiper/modules";

import CourseCard from "./CourseCard";

const CourseSlider = ({ courses }) => {
  let length = courses?.length;

  if (length > 3) length = 3;

  return (
    <>
      {courses?.length ? (
        <Swiper
          spaceBetween={30}
          // centeredSlides={true}
          freeMode={true}
          // slidesPerView={3}
          breakpoints={{
            320: { slidesPerView: 1 }, // For small screens
            640: { slidesPerView: 2 }, // Medium screens
            1024: { slidesPerView: 3 }, // Large screens
            // 1280: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          // navigation={true}
          modules={[Autoplay, Pagination, FreeMode]}
          className="mySwiper  text-white"
        >
          {courses?.map((course, index) => (
            <SwiperSlide key={index}>
              <CourseCard course={course} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No course Found</p>
      )}
    </>
  );
};

export default CourseSlider;