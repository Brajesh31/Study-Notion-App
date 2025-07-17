import React from "react";

const stats = [
  { count: "5k", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Coures" },
  { count: "50+", label: "Awards" },
];
const StatsComponent = () => {
  return (
    <section >
      <div className="h-[300px] flex justify-center items-center bg-richblack-800">
        <div className="flex gap-x-4">
          {stats.map((data, index) => {
            return (
              <div key={index} className="w-64 flex flex-col justify-center items-center gap-y-3  ">
                <h1 className="text-4xl font-semibold">{data.count}</h1>
                <h2 className="text-richblack-300 font-semibold">{data.label}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsComponent;
