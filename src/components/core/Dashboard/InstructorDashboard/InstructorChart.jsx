import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currChart, setCurrChart] = useState("student");

  // Function to generate random colors
  const getRandomColors = (numColors) => {
    return Array.from({ length: numColors }, () =>
      `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
    );
  };

  // Data for Students
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  // Data for Income
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  return (
    <div className="w-full p-6 bg-richblack-800 rounded-xl shadow-md flex flex-col gap-5 border border-richblack-700">
      {/* Title */}
      <p className="text-2xl font-semibold text-richblack-5">Visualize Data</p>

      {/* Button Toggle */}
      <div className="flex gap-4">
        <button
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
            currChart === "student"
              ? "bg-yellow-400 text-black shadow-md"
              : "bg-transparent text-yellow-300 hover:text-yellow-100"
          }`}
          onClick={() => setCurrChart("student")}
        >
          Students
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
            currChart === "income"
              ? "bg-yellow-400 text-black shadow-md"
              : "bg-transparent text-yellow-300 hover:text-yellow-100"
          }`}
          onClick={() => setCurrChart("income")}
        >
          Income
        </button>
      </div>

      {/* Chart Display */}
      <div className="w-[300px] md:w-[400px] mx-auto">
        <Pie data={currChart === "student" ? chartDataForStudents : chartDataForIncome} />
      </div>
    </div>
  );
};

export default InstructorChart;
