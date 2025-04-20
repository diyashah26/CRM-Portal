import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaPhoneAlt, FaListAlt, FaUserCheck, FaFileAlt, FaCalendarCheck } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-full w-40 p-6 shadow-md dark:shadow-gray-900/30 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      <img
        src="https://www.infideaconsultancy.com/public/assets/images/logo.png"
        alt="Logo"
        className="h-10 mb-10"
      />
      <ul className="space-y-8">
        <li>
          <Link
            to="/"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaHome className="text-gray-600 dark:text-gray-400 text-3xl" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaUser className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/call-info"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaPhoneAlt className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Call Info</span>
          </Link>
        </li>
        <li>
          <Link
            to="/call-details"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaFileAlt className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Call Details</span>
          </Link>
        </li>
        <li>
          <Link
            to="/lineups"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaListAlt className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Lineups</span>
          </Link>
        </li>
        <li>
          <Link
            to="/joinings"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaUserCheck className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Joinings</span>
          </Link>
        </li>
        <li>
          <Link
            to="/walkins"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaCalendarCheck className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Walkins</span>
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-[#1a5d96] dark:hover:text-[#e2692c] text-lg transition-colors duration-200"
          >
            <FaCog className="text-gray-600 dark:text-gray-400 text-2xl" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
