import { IconBrandLine } from "@tabler/icons-react";
import { ChartLine, Settings2 } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideBae from "../components/SideBae";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
// import SocialsPopup from "../components/SocialsPopup";

const Dashboard = () => {
  // const [socials, setSocials] = useState(null);
  // const [showPopUp, setShowPopUp] = useState(false);//initially false ie closedd

  const auth = JSON.parse(localStorage.getItem("AuthState"));

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER + "/api/v1/socials/me", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        const isEmpty =
          !data.linkedin &&
          !data.github &&
          !data.instagram &&
          !data.twitter &&
          !data.leetcode;

        // if (!data || isEmpty) {
        //   setShowPopUp(true);
        // } else {
        //   setSocials(data);
        // }
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  }, []);

  const nav = useNavigate();
  useEffect(() => {
    if (!AuthContext) {
      nav("/login");
    }
    axios
      .get(import.meta.env.VITE_SERVER + "/api/v1/dashboard/get-dashboard", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      })
      .then((data) => {
        if (!data.data.success) {
          nav("/login");
        }
      })
      .catch((err) => {
        nav("/login");
      });
  }, []);

  return (
    <>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">Coming Soon</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>In Development</span>
          </div>
          <div className="pt-6 flex flex-col items-center">
            <p className="text-gray-500 text-sm mb-3">
              Until then, you can manage your QR redirection
            </p>
            <NavLink
              to="/team/customization/qrchange"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Change QR Redirect
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </NavLink>
          </div>

          <br />
          <NavLink
            to="/team/customization/socials"
            className="group relative inline-flex items-center gap-2 px-6 py-3  text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-300 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 hover:scale-109 hover:shadow-xl"
          >
            <span className="absolute inset-0 bg-white/10 opacity-1 group-hover:opacity-200 transition duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              Add Socials
            </span>
          </NavLink>
          <br />
          <NavLink
            to="/team/leaderboard"
            className="group relative inline-flex items-center gap-2 px-6 py-3  text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-300 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 hover:scale-109 hover:shadow-xl"
          >
            <span className="absolute inset-0 bg-white/10 opacity-1 group-hover:opacity-200 transition duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              leaderboard
            </span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
