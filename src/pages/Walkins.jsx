import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaFilter, FaEdit, FaEye, FaTimesCircle, FaSave, FaTimes } from "react-icons/fa";
import { MdClear, MdPerson, MdPhone, MdAccessTime, MdNotes } from "react-icons/md";

function Walkins() {
  const navigate = useNavigate();
  const [walkins, setWalkins] = useState([]);
  const [filteredWalkins, setFilteredWalkins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    date: ""
  });
  // Add state for walkin form modal
  const [showWalkinForm, setShowWalkinForm] = useState(false);
  const [selectedWalkin, setSelectedWalkin] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [newWalkin, setNewWalkin] = useState({
    candidateName: "",
    contactNumber: "",
    walkinDate: "",
    status: "pending",
    summary: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [dateFilterType, setDateFilterType] = useState("day");
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);

  // Function to load walkins from localStorage
  useEffect(() => {
    const loadWalkins = () => {
      const savedWalkins = localStorage.getItem("walkins");
      
      if (savedWalkins) {
        try {
          const parsedWalkins = JSON.parse(savedWalkins);
          // Sort walkins by id in descending order (newest first)
          const sortedWalkins = parsedWalkins.sort((a, b) => b.id - a.id);
          setWalkins(sortedWalkins);
          setFilteredWalkins(sortedWalkins);
        } catch (error) {
          console.error("Error parsing saved walkins:", error);
          setWalkins([]);
          setFilteredWalkins([]);
        }
      } else {
        setWalkins([]);
        setFilteredWalkins([]);
      }
    };

    loadWalkins();
  }, []);

  // Check for user's preferred theme and watch for changes
  useEffect(() => {
    // Initial theme setup
    const updateThemeState = () => {
      const isDark = localStorage.theme === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
    };

    // Update on mount
    updateThemeState();

    // Listen for theme changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        updateThemeState();
      } else if (e.key === "walkins") {
        const updatedWalkins = JSON.parse(e.newValue || "[]");
        setWalkins(updatedWalkins);
        applyFilters(updatedWalkins, searchTerm, filters);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Additional event listener for theme changes from other components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          updateThemeState();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, [filters, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(walkins, term, filters);
  };

  // Apply filters to walkins with date range
  const applyFilters = (data, term, filterCriteria) => {
    let result = [...data];

    // Apply search term filtering
    if (term) {
      result = result.filter(
        (walkin) =>
          walkin.candidateName.toLowerCase().includes(term.toLowerCase()) ||
          walkin.contactNumber.includes(term)
      );
    }

    // Apply status filter
    if (filterCriteria.status) {
      result = result.filter((walkin) => walkin.status === filterCriteria.status);
    }
    
    // Date range filtering
    if (dateRangeStart && dateRangeEnd && result.length > 0) {
      result = result.filter(walkin => {
        if (!walkin.walkinDate) return false;
        
        const walkinDate = new Date(walkin.walkinDate);
        let startDate, endDate;
        
        if (dateFilterType === 'day') {
          startDate = new Date(dateRangeStart);
          endDate = new Date(dateRangeEnd);
          endDate.setHours(23, 59, 59, 999);
        } else if (dateFilterType === 'month') {
          const [startYear, startMonth] = dateRangeStart.split('-');
          const [endYear, endMonth] = dateRangeEnd.split('-');
          
          startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);
          endDate = new Date(parseInt(endYear), parseInt(endMonth), 0, 23, 59, 59, 999);
        } else { // year
          startDate = new Date(parseInt(dateRangeStart), 0, 1);
          endDate = new Date(parseInt(dateRangeEnd), 11, 31, 23, 59, 59, 999);
        }
        
        return walkinDate >= startDate && walkinDate <= endDate;
      });
    }

    setFilteredWalkins(result);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    applyFilters(walkins, searchTerm, updatedFilters);
  };

  // Watch for date range filter changes
  useEffect(() => {
    applyFilters(walkins, searchTerm, filters);
  }, [dateRangeStart, dateRangeEnd, dateFilterType]);
  
  // Watch for search term changes 
  useEffect(() => {
    applyFilters(walkins, searchTerm, filters);
  }, [searchTerm]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: ""
    });
    setDateRangeStart("");
    setDateRangeEnd("");
    setSearchTerm("");
    applyFilters(walkins, "", { status: "" });
  };

  // Navigate to CallInfo to add a new walkin
  const navigateToAddWalkin = () => {
    navigate("/call-info?walkin=true");
  };

  // Open the walkin form modal
  const openWalkinForm = () => {
    setSelectedWalkin(null);
    setViewMode(false);
    setNewWalkin({
      candidateName: "",
      contactNumber: "",
      walkinDate: "",
      status: "pending",
      summary: ""
    });
    setPhoneError("");
    setShowWalkinForm(true);
  };

  // Handle form input changes
  const handleWalkinInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate phone number length
    if (name === "contactNumber") {
      if (value.length > 0 && value.length !== 10) {
        setPhoneError(`Phone number must be 10 digits. Current: ${value.length}`);
      } else {
        setPhoneError("");
      }
    }
    
    setNewWalkin({ ...newWalkin, [name]: value });
  };

  // Save new walkin
  const saveWalkin = () => {
    // Validate form
    if (!newWalkin.candidateName || !newWalkin.contactNumber || !newWalkin.walkinDate) {
      alert("Please fill all required fields");
      return;
    }
    
    if (newWalkin.contactNumber.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }
    
    // Get existing walkins
    const existingWalkins = [...walkins];
    
    // Create new walkin object
    const walkinData = {
      id: selectedWalkin ? selectedWalkin.id : Date.now(),
      candidateName: newWalkin.candidateName,
      contactNumber: newWalkin.contactNumber,
      walkinDate: newWalkin.walkinDate,
      status: newWalkin.status,
      summary: newWalkin.summary
    };
    
    if (selectedWalkin) {
      // Edit existing walkin
      const updatedWalkins = existingWalkins.map(walkin =>
        walkin.id === selectedWalkin.id ? walkinData : walkin
      );
      setWalkins(updatedWalkins);
      localStorage.setItem("walkins", JSON.stringify(updatedWalkins));
    } else {
      // Add new walkin
      existingWalkins.unshift(walkinData);
      setWalkins(existingWalkins);
      localStorage.setItem("walkins", JSON.stringify(existingWalkins));
    }
    
    // Close modal and update filtered walkins
    setShowWalkinForm(false);
    applyFilters(existingWalkins, searchTerm, filters);
  };

  // View walkin details
  const viewWalkin = (walkin) => {
    setSelectedWalkin(walkin);
    setViewMode(true);
    setShowViewModal(true);
  };

  // Edit walkin
  const editWalkin = (walkin) => {
    setSelectedWalkin(walkin);
    setNewWalkin({
      candidateName: walkin.candidateName,
      contactNumber: walkin.contactNumber,
      walkinDate: walkin.walkinDate,
      status: walkin.status || "",
      summary: walkin.summary || ""
    });
    setViewMode(false);
    setShowWalkinForm(true);
  };

  // Get appropriate CSS class for status color
  const getStatusColorClass = (status) => {
    switch (status) {
      case "walkedin":
        return darkMode
          ? "bg-green-900 text-green-300"
          : "bg-green-100 text-green-800";
      case "did_not_come":
        return darkMode
          ? "bg-red-900 text-red-300"
          : "bg-red-100 text-red-800";
      default:
        return darkMode
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-800";
    }
  };

  // Get display value for status
  const getStatusDisplay = (status) => {
    switch (status) {
      case "walkedin":
        return "Walked in at Infidea";
      case "did_not_come":
        return "Did not come";
      default:
        return "Pending";
    }
  };

  // Cancel form
  const handleCancel = () => {
    setShowWalkinForm(false);
    setShowViewModal(false);
    setNewWalkin({
      candidateName: "",
      contactNumber: "",
      walkinDate: "",
      status: "pending",
      summary: ""
    });
    setPhoneError("");
    setSelectedWalkin(null);
    setViewMode(false);
  };

  // Get current walkins for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWalkins = filteredWalkins.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // View Modal Component
  const ViewWalkinModal = () => {
    if (!selectedWalkin) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className={`relative max-w-2xl mx-auto p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full m-4`}>
          <button 
            onClick={() => setShowViewModal(false)} 
            className={`absolute top-4 right-4 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
            Candidate Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
                Basic Information
              </h3>
              <dl className="space-y-2">
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedWalkin.candidateName}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact Number</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedWalkin.contactNumber}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
                Walkin Details
              </h3>
              <dl className="space-y-2">
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Walkin Date</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedWalkin.walkinDate ? 
                      new Date(selectedWalkin.walkinDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 
                      "Not specified"
                    }
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</dt>
                  <dd className="mt-1">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColorClass(selectedWalkin.status)}`}>
                      {getStatusDisplay(selectedWalkin.status)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {selectedWalkin.summary && (
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
                Summary
              </h3>
              <p className={`text-base ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {selectedWalkin.summary}
              </p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                editWalkin(selectedWalkin);
                setShowViewModal(false);
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode 
                  ? 'bg-[#e2692c] hover:bg-[#d15a20] text-white' 
                  : 'bg-[#1a5d96] hover:bg-[#154a7a] text-white'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowViewModal(false)}
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredWalkins.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    
    // Reset to first page when filters change
    useEffect(() => {
      setCurrentPage(1);
    }, [filters, searchTerm]);
    
    if (pageNumbers.length <= 1) return null;
    
    return (
      <nav className="mt-4">
        <ul className="flex justify-center space-x-1">
          <li>
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                darkMode
                  ? currentPage === 1 ? "bg-gray-700 text-gray-400" : "bg-gray-600 hover:bg-gray-500 text-white"
                  : currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-gray-300 hover:bg-gray-400 text-gray-700"
              } transition duration-150 ease-in-out`}
            >
              Prev
            </button>
          </li>
          {pageNumbers.map(number => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number
                    ? darkMode
                      ? "bg-[#e2692c] text-white"
                      : "bg-[#1a5d96] text-white"
                    : darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } transition duration-150 ease-in-out`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
              className={`px-3 py-1 rounded-md ${
                darkMode
                  ? currentPage === pageNumbers.length ? "bg-gray-700 text-gray-400" : "bg-gray-600 hover:bg-gray-500 text-white"
                  : currentPage === pageNumbers.length ? "bg-gray-200 text-gray-400" : "bg-gray-300 hover:bg-gray-400 text-gray-700"
              } transition duration-150 ease-in-out`}
            >
              Next
            </button>
          </li>
        </ul>
        <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredWalkins.length)} of {filteredWalkins.length} items
        </div>
      </nav>
    );
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} rounded-xl shadow-md transition-colors duration-200`}>
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold mb-6">Walkins</h1>

        {/* Search and Actions Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-4 sm:mb-0">
          {/* Search Bar */}
          <div className={`relative flex-grow max-w-md ${darkMode ? 'text-white' : 'text-gray-600'}`}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or phone number..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 placeholder-gray-400 text-white' 
                  : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900'
              } border focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  applyFilters(walkins, "", filters);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <MdClear className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Add New Walkin Button */}
          <button
            onClick={openWalkinForm}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-white ${
              darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'
            } shadow-md transition-colors duration-200`}
          >
            <FaPlus className="mr-2" />
            <span>Add New Walkin</span>
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              darkMode 
                ? (showFilters ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white')
                : (showFilters ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800')
            } shadow-md transition-colors duration-200`}
          >
            <FaFilter className="mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className={`p-4 mb-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-200`}>
            <div className="flex flex-nowrap items-end gap-3 overflow-x-auto pb-2">
              <div className="flex-none min-w-[150px]">
                <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
                >
                  <option value="">All Status</option>
                  <option value="walkedin">Walked in at Infidea</option>
                  <option value="did_not_come">Did not come</option>
                </select>
              </div>
              <div className="flex-none min-w-[120px]">
                <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date Type
                </label>
                <select
                  value={dateFilterType}
                  onChange={(e) => setDateFilterType(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
                >
                  <option value="day">Search by date</option>
                  <option value="month">Search by month</option>
                  <option value="year">Search by year</option>
                </select>
              </div>
              <div className="flex-none min-w-[130px]">
                <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  From Date
                </label>
                <input
                  type={dateFilterType === 'day' ? 'date' : (dateFilterType === 'month' ? 'month' : 'text')}
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
                  placeholder={dateFilterType === 'year' ? "Start year" : ""}
                />
              </div>
              <div className="flex-none min-w-[130px]">
                <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  To Date
                </label>
                <input
                  type={dateFilterType === 'day' ? 'date' : (dateFilterType === 'month' ? 'month' : 'text')}
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
                  placeholder={dateFilterType === 'year' ? "End year" : ""}
                />
              </div>
              <div className="flex-none">
                <button
                  onClick={resetFilters}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaTimesCircle className="mr-1 inline" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Walkin Form when showWalkinForm is true */}
        {showWalkinForm && !viewMode && (
          <div className={`mb-8 rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-[#e2692c]" : "text-[#1a5d96]"}`}>
              {selectedWalkin ? "Edit Walkin" : "Add New Walkin"}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); saveWalkin(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Candidate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={newWalkin.candidateName}
                    onChange={handleWalkinInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={newWalkin.contactNumber}
                    onChange={handleWalkinInputChange}
                    required
                    maxLength={10}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} focus:border-transparent`}
                  />
                  {phoneError && (
                    <div className="text-xs text-red-500 mt-1">{phoneError}</div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Walkin Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="walkinDate"
                    value={newWalkin.walkinDate}
                    onChange={handleWalkinInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={newWalkin.status}
                    onChange={handleWalkinInputChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} focus:border-transparent`}
                  >
                    <option value="pending">Pending</option>
                    <option value="walkedin">Walked in at Infidea</option>
                    <option value="did_not_come">Did not come</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Summary
                  </label>
                  <textarea
                    name="summary"
                    value={newWalkin.summary}
                    onChange={handleWalkinInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} focus:border-transparent resize-none`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } transition duration-150 ease-in-out`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "bg-[#e2692c] hover:bg-[#d15a20] text-white"
                      : "bg-[#1a5d96] hover:bg-[#154a7a] text-white"
                  } transition duration-150 ease-in-out`}
                >
                  {selectedWalkin ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Walkins Table */}
        <div className="overflow-y-auto">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-[#e2692c]" : "text-[#1a5d96]"}`}>
            Walkins
          </h2>
          <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Walkin Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Summary</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {filteredWalkins.length > 0 ? (
                    filteredWalkins.map((walkin, index) => (
                      <tr 
                        key={walkin.id} 
                        className={`${index % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{walkin.candidateName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{walkin.contactNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {walkin.walkinDate ? new Date(walkin.walkinDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColorClass(walkin.status)}`}>
                            {getStatusDisplay(walkin.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate">
                          {walkin.summary || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => viewWalkin(walkin)}
                              className={`px-3 py-1 rounded-md ${
                                darkMode
                                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                              } transition duration-150 ease-in-out`}
                            >
                              View
                            </button>
                            <button
                              onClick={() => editWalkin(walkin)}
                              className={`px-3 py-1 rounded-md ${
                                darkMode
                                  ? "bg-[#e2692c] hover:bg-[#d15a20] text-white"
                                  : "bg-[#1a5d96] hover:bg-[#154a7a] text-white"
                              } transition duration-150 ease-in-out`}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm font-medium">
                        No walkins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Render the view modal */}
      {showViewModal && <ViewWalkinModal />}

      {/* Pagination */}
      <Pagination />

    </div>
  );
}

export default Walkins;