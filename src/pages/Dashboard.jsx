import React from "react";
import FlipCard from "../components/Flipcard";
import SmallCard from "../components/SmallCard";

function Dashboard() {
  return (
    <div className="p-6 space-y-20 min-h-screen  transition-all">
      {/* Dashboard Overview */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-[#1a5d96] dark:text-[#e2692c] text-center">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <FlipCard title="Total Calls" data="120" />
          <FlipCard title="Total Lineups" data="85" />
          <FlipCard title="Joinings" data="32" />
          <FlipCard title="Selections" data="14" />
          <FlipCard title="Time Spent" data="48h" />
        </div>
      </section>

      {/* Today's Overview */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-[#1a5d96] dark:text-[#e2692c] text-center">
          Today's Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <SmallCard label="Calls" data="100" />
          <SmallCard label="Lineups" data="150" />
          <SmallCard label="New Joinings" data="100" />
          <SmallCard label="New Selections" data="100" />
          <SmallCard label="Time Spent" data="100" />
        </div>
      </section>

      {/* Representation */}
      <section>
        <h1 className="text-4xl font-bold text-[#1a5d96] dark:text-[#e2692c] text-center">
          Representation
        </h1>
        {/* Add your charts, graphs or other components here */}
        <img
          src="https://www.splashlearn.com/math-vocabulary/wp-content/uploads/2022/05/graphs-3-01.png"
          alt="graph" className="mt-10 w-full h-full rounded-lg shadow-lg"
        />
      </section>
    </div>
  );
}

export default Dashboard;
