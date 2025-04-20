import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CallInfo from "./pages/CallInfo";
import Lineups from "./pages/Lineups";
import Joinings from "./pages/Joinings";
import CallDetails from "./pages/CallDetails";
import Walkins from "./pages/Walkins";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/call-info" element={<CallInfo />} />
              <Route path="/call-details" element={<CallDetails />} />
              <Route path="/lineups" element={<Lineups />} />
              <Route path="/joinings" element={<Joinings />} />
              <Route path="/walkins" element={<Walkins />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
