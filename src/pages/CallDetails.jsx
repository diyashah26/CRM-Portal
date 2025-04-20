import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaSearch, FaFilter, FaCalendarAlt, FaEdit, FaEye, FaChevronLeft, FaChevronRight, FaSave, FaTimesCircle } from "react-icons/fa";
import { MdPhone, MdPersonOutline, MdBusinessCenter, MdDateRange, MdNote, MdOutlineTimer, MdPerson, MdSource, MdLocationOn, MdMessage, MdWork, MdSchool, MdTimer, MdAccessTime, MdNotes, MdShare, MdWifiCalling3, MdLocationCity, MdWatch, MdPublic, MdOutlineWhatsapp, MdOutlineDescription, MdComment, MdClear } from "react-icons/md";
import { IoCashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { generateId } from "../utils/helpers";

function CallDetails() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [callDetails, setCallDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    whatsappNumber: "",
    company: "",
    callDate: "",
    callTime: "",
    callDuration: "",
    callType: "",
    callSummary: "",
    source: "",
    gender: "",
    experience: "",
    qualification: "",
    state: "",
    city: "",
    locality: "",
    salaryExpectations: "",
    levelOfCommunication: "",
    noticePeriod: "",
    shiftPreference: "",
    relocation: "",
    callStatus: "",
    // Additional fields for lineup status
    lineupCompany: "",
    lineupProcess: "",
    lineupDate: "",
    interviewDate: "",
    walkinDate: ""
  });
  
  // Add filter state
  const [filters, setFilters] = useState({
    callStatus: ""
  });
  const [dateFilterType, setDateFilterType] = useState("day"); // 'day', 'month', 'year'
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCall, setViewingCall] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");

  // Get saved calls from localStorage on initial load
  useEffect(() => {
    // Get saved calls from localStorage
    const savedCalls = localStorage.getItem("callDetails");
    
    if (savedCalls) {
      try {
        const parsedCalls = JSON.parse(savedCalls);
        // Sort calls by id in descending order (newest first)
        const sortedCalls = parsedCalls.sort((a, b) => b.id - a.id);
        setCallDetails(sortedCalls);
      } catch (error) {
        console.error("Error parsing saved call details:", error);
        setCallDetails([]);
      }
    } else {
      setCallDetails([]);
    }
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Preserve current focus by using a function to update state instead of directly setting it
    // This prevents the component from fully re-rendering and losing focus
    setFormData(prevData => ({ 
      ...prevData, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate fields based on call status
    if (formData.callStatus === "walkin" && !formData.walkinDate) {
      alert("Please provide a walkin date");
      return;
    }
    
    if (formData.callStatus === "lineup" && 
        (!formData.lineupCompany || !formData.lineupProcess || 
         !formData.lineupDate || !formData.interviewDate)) {
      alert("Please fill in all lineup fields");
      return;
    }
    
    if (editingId !== null) {
      // Update existing
      // If call time is missing, add it
      if (!formData.callTime) {
        formData.callTime = new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true 
        });
      }
      
      const updatedCalls = callDetails.map(call => 
        call.id === editingId ? { ...formData, id: editingId } : call
      );
      setCallDetails(updatedCalls);
      
      // Update localStorage
      localStorage.setItem("callDetails", JSON.stringify(updatedCalls));
      setEditingId(null);
      
      // If call status is "lineup", also update lineups storage
      if (formData.callStatus === "lineup") {
        // Get existing lineups
        const existingLineups = JSON.parse(localStorage.getItem("lineups") || "[]");
        
        // Check if this lineup already exists in lineups
        const existingLineupIndex = existingLineups.findIndex(lineup => 
          lineup.callDetailId === editingId
        );
        
        const lineupData = {
          id: existingLineupIndex >= 0 ? existingLineups[existingLineupIndex].id : Date.now(),
          candidateName: formData.customerName,
          contactNumber: formData.phoneNumber,
          company: formData.lineupCompany,
          process: formData.lineupProcess,
          lineupDate: formData.lineupDate,
          interviewDate: formData.interviewDate,
          status: "scheduled", // Default lineup status
          callDetailId: editingId
        };
        
        if (existingLineupIndex >= 0) {
          // Update existing lineup
          existingLineups[existingLineupIndex] = lineupData;
        } else {
          // Add new lineup at the beginning
          existingLineups.unshift(lineupData);
        }
        
        // Save to localStorage
        localStorage.setItem("lineups", JSON.stringify(existingLineups));
      }
    } else {
      // Add new
      const newCall = {
        ...formData,
        id: Date.now()
      };
      // Add to the beginning of the array (newest first)
      const updatedCalls = [newCall, ...callDetails];
      setCallDetails(updatedCalls);
      
      // Update localStorage
      localStorage.setItem("callDetails", JSON.stringify(updatedCalls));
      
      // If call status is "lineup", also save to lineups storage
      if (formData.callStatus === "lineup") {
        // Get existing lineups
        const existingLineups = JSON.parse(localStorage.getItem("lineups") || "[]");
        
        // Create new lineup object
        const lineupData = {
          id: Date.now() + 1, // Different ID from the call
          candidateName: formData.customerName,
          contactNumber: formData.phoneNumber,
          company: formData.lineupCompany,
          process: formData.lineupProcess,
          lineupDate: formData.lineupDate,
          interviewDate: formData.interviewDate,
          status: "scheduled", // Default lineup status
          callDetailId: newCall.id
        };
        
        // Add to the beginning of lineups (newest first)
        existingLineups.unshift(lineupData);
        
        // Save to localStorage
        localStorage.setItem("lineups", JSON.stringify(existingLineups));
      }
    }

    // Reset form
    setFormData({
      customerName: "",
      phoneNumber: "",
      whatsappNumber: "",
      company: "",
      callDate: "",
      callTime: "",
      callDuration: "",
      callType: "",
      callSummary: "",
      source: "",
      gender: "",
      experience: "",
      qualification: "",
      state: "",
      city: "",
      locality: "",
      salaryExpectations: "",
      levelOfCommunication: "",
      noticePeriod: "",
      shiftPreference: "",
      relocation: "",
      callStatus: "",
      lineupCompany: "",
      lineupProcess: "",
      lineupDate: "",
      interviewDate: "",
      walkinDate: ""
    });
    setShowForm(false);
    setShowEditModal(false);
  };

  const handleEdit = (id) => {
    const callToEdit = callDetails.find(call => call.id === id);
    if (callToEdit) {
      console.log("Editing call:", callToEdit);
      setFormData({
        customerName: callToEdit.customerName || "",
        phoneNumber: callToEdit.phoneNumber || "",
        whatsappNumber: callToEdit.whatsappNumber || "",
        company: callToEdit.company || "",
        callDate: callToEdit.callDate || "",
        callTime: callToEdit.callTime || "",
        callDuration: callToEdit.callDuration || "",
        callType: callToEdit.callType || "",
        callSummary: callToEdit.callSummary || "",
        source: callToEdit.source || "",
        gender: callToEdit.gender || "",
        experience: callToEdit.experience || "",
        qualification: callToEdit.qualification || "",
        state: callToEdit.state || "",
        city: callToEdit.city || "",
        locality: callToEdit.locality || "",
        salaryExpectations: callToEdit.salaryExpectations || "",
        levelOfCommunication: callToEdit.levelOfCommunication || "",
        noticePeriod: callToEdit.noticePeriod || "",
        shiftPreference: callToEdit.shiftPreference || "",
        relocation: callToEdit.relocation || "",
        callStatus: callToEdit.callStatus || "",
        lineupCompany: callToEdit.lineupCompany || "",
        lineupProcess: callToEdit.lineupProcess || "",
        lineupDate: callToEdit.lineupDate || "",
        interviewDate: callToEdit.interviewDate || "",
        walkinDate: callToEdit.walkinDate || ""
      });
      setEditingId(id);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this call record?")) {
      const updatedCalls = callDetails.filter(call => call.id !== id);
      setCallDetails(updatedCalls);
      
      // Update localStorage
      localStorage.setItem("callDetails", JSON.stringify(updatedCalls));
    }
  };

  const handleCancel = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      whatsappNumber: "",
      company: "",
      callDate: "",
      callTime: "",
      callDuration: "",
      callType: "",
      callSummary: "",
      source: "",
      gender: "",
      experience: "",
      qualification: "",
      state: "",
      city: "",
      locality: "",
      salaryExpectations: "",
      levelOfCommunication: "",
      noticePeriod: "",
      shiftPreference: "",
      relocation: "",
      callStatus: "",
      // Reset lineup fields
      lineupCompany: "",
      lineupProcess: "",
      lineupDate: "",
      interviewDate: "",
      walkinDate: ""
    });
    setEditingId(null);
    setShowForm(false);
  };
  
  const navigateToCallInfo = () => {
    navigate('/call-info');
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      callStatus: "",
    });
    setYearFilter("");
    setMonthFilter("");
    setDayFilter("");
  };

  const handleView = (call) => {
    setViewingCall(call);
    setShowViewModal(true);
  };

  // Filter calls based on search query, call type and date range
  const filteredCalls = callDetails.filter(call => {
    // Search query filtering
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      call.customerName.toLowerCase().includes(query) ||
      call.phoneNumber.includes(query) ||
      call.company.toLowerCase().includes(query) ||
      (call.callStatus && call.callStatus.toLowerCase().includes(query));

    // Call status filtering
    const matchesCallStatus = filters.callStatus === "" || call.callStatus === filters.callStatus;
    
    // Date range filtering
    let matchesDateRange = true;
    
    if (call.callDate && dateRangeStart && dateRangeEnd) {
      const callDate = new Date(call.callDate);
      
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
      
      matchesDateRange = callDate >= startDate && callDate <= endDate;
    }
    
    return matchesSearch && matchesCallStatus && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCalls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Generate year options from 2020 to current year + 2
  const currentYear = new Date().getFullYear();
  const yearOptions = [{ value: "", label: "From Year" }];
  for (let year = 2020; year <= currentYear + 2; year++) {
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }

  // List of Indian states for dropdown
  const indianStates = [
    { value: "", label: "Select State" },
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal_pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west_bengal", label: "West Bengal" },
    { value: "delhi", label: "Delhi" },
    { value: "chandigarh", label: "Chandigarh" }
  ];

  // Call types
  const callTypes = [
    { value: "", label: "All Call Types" },
    { value: "Inquiry", label: "Inquiry" },
    { value: "Complaint", label: "Complaint" },
    { value: "Follow-up", label: "Follow-up" },
    { value: "Sales", label: "Sales" },
    { value: "Support", label: "Support" },
    { value: "Others", label: "Others" }
  ];

  // Define all the field types and options for reference
  const sourceOptions = [
    { value: "", label: "Select Source" },
    { value: "candidate_reference", label: "Candidate Reference" },
    { value: "indeed", label: "Indeed" },
    { value: "instagram", label: "Instagram" },
    { value: "internal_database", label: "Internal Database" },
    { value: "internshala", label: "Internshala" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "missed_call", label: "Missed Call" },
    { value: "naukri", label: "Naukri.com" },
    { value: "other", label: "Other" },
    { value: "personal_reference", label: "Personal Reference" },
    { value: "walkin", label: "Walkin" },
    { value: "whatsapp", label: "WhatsApp" }
  ];

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" }
  ];

  const experienceOptions = [
    { value: "", label: "Select Experience" },
    { value: "fresher", label: "Fresher" },
    { value: "experienced", label: "Experienced" }
  ];

  const communicationOptions = [
    { value: "", label: "Select Level" },
    { value: "hindi", label: "Hindi" },
    { value: "below_average", label: "Below Average" },
    { value: "average", label: "Average" },
    { value: "above_average", label: "Above Average" },
    { value: "good", label: "Good" },
    { value: "excellent", label: "Excellent" }
  ];

  const noticePeriodOptions = [
    { value: "", label: "Select Notice Period" },
    { value: "immediate", label: "Immediate Joiner" },
    { value: "7days", label: "7 Days" },
    { value: "15days", label: "15 Days" },
    { value: "30days", label: "30 Days" },
    { value: "45days", label: "45 Days" },
    { value: "60days", label: "60 Days" },
    { value: "90days", label: "90 Days" },
    { value: "more_than_90", label: "More than 90 Days" }
  ];

  const shiftOptions = [
    { value: "", label: "Select Shift" },
    { value: "day", label: "Day Shift" },
    { value: "night", label: "Night Shift" },
    { value: "any", label: "Any Shift Works" }
  ];

  const relocationOptions = [
    { value: "", label: "Select" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ];

  const callStatusOptions = [
    { value: "", label: "Select Status" },
    { value: "call_back", label: "Call Back Requested" },
    { value: "client_call", label: "Client Call" },
    { value: "inhouse_hr", label: "Inhouse HR In Touch" },
    { value: "lineup", label: "Lineup" },
    { value: "not_aligned", label: "Not Aligned Anywhere" },
    { value: "not_looking", label: "Not Looking for Job" },
    { value: "not_picking", label: "Not Picking Call" },
    { value: "not_reachable", label: "Not Reachable" },
    { value: "walkin", label: "Walkin at Infidea" }
  ];

  // Define lineup options
  const lineupCompanyOptions = [
    { value: "", label: "Select Company" },
    { value: "teleperformance", label: "Teleperformance" },
    { value: "taskus", label: "TaskUs" },
    { value: "lombard", label: "Lombard" },
    { value: "qconnect", label: "Qconnect" },
    { value: "altruist", label: "Altruist" },
    { value: "annova", label: "Annova" },
    { value: "others", label: "Others" }
  ];

  const lineupProcessOptions = [
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

  // Generate call duration options
  const callDurationOptions = Array.from({ length: 30 }, (_, i) => ({
    value: `${i + 1}`, 
    label: `${i + 1} ${i === 0 ? 'Minute' : 'Minutes'}`
  }));
  callDurationOptions.unshift({ value: "", label: "Select Duration" });

  // Define qualification options
  const qualificationOptions = [
    { value: "", label: "Select Qualification" },
    { value: "10th", label: "10th" },
    { value: "12th", label: "12th" },
    { value: "diploma", label: "Diploma" },
    { value: "graduate", label: "Graduate" },
    { value: "post_graduate", label: "Post Graduate" },
    { value: "others", label: "Others" }
  ];

  // Helper function to get display value from options
  const getDisplayValue = (options, value) => {
    if (!value && value !== 0) return "Not Specified";
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Get display value for state
  const getStateName = (stateValue) => {
    if (!stateValue) return "Not Specified";
    const indianStates = [
      { value: "andhra_pradesh", label: "Andhra Pradesh" },
      { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
      { value: "assam", label: "Assam" },
      { value: "bihar", label: "Bihar" },
      { value: "chhattisgarh", label: "Chhattisgarh" },
      { value: "goa", label: "Goa" },
      { value: "gujarat", label: "Gujarat" },
      { value: "haryana", label: "Haryana" },
      { value: "himachal_pradesh", label: "Himachal Pradesh" },
      { value: "jharkhand", label: "Jharkhand" },
      { value: "karnataka", label: "Karnataka" },
      { value: "kerala", label: "Kerala" },
      { value: "madhya_pradesh", label: "Madhya Pradesh" },
      { value: "maharashtra", label: "Maharashtra" },
      { value: "manipur", label: "Manipur" },
      { value: "meghalaya", label: "Meghalaya" },
      { value: "mizoram", label: "Mizoram" },
      { value: "nagaland", label: "Nagaland" },
      { value: "odisha", label: "Odisha" },
      { value: "punjab", label: "Punjab" },
      { value: "rajasthan", label: "Rajasthan" },
      { value: "sikkim", label: "Sikkim" },
      { value: "tamil_nadu", label: "Tamil Nadu" },
      { value: "telangana", label: "Telangana" },
      { value: "tripura", label: "Tripura" },
      { value: "uttar_pradesh", label: "Uttar Pradesh" },
      { value: "uttarakhand", label: "Uttarakhand" },
      { value: "west_bengal", label: "West Bengal" },
      { value: "delhi", label: "Delhi" },
      { value: "chandigarh", label: "Chandigarh" }
    ];
    return getDisplayValue(indianStates, stateValue);
  };

  // View Modal Component
  const ViewModal = () => {
    if (!viewingCall) return null;
    
    // Define all view fields in a flat array like EditModal
    const viewFields = [
      { label: "Candidate Name", key: "customerName", value: viewingCall.customerName },
      { label: "Phone Number", key: "phoneNumber", value: viewingCall.phoneNumber },
      { label: "WhatsApp Number", key: "whatsappNumber", value: viewingCall.whatsappNumber || "Same as contact" },
      { label: "Source", key: "source", value: getDisplayValue(sourceOptions, viewingCall.source) },
      { label: "Gender", key: "gender", value: getDisplayValue(genderOptions, viewingCall.gender) },
      { label: "Experience", key: "experience", value: getDisplayValue(experienceOptions, viewingCall.experience) },
      { label: "Qualification", key: "qualification", value: viewingCall.qualification || "Not Specified" },
      { label: "State", key: "state", value: getStateName(viewingCall.state) },
      { label: "City", key: "city", value: viewingCall.city || "Not Specified" },
      { label: "Locality", key: "locality", value: viewingCall.locality || "Not Specified", 
        show: () => viewingCall.city?.toLowerCase() === "indore" },
      { label: "Profile", key: "company", value: viewingCall.company || "Not Specified" },
      { label: "Salary Expectation", key: "salaryExpectations", value: viewingCall.salaryExpectations ? `₹${viewingCall.salaryExpectations}` : "Not Specified" },
      { label: "Communication", key: "levelOfCommunication", value: getDisplayValue(communicationOptions, viewingCall.levelOfCommunication) },
      { label: "Notice Period", key: "noticePeriod", value: getDisplayValue(noticePeriodOptions, viewingCall.noticePeriod) },
      { label: "Shift Preference", key: "shiftPreference", value: getDisplayValue(shiftOptions, viewingCall.shiftPreference) },
      { label: "Relocation", key: "relocation", value: getDisplayValue(relocationOptions, viewingCall.relocation) },
      { label: "Call Date", key: "callDate", value: new Date(viewingCall.callDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }) },
      { label: "Call Duration", key: "callDuration", value: `${viewingCall.callDuration} minutes` },
      { label: "Call Status", key: "callStatus", value: viewingCall.callStatus, isStatus: true },
      // Walkin date field - only shown when call status is "walkin"
      { label: "Walkin Date", key: "walkinDate", 
        value: viewingCall.walkinDate ? new Date(viewingCall.walkinDate).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        }) : "Not Specified", 
        show: () => viewingCall.callStatus === "walkin" 
      },
      // Lineup fields - only shown when call status is "lineup"
      { label: "Lineup Company", key: "lineupCompany", 
        value: getDisplayValue(lineupCompanyOptions, viewingCall.lineupCompany),
        show: () => viewingCall.callStatus === "lineup" 
      },
      { label: "Lineup Process", key: "lineupProcess", 
        value: getDisplayValue(lineupProcessOptions, viewingCall.lineupProcess),
        show: () => viewingCall.callStatus === "lineup" 
      },
      { label: "Lineup Date", key: "lineupDate", 
        value: viewingCall.lineupDate ? new Date(viewingCall.lineupDate).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        }) : "Not Specified",
        show: () => viewingCall.callStatus === "lineup" 
      },
      { label: "Interview Date", key: "interviewDate", 
        value: viewingCall.interviewDate ? new Date(viewingCall.interviewDate).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        }) : "Not Specified",
        show: () => viewingCall.callStatus === "lineup" 
      }
    ];
    
    const renderValue = (field) => {
      if (field.isStatus) {
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColorClass(field.value)}`}>
            {getDisplayValue(callStatusOptions, field.value)}
          </span>
        );
      } else if (field.isTag && field.value === "Inquiry") {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {field.value}
          </span>
        );
      } else if (field.isTag && field.value === "Complaint") {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            {field.value}
          </span>
        );
      } else if (field.isTag && field.value === "Follow-up") {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {field.value}
          </span>
        );
      } else if (field.isTag && field.value === "Sales") {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            {field.value}
          </span>
        );
      } else if (field.isTag && field.value === "Support") {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {field.value}
          </span>
        );
      } else {
        return field.value;
      }
    };
    
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className={`relative max-w-7xl mx-auto p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <button 
            onClick={() => setShowViewModal(false)} 
            className={`absolute top-4 right-4 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
            Call Details
          </h2>
          
          <div className={`rounded-xl p-5 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
              {viewFields.map((field, idx) => {
                // Skip fields with show condition that aren't met
                if (field.show && !field.show()) {
                  return null;
                }
                
                return (
                  <div key={idx} className="flex flex-col">
                    <dt className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {field.label}
                    </dt>
                    <dd className={`text-sm font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {renderValue(field)}
                    </dd>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className={`rounded-xl p-5 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} mb-6`}>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
              Call Summary
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {viewingCall.callSummary}
            </p>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => {
                handleEdit(viewingCall.id);
                setShowViewModal(false);
              }}
              className={`px-3 py-2 rounded-lg font-medium text-sm ${
                darkMode 
                  ? 'bg-[#e2692c] hover:bg-[#d15a20] text-white' 
                  : 'bg-[#1a5d96] hover:bg-[#154a7a] text-white'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowViewModal(false)}
              className={`px-3 py-2 rounded-lg font-medium text-sm ${
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

  // EditModal Component
  const EditModal = () => {
    // Create local state for the form within the modal to prevent focus loss
    const [localFormData, setLocalFormData] = useState({ ...formData });
    const [sameAsContact, setSameAsContact] = useState(
      localFormData.whatsappNumber === localFormData.phoneNumber
    );
    const [phoneError, setPhoneError] = useState("");
    
    // Update local form data when formData changes (e.g., after handleEdit is called)
    useEffect(() => {
      if (Object.keys(formData).length > 0) {
        console.log("Updating localFormData with:", formData);
        setLocalFormData({ ...formData });
        setSameAsContact(formData.whatsappNumber === formData.phoneNumber);
      }
    }, [formData]);
    
    // If the modal shouldn't be shown, return null
    if (!editingId) return null;
    
    const handleLocalChange = (field, value) => {
      if (field === "phoneNumber") {
        // Validate phone number length
        if (value.length > 0 && value.length !== 10) {
          setPhoneError(`Phone number must be 10 digits. Current: ${value.length}`);
        } else {
          setPhoneError("");
        }
        
        // Update WhatsApp number if checkbox is checked
        if (sameAsContact) {
          setLocalFormData(prev => ({ ...prev, [field]: value, whatsappNumber: value }));
          return;
        }
      }
      
      if (field === "city") {
        // If city changed and not Indore, clear the locality
        if (value.toLowerCase() !== "indore") {
          setLocalFormData(prev => ({ ...prev, locality: "" }));
        }
      }
      
      // Handle call status changes
      if (field === "callStatus") {
        // When changing call status, clear any status-specific fields
        const updatedData = { ...localFormData, [field]: value };
        
        // Clear walkin fields if not walkin
        if (value !== "walkin") {
          updatedData.walkinDate = "";
        }
        
        // Clear lineup fields if not lineup
        if (value !== "lineup") {
          updatedData.lineupCompany = "";
          updatedData.lineupProcess = "";
          updatedData.lineupDate = "";
          updatedData.interviewDate = "";
        }
        
        setLocalFormData(updatedData);
        return;
      }
      
      // If lineup company is set to others, also set lineup process to others
      if (field === "lineupCompany" && value === "others") {
        setLocalFormData(prev => ({ 
          ...prev, 
          [field]: value,
          lineupProcess: "others"
        }));
        return;
      }
      
      setLocalFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSameAsContactChange = (e) => {
      const isChecked = e.target.checked;
      setSameAsContact(isChecked);
      
      if (isChecked) {
        // Copy contact number to WhatsApp number
        setLocalFormData(prev => ({ 
          ...prev, 
          whatsappNumber: prev.phoneNumber
        }));
      } else {
        // Clear the WhatsApp number when unchecked
        setLocalFormData(prev => ({ 
          ...prev, 
          whatsappNumber: ""
        }));
      }
    };
    
    // Local handleSubmit to update the parent state only on form submission
    const handleLocalSubmit = (e) => {
      e.preventDefault();
      
      // Basic validation
      if (!localFormData.customerName || !localFormData.phoneNumber || !localFormData.callStatus) {
        alert("Please fill in all required fields");
        return;
      }
      
      // Validate phone number
      if (localFormData.phoneNumber.length !== 10) {
        alert("Phone number must be 10 digits");
        return;
      }
      
      // Call status specific validations
      if (localFormData.callStatus === "walkin" && !localFormData.walkinDate) {
        alert("Please select a Walkin Date");
        return;
      }
      
      if (localFormData.callStatus === "lineup") {
        if (!localFormData.lineupCompany) {
          alert("Please select a Lineup Company");
          return;
        }
        if (!localFormData.lineupProcess) {
          alert("Please select a Lineup Process");
          return;
        }
        if (!localFormData.lineupDate) {
          alert("Please select a Lineup Date");
          return;
        }
        if (!localFormData.interviewDate) {
          alert("Please select an Interview Date");
          return;
        }
      }
      
      // If city is Indore, validate locality
      if (localFormData.city?.toLowerCase() === "indore" && !localFormData.locality) {
        alert("Locality is required for Indore city");
        return;
      }
      
      // Update the main formData state
      setFormData(localFormData);
      
      // If call time is missing, add it
      if (!localFormData.callTime) {
        localFormData.callTime = new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true 
        });
      }
      
      // Call the parent handleSubmit
      const updatedCalls = callDetails.map(call => 
        call.id === editingId ? { ...localFormData, id: editingId } : call
      );
      setCallDetails(updatedCalls);
      
      // Update localStorage for call details
      localStorage.setItem("callDetails", JSON.stringify(updatedCalls));
      
      // If call status is "lineup", also update lineups
      if (localFormData.callStatus === "lineup") {
        // Get existing lineups
        const existingLineups = JSON.parse(localStorage.getItem("lineups") || "[]");
        
        // Check if this lineup already exists
        const existingLineupIndex = existingLineups.findIndex(lineup => 
          lineup.callDetailId === editingId
        );
        
        const lineupData = {
          id: existingLineupIndex >= 0 ? existingLineups[existingLineupIndex].id : Date.now(),
          candidateName: localFormData.customerName,
          contactNumber: localFormData.phoneNumber,
          company: localFormData.lineupCompany,
          process: localFormData.lineupProcess,
          lineupDate: localFormData.lineupDate,
          interviewDate: localFormData.interviewDate,
          status: "scheduled", // Default lineup status
          callDetailId: editingId
        };
        
        if (existingLineupIndex >= 0) {
          // Update existing lineup
          existingLineups[existingLineupIndex] = lineupData;
        } else {
          // Add new lineup at the beginning
          existingLineups.unshift(lineupData);
        }
        
        // Save to localStorage
        localStorage.setItem("lineups", JSON.stringify(existingLineups));
      }
      
      // If call status is "walkin", also update walkins
      if (localFormData.callStatus === "walkin") {
        // Get existing walkins
        const existingWalkins = JSON.parse(localStorage.getItem("walkins") || "[]");
        
        // Check if this walkin already exists
        const existingWalkinIndex = existingWalkins.findIndex(walkin => 
          walkin.callDetailId === editingId
        );
        
        const walkinData = {
          id: existingWalkinIndex >= 0 ? existingWalkins[existingWalkinIndex].id : Date.now(),
          candidateName: localFormData.customerName,
          contactNumber: localFormData.phoneNumber,
          walkinDate: localFormData.walkinDate,
          status: "pending", // Default walkin status
          summary: localFormData.callSummary,
          callDetailId: editingId
        };
        
        if (existingWalkinIndex >= 0) {
          // Update existing walkin
          existingWalkins[existingWalkinIndex] = walkinData;
        } else {
          // Add new walkin at the beginning
          existingWalkins.unshift(walkinData);
        }
        
        // Save to localStorage
        localStorage.setItem("walkins", JSON.stringify(existingWalkins));
      }
      
      setEditingId(null);
      setShowEditModal(false);
    };
    
    // All fields in a single flat array - similar to CallInfo
    const fields = [
      { label: "Candidate's Name", key: "customerName", icon: <MdPerson />, required: true, inputClass: "w-full" },
      { 
        label: "Mobile No.", 
        key: "phoneNumber", 
        icon: <MdPhone />, 
        type: "tel", 
        pattern: "[0-9]{10}", 
        maxLength: 10, 
        required: true, 
        inputClass: "w-full"
      },
      { 
        label: "WhatsApp No.", 
        key: "whatsappNumber", 
        icon: <MdOutlineWhatsapp />, 
        type: "tel", 
        pattern: "[0-9]{10}", 
        maxLength: 10, 
        required: !sameAsContact, 
        inputClass: "w-full",
        disabled: sameAsContact,
        hasCheckbox: true,
        checkboxLabel: "Same as previous field"
      },
      { label: "Source", key: "source", icon: <MdSource />, type: "select", options: sourceOptions, inputClass: "w-full" },
      { label: "Gender", key: "gender", icon: <MdPerson />, type: "select", options: genderOptions, inputClass: "w-full" },
      { label: "Experience", key: "experience", icon: <MdWork />, type: "select", options: experienceOptions, inputClass: "w-full" },
      { label: "Qualification", key: "qualification", icon: <MdSchool />, type: "select", options: qualificationOptions, inputClass: "w-full" },
      { label: "State", key: "state", icon: <MdLocationOn />, type: "select", options: indianStates, inputClass: "w-full" },
      { label: "City", key: "city", icon: <MdLocationCity />, type: "text", required: true, inputClass: "w-full" },
      { label: "Locality", key: "locality", icon: <MdLocationOn />, type: "text", required: localFormData.city?.toLowerCase() === "indore", inputClass: "w-full", 
          show: (formData) => formData.city?.toLowerCase() === "indore" },
      { label: "Salary Expectations", key: "salaryExpectations", icon: <IoCashOutline />, type: "text", inputClass: "w-full" },
      { label: "Level of Communication", key: "levelOfCommunication", icon: <MdMessage />, type: "select", options: communicationOptions, inputClass: "w-full" },
      { label: "Notice Period", key: "noticePeriod", icon: <MdTimer />, type: "select", options: noticePeriodOptions, inputClass: "w-full" },
      { label: "Shift Preference", key: "shiftPreference", icon: <MdAccessTime />, type: "select", options: shiftOptions, inputClass: "w-full" },
      { label: "Relocation", key: "relocation", icon: <MdShare />, type: "select", options: relocationOptions, inputClass: "w-full" },
      { label: "Company/Profile", key: "company", icon: <MdBusinessCenter />, type: "text", inputClass: "w-full" },
      { label: "Call Duration", key: "callDuration", icon: <MdOutlineTimer />, type: "select", options: callDurationOptions, inputClass: "w-full" },
      { label: "Call Status", key: "callStatus", icon: <MdNotes />, type: "select", options: callStatusOptions, required: true, inputClass: "w-full" },
      // Walkin date - only shown if call status is "walkin"
      { label: "Walkin Date", key: "walkinDate", icon: <MdDateRange />, type: "date", 
          show: (formData) => formData.callStatus === "walkin", required: true, inputClass: "w-full" },
      // Lineup fields - only shown if call status is "lineup"
      { label: "Lineup Company", key: "lineupCompany", icon: <MdBusinessCenter />, type: "select", 
          options: lineupCompanyOptions, show: (formData) => formData.callStatus === "lineup", required: true, inputClass: "w-full" },
      { label: "Lineup Process", key: "lineupProcess", icon: <MdOutlineDescription />, type: "select", 
          options: lineupProcessOptions, show: (formData) => formData.callStatus === "lineup", required: true, inputClass: "w-full" },
      { label: "Lineup Date", key: "lineupDate", icon: <MdDateRange />, type: "date", 
          show: (formData) => formData.callStatus === "lineup", required: true, inputClass: "w-full" },
      { label: "Interview Date", key: "interviewDate", icon: <MdDateRange />, type: "date", 
          show: (formData) => formData.callStatus === "lineup", required: true, inputClass: "w-full" },
    ];
    
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className={`relative max-w-7xl mx-auto p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <button 
            onClick={() => setShowEditModal(false)} 
            className={`absolute top-4 right-4 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FaTimes className="w-6 h-6" />
          </button>
          
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
            Edit Call Details
          </h2>

          <form onSubmit={handleLocalSubmit}>
            <div className={`rounded-xl p-5 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
                {fields.map(field => {
                  const { key, label, icon, type, pattern, maxLength, required, inputClass, disabled, hasCheckbox, checkboxLabel, options, show } = field;
                  
                  // Skip fields with show condition that aren't met
                  if (show && !show(localFormData)) {
                    return null;
                  }
                  
                  // Special handling for city and locality
                  if (key === "city") {
                    return (
                      <div key={key} className="flex flex-col">
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-lg">{icon}</span>
                          {label}
                          {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                          value={localFormData.city || ""}
                          onChange={(e) => handleLocalChange("city", e.target.value)}
                          placeholder="Enter city"
                          required={required}
                          disabled={disabled}
                          className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass || ''} ${
                              disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                    );
                  }
                  
                  // Skip locality field as it's handled by the show property
                  if (key === "locality" && !show(localFormData)) {
                    return null;
                  }
                  
                  if (type === "textarea") {
                    return (
                      <div key={key} className="flex flex-col col-span-full">
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-lg">{icon}</span>
                          {label}
                          {required && <span className="text-red-500">*</span>}
                    </label>
                        <textarea
                          value={localFormData[key] || ""}
                          onChange={(e) => handleLocalChange(key, e.target.value)}
                          placeholder={label}
                          required={required}
                          className={`px-3 py-2 text-base rounded-lg ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass || ''}`}
                    />
                  </div>
                    );
                  }
                  
                  return (
                    <div key={key} className="flex flex-col relative">
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-lg">{icon}</span>
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                      
                      {/* Show validation error for contact number */}
                      {key === "phoneNumber" && phoneError && (
                        <div className="text-xs text-red-500 -mt-1 mb-1">{phoneError}</div>
                      )}
                      
                      {type === "select" ? (
                        <>
                    <select
                            value={localFormData[key] || ""}
                            onChange={(e) => handleLocalChange(key, e.target.value)}
                            required={required}
                            className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass || ''}`}
                          >
                            {options && options.map(option => (
                              <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                        </>
                      ) : (
                        <>
                    <input
                            type={type || "text"}
                            value={localFormData[key] || ""}
                            onChange={(e) => handleLocalChange(key, e.target.value)}
                            placeholder={label}
                            required={required}
                            pattern={pattern}
                            maxLength={maxLength}
                            disabled={disabled}
                            className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass || ''} ${
                                disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                      }`}
                    />
                          
                          {/* Checkbox for copying contact number to WhatsApp */}
                          {hasCheckbox && (
                            <div className="mt-1">
                              <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                                  type="checkbox"
                                  checked={sameAsContact}
                                  onChange={handleSameAsContactChange}
                                  className={`rounded ${darkMode ? 'text-[#e2692c] focus:ring-[#e2692c]' : 'text-[#1a5d96] focus:ring-[#1a5d96]'}`}
                                />
                                <span>{checkboxLabel}</span>
                              </label>
              </div>
            )}
                        </>
                      )}
                  </div>
                  );
                })}
                  </div>
                  </div>
                  
            {/* Call Summary Section */}
            <div className={`rounded-xl p-5 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} mb-6`}>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-lg"><MdNotes /></span>
                Call Summary
                <span className="text-red-500">*</span>
                    </label>
              <textarea
                value={localFormData.callSummary || ""}
                onChange={(e) => handleLocalChange("callSummary", e.target.value)}
                placeholder="Enter call summary..."
                required
                className={`px-3 py-2 h-24 w-full text-base rounded-lg ${darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                  : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`px-6 py-3 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-lg text-base shadow-lg flex items-center gap-2 transition-colors`}
              >
                <FaSave className="text-lg" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Helper function to get status color
  const getStatusColorClass = (status) => {
    switch(status) {
      case "call_back":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "client_call":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "inhouse_hr":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "lineup":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "not_aligned":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "not_looking":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "not_picking":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "not_reachable":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "walkin":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Render table header row with conditional lineup columns
  const renderTableHeader = () => {
    return (
      <tr>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky left-0 top-0 z-30 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[80px]`}>
          Actions
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[100px]`}>
          Call Time
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Call Date
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[90px]`}>
          Duration
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Status
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[150px]`}>
          Name
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Phone
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[100px]`}>
          WhatsApp
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Experience
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Communication
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[150px]`}>
          Profile
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Salary Exp.
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[100px]`}>
          Shift Pref.
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Notice Period
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[100px]`}>
          Gender
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[120px]`}>
          Source
        </th>
        <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider sticky top-0 z-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} w-[160px]`}>
          Summary
        </th>
      </tr>
    );
  };

  // Render a single call row with conditional lineup columns
  const renderCallRow = (call, index) => {
    return (
      <tr 
        key={call.id} 
        className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} ${
          index % 2 === 0 
            ? (darkMode ? 'bg-gray-800' : 'bg-white') 
            : (darkMode ? 'bg-gray-700' : 'bg-gray-50')
        }`}
      >
        <td className={`px-3 py-2 whitespace-nowrap text-sm sticky left-0 z-10 ${
          index % 2 === 0 
            ? (darkMode ? 'bg-gray-800' : 'bg-white') 
            : (darkMode ? 'bg-gray-700' : 'bg-gray-50')
        }`}>
          <div className="flex space-x-1">
            <button
              onClick={() => handleView(call)}
              className={`p-1 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400 hover:text-blue-300' : 'bg-gray-200 hover:bg-gray-300 text-blue-600 hover:text-blue-700'
              }`}
              title="View details"
            >
              <FaEye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleEdit(call.id)}
              className={`p-1 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-green-300' : 'bg-gray-200 hover:bg-gray-300 text-green-600 hover:text-green-700'
              }`}
              title="Edit record"
            >
              <FaEdit className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm">
          {call.callTime || "N/A"}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm">
          {new Date(call.callDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm">
          {call.callDuration} min
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm">
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColorClass(call.callStatus)}`}>
            {getDisplayValue(callStatusOptions, call.callStatus)}
          </span>
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[150px] truncate">
          {call.customerName}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm">
          {call.phoneNumber}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[100px] truncate">
          {call.whatsappNumber || "Same as contact"}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[120px] truncate">
          {getDisplayValue(experienceOptions, call.experience)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[120px] truncate">
          {getDisplayValue(communicationOptions, call.levelOfCommunication)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[150px] truncate">
          {call.company || "Not Specified"}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[120px] truncate">
          {call.salaryExpectations ? `₹${call.salaryExpectations}` : "Not Specified"}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[100px] truncate">
          {getDisplayValue(shiftOptions, call.shiftPreference)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[120px] truncate">
          {getDisplayValue(noticePeriodOptions, call.noticePeriod)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[100px] truncate">
          {getDisplayValue(genderOptions, call.gender)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-sm max-w-[120px] truncate">
          {getDisplayValue(sourceOptions, call.source)}
        </td>
        <td className="px-3 py-2 text-sm max-w-[160px] truncate">
          {call.callSummary}
        </td>
      </tr>
    );
  };

  return (
    <div className={`min-h-screen px-6 py-5 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
            Call Details
          </h1>
        </div>

        {/* Fixed position search and filter container */}
        <div className="sticky top-0 left-0 right-0 z-30 bg-inherit pb-4">
          {/* Compact Search Bar with Add New Call Button */}
          <div className="mb-3 flex">
            <div className={`relative flex items-center rounded-l-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} flex-grow max-w-lg`}>
              <FaSearch className={`absolute left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-base`} />
              <input
                type="text"
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-3 py-2.5 w-full text-base ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none rounded-l-lg`}
              />
            </div>
            <button
              onClick={navigateToCallInfo}
              className={`px-4 py-2.5 text-base ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white flex items-center gap-2 transition-colors flex-shrink-0 rounded-r-lg shadow-md`}
            >
              <FaPlus />
              Add Call
            </button>
          </div>

          {/* Compact Filter Bar */}
          <div className={`rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} p-3 z-30 max-w-full mb-4`}>
            <div className="flex flex-nowrap items-end gap-3 overflow-x-auto pb-2">
              <div className="flex-none">
                <button
                  onClick={resetFilters}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } transition duration-150 ease-in-out`}
                >
                  <FaTimesCircle className="mr-1 inline" />
                  Reset
                </button>
              </div>
              
              <div className="flex-none min-w-[150px]">
                <select
                  name="callStatus"
                  value={filters.callStatus}
                  onChange={handleFilterChange}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-1`}
                >
                  <option value="">All Status</option>
                  {callStatusOptions.filter(option => option.value !== "").map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-none min-w-[120px]">
                <select 
                  value={dateFilterType}
                  onChange={(e) => setDateFilterType(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-1`}
                >
                  <option value="day">By Date</option>
                  <option value="month">By Month</option>
                  <option value="year">By Year</option>
                  <option value="day">Search by date</option>
                  <option value="month">Search by month</option>
                  <option value="year">Search by year</option>
                </select>
              </div>
              
              {dateFilterType === 'year' ? (
                <>
                  <div className="flex-none min-w-[120px]">
                    <select
                      value={dateRangeStart}
                      onChange={(e) => setDateRangeStart(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-1`}
                    >
                      <option value="">From Year</option>
                      {yearOptions.filter(y => y.value).map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-none min-w-[120px]">
                    <select
                      value={dateRangeEnd}
                      onChange={(e) => setDateRangeEnd(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-1`}
                    >
                      <option value="">To Year</option>
                      {yearOptions.filter(y => y.value && (!dateRangeStart || parseInt(y.value) >= parseInt(dateRangeStart))).map(year => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-none min-w-[130px]">
                    <input
                      type={dateFilterType === 'day' ? 'date' : 'month'}
                      value={dateRangeStart}
                      onChange={(e) => setDateRangeStart(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-1`}
                      placeholder={`From ${dateFilterType === 'day' ? 'Date' : 'Month'}`}
                    />
                  </div>
                  <div className="flex-none min-w-[130px]">
                    <input
                      type={dateFilterType === 'day' ? 'date' : 'month'}
                      value={dateRangeEnd}
                      onChange={(e) => setDateRangeEnd(e.target.value)}
                      min={dateRangeStart}
                      className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      } focus:ring-1`}
                      placeholder={`To ${dateFilterType === 'day' ? 'Date' : 'Month'}`}
                    />
                  </div>
                </>
              )}
              
              {/* Items per page selector */}
              <div className="flex-none min-w-[100px]">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-1`}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
              
              {/* Pagination controls - moved from bottom to top */}
              {filteredCalls.length > 0 && (
                <div className="flex-none ml-auto">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center justify-center p-1.5 h-8 w-8 rounded-md ${
                        currentPage === 1
                          ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                          : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
                      }`}
                    >
                      <FaChevronLeft className="h-3 w-3" />
                    </button>
                    
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {currentPage} / {totalPages}
                    </span>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center justify-center p-1.5 h-8 w-8 rounded-md ${
                        currentPage === totalPages
                          ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                          : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
                      }`}
                    >
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form for adding/editing call details */}
        {showForm && (
          <div className={`mb-6 p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
              {editingId !== null ? "Edit Call Details" : "Add New Call Details"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdPersonOutline className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Customer Name *</label>
                </div>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdPhone className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Phone Number *</label>
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="Phone number must be 10 digits"
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdBusinessCenter className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Company *</label>
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdDateRange className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Call Date *</label>
                </div>
                <input
                  type="date"
                  name="callDate"
                  value={formData.callDate}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdOutlineTimer className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Call Duration (minutes) *</label>
                </div>
                <input
                  type="number"
                  name="callDuration"
                  value={formData.callDuration}
                  onChange={handleChange}
                  required
                  min="1"
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                />
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdPhone className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Call Type *</label>
                </div>
                <select
                  name="callType"
                  value={formData.callType}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                >
                  {callTypes.map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <MdPhone className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Call Status *</label>
                </div>
                <select
                  name="callStatus"
                  value={formData.callStatus}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select Status</option>
                  {callStatusOptions.filter(option => option.value !== "").map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lineup fields - only displayed when status is "walkin" */}
              {formData.callStatus === "walkin" && (
                <>
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <MdBusinessCenter className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <label className="block text-base font-medium">Lineup Company *</label>
                    </div>
                    <select
                      name="lineupCompany"
                      value={formData.lineupCompany}
                      onChange={handleChange}
                      required={formData.callStatus === "walkin"}
                      className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    >
                      {lineupCompanyOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <MdBusinessCenter className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <label className="block text-base font-medium">Process *</label>
                    </div>
                    <select
                      name="lineupProcess"
                      value={formData.lineupProcess}
                      onChange={handleChange}
                      required={formData.callStatus === "walkin"}
                      className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    >
                      {lineupProcessOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <MdDateRange className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <label className="block text-base font-medium">Lineup Date *</label>
                    </div>
                    <input
                      type="date"
                      name="lineupDate"
                      value={formData.lineupDate}
                      onChange={handleChange}
                      required={formData.callStatus === "walkin"}
                      className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <MdDateRange className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <label className="block text-base font-medium">Interview Date *</label>
                    </div>
                    <input
                      type="date"
                      name="interviewDate"
                      value={formData.interviewDate}
                      onChange={handleChange}
                      required={formData.callStatus === "walkin"}
                      className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </>
              )}

              {/* Lineup fields - only displayed when status is "lineup" */}
              {formData.callStatus === "lineup" && (
                <>
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <MdBusinessCenter className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      <label className="block text-base font-medium">Lineup Company *</label>
                    </div>
                    <select
                      name="lineupCompany"
                      value={formData.lineupCompany}
                      onChange={handleChange}
                      required={formData.callStatus === "lineup"}
                      className={`w-full px-3 py-2.5 mt-1 rounded-md border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    >
                      {lineupCompanyOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Process*
                    </label>
                    <select
                      name="lineupProcess"
                      value={formData.lineupProcess}
                      onChange={handleChange}
                      required={formData.callStatus === "lineup"}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    >
                      {lineupProcessOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Lineup Date*
                    </label>
                    <input
                      type="date"
                      name="lineupDate"
                      value={formData.lineupDate}
                      onChange={handleChange}
                      required={formData.callStatus === "lineup"}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Interview Date*
                    </label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={formData.interviewDate}
                      onChange={handleChange}
                      required={formData.callStatus === "lineup"}
                      className={`w-full px-3 py-2 rounded-md border text-sm ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <MdNote className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <label className="block text-base font-medium">Call Summary *</label>
                </div>
                <textarea
                  name="callSummary"
                  value={formData.callSummary}
                  onChange={handleChange}
                  required
                  rows="3"
                  className={`w-full px-3 py-2.5 mt-1 rounded-md border text-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'focus:ring-orange-500' : 'focus:ring-blue-500'
                  }`}
                ></textarea>
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 rounded-md ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${
                    darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'
                  } text-white transition-colors`}
                >
                  {editingId !== null ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Call Details Table with Horizontal Scroll */}
        <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto" style={{ 
            maxWidth: '100%', 
            maxHeight: 'calc(100vh - 230px)',
            overflowY: 'auto',
            overflowX: 'auto'
          }}>
            <table className="w-full border-collapse table-auto">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0 z-20`}>
                {renderTableHeader()}
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((call, index) => (
                    renderCallRow(call, index)
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={filteredCalls.some(call => call.callStatus === "lineup") ? "20" : "16"}
                      className={`px-4 py-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
                    >
                      <div className="flex flex-col items-center justify-center gap-3 py-16">
                        <p className="text-xl font-medium">No call records found</p>
                        <p className="text-lg">Click the "Add New Call" button to add your first call record</p>
                        <button
                          onClick={navigateToCallInfo}
                          className={`mt-3 px-4 py-2.5 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-lg flex items-center gap-2 transition-colors shadow-md text-base`}
                        >
                          <FaPlus />
                          Add New Call
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
              </div>
      </div>
      
      {showViewModal && <ViewModal />}
      {showEditModal && <EditModal />}
    </div>
  );
}

export default CallDetails; 