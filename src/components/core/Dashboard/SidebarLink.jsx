import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
const SidebarLink = ({link,iconName}) => {
    const Icon = Icons[iconName];
    const location  = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath  ({path:route},location.pathname);
    }

  return (
    <NavLink
    to={link.path}
    // what to do on click

    className={`relative  text-sm `}
    >

        <span className={`absolute left-0 top-0 h-full  w-[0.2rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}>

        </span>
        <div className={`flex px-8 py-2 items-center gap-x-2 ${matchRoute(link.path) ? "bg-yellow-800 " : "bg-transparent"}`}>
            <Icon className="text-lg" />
            <span>{link.name}</span>
        </div>
    </NavLink>
  )
}

export default SidebarLink