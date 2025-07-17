import React from "react";
import { FaEarthAsia } from "react-icons/fa6";
import { IoIosCall, IoMdChatbubbles } from "react-icons/io";
import ContactUsForm from "../components/common/ContactPage.jsx/ContactUsForm";
import Footer from "../components/common/Footer";

const Contact = () => {
  return (
    <div>
    <div className="text-white mt-14 mx-auto mb-10">
      <div className="flex max-w-maxContent mx-auto gap-10">
        <div className=" flex flex-col gap-10 justify-center bg-richblack-700 w-[30%] h-fit p-5 rounded-lg outline-1 outline-richblack-100 border-1 border-richblack-200  ">
          <div className="">
            <div className="flex gap-3">
              {/* icon */}
              <IoMdChatbubbles className="text-richblack-100" />

              {/* text */}
              <div>
                <h2>Chat on Us</h2>
                <p className="text-richblack-100 text-sm">
                  Our friendly team is here to help.
                </p>
                <p className="text-richblack-100 text-sm">support@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex gap-3">
              {/* icon */}
              <FaEarthAsia />

              {/* text */}
              <div>
                <h2>Visit Us</h2>
                <p className="text-richblack-100 text-sm">
                  Come and say hello at our office HQ.
                </p>
                <p className="text-richblack-100 text-sm">
                  Here is the location/ address
                </p>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex gap-3">
              {/* icon */}
              <IoIosCall />

              {/* text */}
              <div>
                <h2>Call Us</h2>
                <p className="text-richblack-100 text-sm">
                  Mon - Fri From 8am to 5pm
                </p>
                <p className="text-richblack-100 text-sm">+91 9973316633</p>
              </div>
            </div>
          </div>
          <div></div>
        </div>

        <div className="border-[1px] border-richblack-200 w-[50%] p-10 rounded-lg bg-richblack-700">
          <div>
            <h1 className="text-4xl text-richblack-5">Got a Idea? We've got the skills. Let's team up</h1>

            <p className="text-richblack-100 ">Tall us more about yourself and what you're got in mind.</p>
          </div>
          <ContactUsForm />
        </div>
      </div>

    </div>
      <Footer />

    </div>
  );
};

export default Contact;
