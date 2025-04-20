import React from "react";
import { Briefcase, PhoneCall, Users, CheckCircle, Clock } from "lucide-react";
import "./flipcard.css";

const iconMap = {
  "Total Calls": <PhoneCall size={28} />,
  "Total Lineups": <Users size={28} />,
  Joinings: <Briefcase size={28} />,
  Selections: <CheckCircle size={28} />,
  "Time Spent": <Clock size={28} />,
};

function FlipCard({ title, data }) {
  return (
    <div className="flip-card w-full aspect-square">
      <div className="flip-card-inner">
        <div className="flip-card-front bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col justify-center items-center p-4 space-y-4 h-full">
            <div className="icon text-[#1a5d96] dark:text-[#e2692c]">
              {iconMap[title] || <Briefcase size={28} />}
            </div>
            <h2 className="text-xl font-semibold text-center">{title}</h2>
            <p className="text-3xl font-bold">{data}</p>
          </div>
        </div>
        <div className="flip-card-back bg-[#1a5d96] dark:bg-[#e2692c] text-white">
          <div className="flex flex-col justify-center items-center p-4 space-y-3 h-full">
            <h3 className="text-lg font-medium">Details</h3>
            <p className="text-sm text-center">More information about {title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
