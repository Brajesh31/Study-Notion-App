import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return <div className="loader"></div>;
  }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] gap-5">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] overflow-auto border-2 w-full">
        <div className="mx-auto">
          <Outlet />
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
