import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfimationModal from "../../common/ConfimationModal";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  if (profileLoading || authLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="text-white relative h-[calc(100vh-3.5rem)] border-r-richblack-700 z-[100]">
      <div className="">
        <button
          className={` text-richblack-25 text-2xl absolute  mt-2 z-[100] ${!menuOpen ? "left-4" : "right-4"} transition-all duration-300 `}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className={`${!menuOpen ? "hidden opacity-0 bg-richblack-800":" flex opacity-100"}   flex-col min-w-[222px] py-10 transition-all duration-300`}>
          <div className="flex flex-col ">
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;

              return (
                <SidebarLink link={link} iconName={link.icon} key={link.id} />
              );
            })}
          </div>

          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600"></div>

          <div className="flex flex-col">
            <SidebarLink
              link={{ name: "Settings", path: "dashboard/setting" }}
              iconName={"VscSettingsGear"}
            />

            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are You Sure ?",
                  text2: "You will be logged out of your account",
                  btn1Text: "Logout",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(logout(navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className="text-sm  font-medium text-richblack-5  flex "
            >
              <div className="flex items-center gap-3 justify-center px-8 py-2 text-sm ">
                <VscSignOut className="text-lg" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfimationModal modalData={confirmationModal} />}
    </div>
  );
};

export default Sidebar;
