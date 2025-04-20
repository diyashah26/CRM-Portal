import React from "react";
import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm dark:shadow-gray-700/20 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      
      <div className="flex items-center space-x-4 ml-auto">
        <ThemeToggle />
        <button className="bg-[#1a5d96] dark:bg-[#e2692c] text-white px-4 py-2 rounded hover:bg-[#154a7a] dark:hover:bg-[#d15a20] transition-colors duration-200">
          Login
        </button>
      </div>
    </div>
  );
}

export default Header;
