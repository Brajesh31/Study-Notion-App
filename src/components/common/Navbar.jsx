import React, { useEffect, useRef, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import logo from "../../Assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { FaAngleDown } from "react-icons/fa6";
import { FaCartArrowDown } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import useOnClickOutside from "../../hooks/useOnClickOutside";
const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();

  const [sublinks, setSublinks] = useState([]);

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log(result);
      setSublinks(result.data.data);
      // console.log(sublinks);
    } catch (error) {
      console.log("could not fetch the category list");
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, [token, user]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const ref = useRef(null);
  useOnClickOutside(ref,()=>setMenuOpen(false));

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className=" fixed top-0 left-0 right-0 z-[999] flex h-14  items-center justify-center border-b border-b-richblack-700 bg-richblack-900">
      <div className="flex flex-row w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" width={160} height={162} loading="lazy" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-richblack-25 text-2xl "
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Nav Links */}
        <nav
          className={`absolute px-2 top-full right-0 w-[250px]  ${menuOpen ? "h-[calc(100vh-3.5rem)]" : "h-14"} bg-richblack-600 z-[999] flex flex-col-reverse items-center justify-end py-5 lg:flex lg:flex-row lg:static lg:w-auto lg:bg-transparent transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          } lg:block`}
          ref={ref}
        >
          <ul className="flex flex-col gap-8  px-3 rounded-lg  lg:bg-transparent items-center lg:flex-row lg:gap-x-6 lg:gap-y-0 text-richblack-25  z-[999] w-fit">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="relative group border-yellow-5">
                {link.title === "Catalog" ? (
                  <div
                    className="flex  flex-row-reverse   items-center gap-2 px-3  text-white cursor-pointer transition-all duration-300 hover:text-richblack-50"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <p className="font-semibold">{link.title}</p>
                    <FaAngleDown className="transition-transform duration-300 group-hover:rotate-180" />
                    <div
                      className={`absolute -left-0  -translate-x-full  lg:left-0
                         top-0
                         
                          lg:top-full lg:translate-x-1 mt-2 w-[120px] lg:w-[150px] bg-richblack-5 text-richblack-900 rounded-lg shadow-lg  transition-all duration-300 
                          invisible group-hover:visible group-hover:opacity-100
                          group-hover:flex flex-col gap-1  group-hover:z-[999]`}
                    >
                      {sublinks.length ? (
                        sublinks.map((sublink, index) => (
                          <Link
                            to={`/catalog/${sublink?.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            key={index}
                            className="block h-fit px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-richblack-50 "
                          >
                            {sublink.name}
                          </Link>
                        ))
                      ) : (
                        <div className="p-2 h-fit text-center text-sm">
                          No categories
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link?.path}
                    className="px-3 flex text-white transition-all duration-300 hover:text-richblack-50"
                  >
                    <p className={`font-semibold ${location.pathname.endsWith(link.path) ? "text-yellow-50 " : "text-richblack-5"} transition-colors duration-300`}>{link.title}</p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        <div className={` flex flex-col gap-4 lg:flex-row lg:gap-x-4 lg:items-center`}>
          {user && user.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative text-richblack-900">
              <FaCartArrowDown size={24} className="text-richblack-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.5rem] h-[1.5rem] flex items-center justify-center rounded-full bg-red-600 text-yellow-50 text-xs font-semibold animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <>
              <Link to="/login">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropDown />
          )}
        </div>
        </nav>
          
        {/* Login / Signup / Dashboard */}
        
      </div>

        <div className={`${menuOpen ? "fixed top-14 left-0  backdrop-blur-sm inset-0 z-[900] transition-all duration-300" : "hidden" } lg:hidden`}></div>
    </div>
  );
};

export default Navbar;