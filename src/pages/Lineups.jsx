import React, { useState, useEffect } from "react";
import { MdPerson, MdWork, MdCalendarToday, MdBusinessCenter, MdPhone, MdAdd, MdCancel, MdEdit, MdVisibility, MdSave, MdDelete, MdAssignmentTurnedIn } from "react-icons/md";
import { IoCashOutline } from "react-icons/io5";
import { FaTimes, FaPlus, FaSearch, FaCalendarAlt, FaFilter, FaTimesCircle } from "react-icons/fa";
import { MdClear } from "react-icons/md";

function Lineups() {
  const [darkMode, setDarkMode] = useState(false);
  const [lineups, setLineups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingLineup, setViewingLineup] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: "",
    contactNumber: "",
    company: "",
    process: "",
    lineupYear: "",
    lineupMonth: "",
    lineupDate: "",
    interviewDate: "",
    status: ""
  });
  const [selectedLineup, setSelectedLineup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilterType, setDateFilterType] = useState("day"); // 'day', 'month', 'year'
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Add filter state
  const [filters, setFilters] = useState({
    company: "",
    process: "",
    status: ""
  });

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
  }, []);

  const companyOptions = [
    { value: "", label: "Select Company" },
    { value: "teleperformance", label: "Teleperformance" },
    { value: "taskus", label: "TaskUs" },
    { value: "lombard", label: "Lombard" },
    { value: "qconnect", label: "Qconnect" },
    { value: "altruist", label: "Altruist" },
    { value: "annova", label: "Annova" },
    { value: "others", label: "Others" }
  ];

  const processOptions = [
    { value: "", label: "Select Process" },
    { value: "airtel_black", label: "Airtel Black" },
    { value: "airtel_broadband", label: "Airtel Broadband" },
    { value: "crt", label: "CRT" },
    { value: "e_channel_sales", label: "E-Channel Sales" },
    { value: "flipkart_l2", label: "Flipkart L2" },
    { value: "flipkart_seller_support", label: "Flipkart Seller Support" },
    { value: "instacart_chat", label: "Instacart Chat" },
    { value: "instacart_email", label: "Instacart Email" },
    { value: "instacart_voice", label: "Instacart Voice" },
    { value: "mastercard_b2b", label: "Mastercard B2B" },
    { value: "mastercard_b2c", label: "Mastercard B2C" },
    { value: "myntra_chat", label: "Myntra Chat" },
    { value: "myntra_voice", label: "Myntra Voice" },
    { value: "p&g", label: "P&G" },
    { value: "presto", label: "Presto" },
    { value: "swiggy_chat", label: "Swiggy Chat" },
    { value: "swiggy_voice", label: "Swiggy Voice" },
    { value: "temu", label: "Temu" },
    { value: "vivint", label: "Vivint" },
    { value: "xaomi", label: "Xaomi" },
    { value: "asus", label: "Asus" },
    { value: "doordash", label: "Doordash" },
    { value: "frontier", label: "Frontier" },
    { value: "western_union_chat", label: "Western Union Chat" },
    { value: "western_union_voice", label: "Western Union Voice" },
    { value: "others", label: "Others" }
  ];

  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "reject_hr", label: "Reject - HR Round" },
    { value: "reject_ops", label: "Reject - Ops Round" },
    { value: "reject_client", label: "Reject - Client Round" },
    { value: "reject_assessment", label: "Reject - Assessment Round" },
    { value: "duplicate", label: "Duplicate" },
    { value: "joined_elsewhere", label: "Joined Somewhere Else" },
    { value: "joined_left", label: "Joined & Left" },
    { value: "joined_duplicated", label: "Joined & Duplicated" },
    { value: "negative_rehire", label: "Negative Rehire" },
    { value: "not_interested", label: "Not Interested" },
    { value: "offer_drop", label: "Offer Drop" },
    { value: "feedback_pending", label: "Feedback Pending From Client" },
    { value: "interview_pending_client", label: "Interview Pending - Client Round" },
    { value: "interview_pending_hr", label: "Interview Pending - HR Round" },
    { value: "interview_pending_ops", label: "Interview Pending - Ops Round" },
    { value: "joined", label: "Joined" },
    { value: "selected", label: "Selected" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "onhold", label: "On Hold" },
    { value: "cancelled", label: "Cancelled" },
    { value: "other", label: "Other" }
  ];

  const monthOptions = [
    { value: "", label: "Select Month" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  // Generate year options from 2020 to current year + 2
  const currentYear = new Date().getFullYear();
  const yearOptions = [{ value: "", label: "Select Year" }];
  for (let year = 2020; year <= currentYear + 2; year++) {
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }

  // Generate date options 1-31
  const dateOptions = [{ value: "", label: "Select Date" }];
  for (let date = 1; date <= 31; date++) {
    const dateValue = date < 10 ? `0${date}` : `${date}`;
    dateOptions.push({ value: dateValue, label: dateValue });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedLineups = localStorage.getItem("lineups");
    
    if (savedLineups) {
      try {
        const parsedLineups = JSON.parse(savedLineups);
        // Sort lineups by id in descending order (newest first)
        const sortedLineups = parsedLineups.sort((a, b) => b.id - a.id);
        setLineups(sortedLineups);
      } catch (error) {
        console.error("Error parsing saved lineups:", error);
        setLineups([]);
      }
    } else {
      setLineups([]);
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.candidateName || !formData.contactNumber || !formData.company || 
        !formData.process || !formData.lineupDate || !formData.interviewDate || !formData.status) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate phone number must be exactly 10 digits
    if (formData.contactNumber.length !== 10) {
      alert("Contact number must be exactly 10 digits");
      return;
    }

    let updatedLineups;
    if (editingId !== null) {
      // Update existing
      updatedLineups = lineups.map(lineup => 
        lineup.id === editingId ? { ...formData, id: editingId } : lineup
      );
      setLineups(updatedLineups);
      setEditingId(null);
    } else {
      // Add new
      const newLineup = {
        ...formData,
        id: Date.now()
      };
      // Add to the beginning of the array (newest first)
      updatedLineups = [newLineup, ...lineups];
      setLineups(updatedLineups);
    }
    
    // Save to localStorage
    localStorage.setItem("lineups", JSON.stringify(updatedLineups));

    // Reset form
    setFormData({
      candidateName: "",
      contactNumber: "",
      company: "",
      process: "",
      lineupDate: "",
      interviewDate: "",
      status: ""
    });
    setShowForm(false);
  };

  // Handle edit action
  const handleEdit = (id) => {
    const lineupToEdit = lineups.find(lineup => lineup.id === id);
    if (lineupToEdit) {
      setFormData({
        candidateName: lineupToEdit.candidateName || "",
        contactNumber: lineupToEdit.contactNumber || "",
        company: lineupToEdit.company || "",
        process: lineupToEdit.process || "",
        lineupDate: lineupToEdit.lineupDate || "",
        interviewDate: lineupToEdit.interviewDate || "",
        status: lineupToEdit.status || ""
      });
      setEditingId(id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleView = (lineup) => {
    setSelectedLineup(lineup);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lineup?")) {
      const updatedLineups = lineups.filter(lineup => lineup.id !== id);
      setLineups(updatedLineups);
      // Save to localStorage
      localStorage.setItem("lineups", JSON.stringify(updatedLineups));
    }
  };

  const handleCancel = () => {
    setFormData({
      candidateName: "",
      contactNumber: "",
      company: "",
      process: "",
      lineupYear: "",
      lineupMonth: "",
      lineupDate: "",
      interviewDate: "",
      status: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Function to get appropriate color for status badges
  const getStatusColor = (status) => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('joined') || lowerStatus.includes('selected') || lowerStatus.includes('completed')) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (lowerStatus.includes('reject') || lowerStatus.includes('negative') || lowerStatus.includes('left') || 
               lowerStatus.includes('duplicate') || lowerStatus.includes('elsewhere') || 
               lowerStatus.includes('drop') || lowerStatus.includes('not_interested') || 
               lowerStatus.includes('cancelled')) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    } else if (lowerStatus.includes('pending') || lowerStatus.includes('interview') || 
               lowerStatus.includes('scheduled') || lowerStatus.includes('onhold')) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      company: "",
      process: "",
      status: ""
    });
    setDateRangeStart("");
    setDateRangeEnd("");
    setSearchQuery("");
  };

  // Filter lineups
  const filteredLineups = lineups.filter(lineup => {
    // Search query filtering
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      lineup.candidateName.toLowerCase().includes(query) ||
      lineup.contactNumber.includes(query) ||
      (lineup.company && lineup.company.toLowerCase().includes(query)) ||
      (lineup.process && lineup.process.toLowerCase().includes(query));

    // Basic filters (company, process, status)
    const matchesCompany = filters.company === "" || lineup.company === filters.company;
    const matchesProcess = filters.process === "" || lineup.process === filters.process;
    const matchesStatus = filters.status === "" || lineup.status === filters.status;
    
    // Date range filtering
    let matchesDateRange = true;
    
    if (lineup.lineupDate && dateRangeStart && dateRangeEnd) {
      let lineupDate;
      
      // Handle the different date formats in the data
      if (typeof lineup.lineupDate === 'string' && lineup.lineupDate.includes('-')) {
        // Handle ISO format date (YYYY-MM-DD)
        lineupDate = new Date(lineup.lineupDate);
      } else if (lineup.lineupDate && lineup.lineupMonth && lineup.lineupYear) {
        // Handle split date fields
        lineupDate = new Date(`${lineup.lineupYear}-${lineup.lineupMonth}-${lineup.lineupDate}`);
      } else {
        return true; // Can't filter if date format is unknown
      }
      
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
      
      matchesDateRange = lineupDate >= startDate && lineupDate <= endDate;
    }
    
    return matchesSearch && matchesCompany && matchesProcess && matchesStatus && matchesDateRange;
  });

  // Get current lineups for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLineups = filteredLineups.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get display name from value
  const getDisplayName = (options, value) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const ViewModal = () => {
    if (!selectedLineup) return null;
    
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
                    {selectedLineup.candidateName}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact Number</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedLineup.contactNumber}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Company</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {companyOptions.find(o => o.value === selectedLineup.company)?.label || selectedLineup.company}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
                Process Details
              </h3>
              <dl className="space-y-2">
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Process</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {processOptions.find(o => o.value === selectedLineup.process)?.label || selectedLineup.process}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lineup Date</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedLineup.lineupDate ? 
                      (typeof selectedLineup.lineupDate === 'string' && selectedLineup.lineupDate.includes('-') ?
                        new Date(selectedLineup.lineupDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) :
                        selectedLineup.lineupMonth && selectedLineup.lineupYear ?
                          new Date(`${selectedLineup.lineupYear}-${selectedLineup.lineupMonth}-${selectedLineup.lineupDate}`).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) :
                          "Not specified"
                      ) : "Not specified"
                    }
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interview Date</dt>
                  <dd className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedLineup.interviewDate ? 
                      new Date(selectedLineup.interviewDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 
                      "Not specified"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
              Status Information
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Status:</span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedLineup.status)}`}>
                {statusOptions.find(o => o.value === selectedLineup.status)?.label || selectedLineup.status}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                handleEdit(selectedLineup.id);
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

  const renderTable = () => {
    return (
      <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Process</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Lineup Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Interview Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? "text-white" : "text-gray-800"}`}>
              {currentLineups.length > 0 ? (
                currentLineups.map((lineup, index) => (
                  <tr 
                    key={index} 
                    className={`${index % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{lineup.candidateName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lineup.contactNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDisplayName(companyOptions, lineup.company)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDisplayName(processOptions, lineup.process)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lineup.lineupDate ? 
                       (typeof lineup.lineupDate === 'string' && lineup.lineupDate.includes('-') ?
                       new Date(lineup.lineupDate).toLocaleDateString('en-GB', {
                         day: 'numeric',
                         month: 'short',
                         year: 'numeric'
                       }) :
                       lineup.lineupMonth && lineup.lineupYear ?
                       new Date(`${lineup.lineupYear}-${lineup.lineupMonth}-${lineup.lineupDate}`).toLocaleDateString('en-GB', {
                         day: 'numeric',
                         month: 'short',
                         year: 'numeric'
                       }) :
                       "-") : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lineup.interviewDate ? new Date(lineup.interviewDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lineup.status)}`}>
                        {getDisplayName(statusOptions, lineup.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleView(lineup)}
                        className={`px-3 py-1 rounded-md ${
                          darkMode
                            ? "bg-gray-600 hover:bg-gray-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        } transition duration-150 ease-in-out`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(lineup.id)}
                        className={`px-3 py-1 rounded-md ${
                          darkMode
                            ? "bg-[#e2692c] hover:bg-[#d15a20] text-white"
                            : "bg-[#1a5d96] hover:bg-[#154a7a] text-white"
                        } transition duration-150 ease-in-out`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm font-medium">
                    No lineups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Add pagination component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredLineups.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    
    // Reset to first page when filters change
    useEffect(() => {
      setCurrentPage(1);
    }, [filters, searchQuery, dateRangeStart, dateRangeEnd]);
    
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
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLineups.length)} of {filteredLineups.length} items
        </div>
      </nav>
    );
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} rounded-xl shadow-md transition-colors duration-200`}>
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold mb-6">Lineups</h1>

        {/* Search and Actions Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-4 sm:mb-0">
          {/* Search Bar */}
          <div className={`relative flex-grow max-w-md ${darkMode ? 'text-white' : 'text-gray-600'}`}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or phone number..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 placeholder-gray-400 text-white' 
                  : 'bg-gray-50 border-gray-300 placeholder-gray-500 text-gray-900'
              } border focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <MdClear className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Add New Lineup Button */}
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                candidateName: "",
                contactNumber: "",
                company: "",
                process: "",
                lineupYear: "",
                lineupMonth: "",
                lineupDate: "",
                interviewDate: "",
                status: ""
              });
              setShowForm(true);
            }}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-white ${
              darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'
            } shadow-md transition-colors duration-200`}
          >
            <FaPlus className="mr-2" />
            <span>Add New Lineup</span>
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
                  Company
                </label>
                <select
                  name="company"
                  value={filters.company}
                  onChange={handleFilterChange}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
                >
                  <option value="">All Companies</option>
                  {companyOptions.filter(opt => opt.value).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-none min-w-[150px]">
                <label className={`block mb-1 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Process
                </label>
                <select
                  name="process"
                  value={filters.process}
                  onChange={handleFilterChange}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} transition-colors duration-200`}
                >
                  <option value="">All Processes</option>
                  {processOptions.filter(opt => opt.value).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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
                  {statusOptions.filter(opt => opt.value).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
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
                  <option value="day">By Day</option>
                  <option value="month">By Month</option>
                  <option value="year">By Year</option>
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

        {showForm && (
          <div className={`mb-8 rounded-lg shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-[#e2692c]" : "text-[#1a5d96]"}`}>
              {editingId ? "Edit Lineup" : "Add New Lineup"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Company *
                  </label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                  >
                    {companyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Process *
                  </label>
                  <select
                    name="process"
                    value={formData.process}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                  >
                    {processOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Lineup Date *
                  </label>
                  <input
                    type="date"
                    name="lineupDate"
                    value={formData.lineupDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    required
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4">
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
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-y-auto">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-[#e2692c]" : "text-[#1a5d96]"}`}>
            Lineups
          </h2>
          {renderTable()}
          <Pagination />
        </div>
      </div>

      {showViewModal && <ViewModal />}
    </div>
  );
}

export default Lineups; 