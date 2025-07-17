import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About";
import OpenRoute from "./components/core/Auth/OpenRoute";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./Pages/Error";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import Setting from "./components/core/Dashboard/Setting";
import Contact from "./Pages/Contact";
import AddCourse from "./components/core/Dashboard/AddCourse";
import { useEffect } from "react";
import MyCourses from "./components/core/Dashboard/InstructorCourses/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catelog from "./Pages/Catelog";
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetailsSidebar from "./components/core/ViewCourse/VideoDetailsSidebar";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";


function App() {
  const { user } = useSelector((state) => state.profile);

  // useEffect(()=>{
  //   console.log(user.accountType);
  // },[])
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
      <Navbar />
      <div className="mt-14">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog/:catalogName" element={<Catelog /> } />
        <Route path="/courses/:courseId" element={<CourseDetails /> } />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/setting" element={<Setting />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="dashboard/cart" element={<Cart />} />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/instructor" element={<Instructor />} />

              <Route path="dashboard/my-courses" element={<MyCourses />} />

              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

      <Route element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>
      }>
        {
          user?.accountType === "Student" && (
            <>
              <Route path="view-course/course/:courseId/section/:sectionId/subSection/:subsectionId" element={<VideoDetails />}/>
            </>
          )
        }
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
