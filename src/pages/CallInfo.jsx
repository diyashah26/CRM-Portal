import React, { useState, useEffect, useRef } from "react";
import {
  MdPerson,
  MdSource,
  MdPhone,
  MdLocationOn,
  MdMessage,
  MdWork,
  MdSchool,
  MdTimer,
  MdAccessTime,
  MdNotes,
  MdShare,
  MdBusinessCenter,
  MdWifiCalling3,
  MdLocationCity,
  MdWatch,
  MdPublic,
  MdOutlineWhatsapp
} from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoCashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CallInfo() {
  const [darkMode, setDarkMode] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [sameAsContact, setSameAsContact] = useState(false);
  const contactInputRef = useRef(null);
  const navigate = useNavigate();

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

  const [formData, setFormData] = useState({
    candidateName: "",
    source: "",
    gender: "",
    contactNumber: "",
    whatsappNumber: "",
    sameAsContact: false,
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
    companyProfile: "",
    customCompanyProfile: "",
    callStatus: "",
    callSummary: "",
    callDuration: "",
    lineupCompany: "",
    customLineupCompany: "",
    lineupProcess: "",
    customLineupProcess: "",
    lineupDate: "",
    interviewDate: "",
    walkinDate: ""
  });

  const handleChange = (field, value) => {
    if (field === "contactNumber") {
      // Validate phone number length
      if (value.length > 0 && value.length !== 10) {
        setPhoneError(`Phone number must be 10 digits. Current: ${value.length}`);
      } else {
        setPhoneError("");
      }
      
      // Update WhatsApp number if checkbox is checked
      if (sameAsContact) {
        setFormData(prev => ({ ...prev, [field]: value, whatsappNumber: value }));
        return;
      }
    }
    
    if (field === "city") {
      // If city changed and not Indore, clear the locality
      if (value.toLowerCase() !== "indore") {
        setFormData(prev => ({ ...prev, locality: "" }));
      }
    }
    
    // If lineup company is set to others, also set lineup process to others
    if (field === "lineupCompany" && value === "others") {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        lineupProcess: "others"
      }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSameAsContactChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsContact(isChecked);
    
    if (isChecked) {
      // Copy contact number to WhatsApp number
      setFormData(prev => ({ 
        ...prev, 
        sameAsContact: true,
        whatsappNumber: prev.contactNumber
      }));
    } else {
      // Clear the WhatsApp number when unchecked
      setFormData(prev => ({ 
        ...prev, 
        sameAsContact: false,
        whatsappNumber: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate lineup fields if status is "lineup"
    if (formData.callStatus === "lineup" && 
        (!formData.lineupCompany || !formData.lineupProcess || 
         !formData.lineupDate || !formData.interviewDate)) {
      alert("Please fill in all lineup fields");
      return;
    }

    // Validate walkin date if status is "walkin"
    if (formData.callStatus === "walkin" && !formData.walkinDate) {
      alert("Please provide a walkin date");
      return;
    }
    
    // Save to localStorage for CallDetails page
    const callDetailsData = JSON.parse(localStorage.getItem('callDetails') || '[]');
    
    const newCall = {
      id: Date.now(),
      customerName: formData.candidateName,
      phoneNumber: formData.contactNumber,
      whatsappNumber: formData.whatsappNumber,
      company: formData.companyProfile,
      profile: formData.companyProfile,
      callDate: new Date().toISOString().split('T')[0],
      callTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      callDuration: formData.callDuration,
      callType: "Inquiry",
      callSummary: formData.callSummary,
      // Additional fields to save
      source: formData.source,
      gender: formData.gender,
      experience: formData.experience,
      qualification: formData.qualification,
      state: formData.state,
      city: formData.city,
      locality: formData.locality || "",
      salaryExpectations: formData.salaryExpectations,
      levelOfCommunication: formData.levelOfCommunication,
      noticePeriod: formData.noticePeriod,
      shiftPreference: formData.shiftPreference,
      relocation: formData.relocation,
      callStatus: formData.callStatus,
      // Add lineup fields if status is lineup
      lineupCompany: formData.callStatus === "lineup" ? 
        (formData.lineupCompany === "others" ? formData.customLineupCompany : formData.lineupCompany) : "",
      lineupProcess: formData.callStatus === "lineup" ? 
        (formData.lineupProcess === "others" ? formData.customLineupProcess : formData.lineupProcess) : "",
      lineupDate: formData.callStatus === "lineup" ? formData.lineupDate : "",
      interviewDate: formData.callStatus === "lineup" ? formData.interviewDate : "",
      // Add walkin date if status is walkin
      walkinDate: formData.callStatus === "walkin" ? formData.walkinDate : ""
    };
    
    callDetailsData.push(newCall);
    localStorage.setItem('callDetails', JSON.stringify(callDetailsData));
    
    // If call status is "lineup", also save to lineups storage
    if (formData.callStatus === "lineup") {
      // Get existing lineups
      const existingLineups = JSON.parse(localStorage.getItem("lineups") || "[]");
      
      // Create new lineup object
      const lineupData = {
        id: Date.now() + 1, // Different ID from the call
        candidateName: formData.candidateName,
        contactNumber: formData.contactNumber,
        company: formData.lineupCompany === "others" ? formData.customLineupCompany : formData.lineupCompany,
        process: formData.lineupProcess === "others" ? formData.customLineupProcess : formData.lineupProcess,
        lineupDate: formData.lineupDate,
        interviewDate: formData.interviewDate,
        status: "scheduled", // Default lineup status
        callDetailId: newCall.id
      };
      
      // Add to lineups
      existingLineups.push(lineupData);
      
      // Save to localStorage
      localStorage.setItem("lineups", JSON.stringify(existingLineups));
    }

    // If call status is "walkin", also save to walkins storage
    if (formData.callStatus === "walkin") {
      // Get existing walkins
      const existingWalkins = JSON.parse(localStorage.getItem("walkins") || "[]");
      
      // Create new walkin object
      const walkinData = {
        id: Date.now() + 1, // Different ID from the call
        candidateName: formData.candidateName,
        contactNumber: formData.contactNumber,
        walkinDate: formData.walkinDate,
        status: "pending", // Default walkin status (pending, walkedin, did_not_come)
        summary: formData.callSummary,
        callDetailId: newCall.id
      };
      
      // Add to walkins
      existingWalkins.push(walkinData);
      
      // Save to localStorage
      localStorage.setItem("walkins", JSON.stringify(existingWalkins));
    }
    
    alert("Call information submitted successfully!");
    console.log(formData);
    
    // Reset form data after submission
    setFormData({
      candidateName: "",
      source: "",
      gender: "",
      contactNumber: "",
      whatsappNumber: "",
      sameAsContact: false,
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
      companyProfile: "",
      callStatus: "",
      callSummary: "",
      callDuration: "",
      lineupCompany: "",
      customLineupCompany: "",
      lineupProcess: "",
      customLineupProcess: "",
      lineupDate: "",
      interviewDate: "",
      walkinDate: ""
    });
    
    // Reset the same as contact checkbox
    setSameAsContact(false);
    
    // Navigate back to call details page
    navigate('/call-details');
  };

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

  // Generate call duration options
  const callDurationOptions = Array.from({ length: 30 }, (_, i) => ({
    value: `${i + 1}`, 
    label: `${i + 1} ${i === 0 ? 'Minute' : 'Minutes'}`
  }));
  callDurationOptions.unshift({ value: "", label: "Select Duration" });

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

  // All fields in a single flat array - rearranged as requested
  const fields = [
    { label: "Candidate's Name", key: "candidateName", icon: <MdPerson />, required: true, inputClass: "w-full" },
    { 
      label: "Mobile No.", 
      key: "contactNumber", 
      icon: <MdPhone />, 
      type: "tel", 
      pattern: "[0-9]{10}", 
      maxLength: 10, 
      required: true, 
      inputClass: "w-full", 
      ref: contactInputRef
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
    { label: "Source", key: "source", icon: <MdSource />, type: "select", options: [
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
    ], required: true, inputClass: "w-full" },
    { label: "Gender", key: "gender", icon: <MdPerson />, type: "select", options: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "others", label: "Others" }
    ], required: true, inputClass: "w-full" },
    { label: "Experience", key: "experience", icon: <MdWork />, type: "select", options: [
      { value: "", label: "Select Experience" },
      { value: "fresher", label: "Fresher" },
      { value: "experienced", label: "Experienced" }
    ], required: true, inputClass: "w-full" },
    { label: "Qualification", key: "qualification", icon: <MdSchool />, required: true, inputClass: "w-full" },
    { label: "State", key: "state", icon: <MdPublic />, type: "select", options: indianStates, required: true, inputClass: "w-full" },
    { label: "City", key: "city", icon: <MdLocationCity />, required: true, inputClass: "w-full" },
    { label: "Salary Expectation", key: "salaryExpectations", icon: <IoCashOutline />, required: true, inputClass: "w-full" },
    { label: "Communication", key: "levelOfCommunication", icon: <MdMessage />, type: "select", options: [
      { value: "", label: "Select Level" },
      { value: "hindi", label: "Hindi" },
      { value: "below_average", label: "Below Average" },
      { value: "average", label: "Average" },
      { value: "above_average", label: "Above Average" },
      { value: "good", label: "Good" },
      { value: "excellent", label: "Excellent" }
    ], required: true, inputClass: "w-full" },
    { label: "Notice Period", key: "noticePeriod", icon: <MdTimer />, type: "select", options: [
      { value: "", label: "Select Notice Period" },
      { value: "immediate", label: "Immediate Joiner" },
      { value: "7days", label: "7 Days" },
      { value: "15days", label: "15 Days" },
      { value: "30days", label: "30 Days" },
      { value: "45days", label: "45 Days" },
      { value: "60days", label: "60 Days" },
      { value: "90days", label: "90 Days" },
      { value: "more_than_90", label: "More than 90 Days" }
    ], required: true, inputClass: "w-full" },
    { label: "Shift", key: "shiftPreference", icon: <MdAccessTime />, type: "select", options: [
      { value: "", label: "Select Shift" },
      { value: "day", label: "Day Shift" },
      { value: "night", label: "Night Shift" },
      { value: "any", label: "Any Shift Works" }
    ], required: true, inputClass: "w-full" },
    { label: "Relocation", key: "relocation", icon: <MdShare />, type: "select", options: [
      { value: "", label: "Select" },
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ], required: true, inputClass: "w-full" },
    { label: "Company/Profile", key: "companyProfile", icon: <MdBusinessCenter />, required: true, inputClass: "w-full" },
    { label: "Call Status", key: "callStatus", icon: <MdWifiCalling3 />, type: "select", options: [
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
    ], required: true, inputClass: "w-full" },
    { 
      label: "Walkin Date", 
      key: "walkinDate", 
      icon: <MdAccessTime />, 
      type: "date",
      required: formData.callStatus === "walkin",
      inputClass: "w-full",
      hidden: formData.callStatus !== "walkin" 
    },
    { 
      label: "Lineup Company", 
      key: "lineupCompany", 
      icon: <MdBusinessCenter />, 
      type: "select", 
      options: lineupCompanyOptions,
      required: formData.callStatus === "lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "lineup" 
    },
    { 
      label: "Lineup Process", 
      key: "lineupProcess", 
      icon: <MdBusinessCenter />, 
      type: "select", 
      options: lineupProcessOptions,
      required: formData.callStatus === "lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "lineup" 
    },
    { 
      label: "Lineup Date", 
      key: "lineupDate", 
      icon: <MdAccessTime />, 
      type: "date",
      required: formData.callStatus === "lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "lineup" 
    },
    { 
      label: "Interview Date", 
      key: "interviewDate", 
      icon: <MdAccessTime />, 
      type: "date",
      required: formData.callStatus === "lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "lineup" 
    },
    { label: "Call Duration", key: "callDuration", icon: <MdWatch />, type: "select", options: callDurationOptions, required: true, inputClass: "w-full" },
  ];

  // Show locality field only when city is Indore
  const showLocalityField = formData.city.toLowerCase() === "indore";

  return (
    <div className={`min-h-screen px-6 py-5 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'}`}>
            Call Information
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* All fields in a grid layout */}
          <div className={`rounded-xl p-5 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
              {fields.map(({ label, key, type, icon, inputClass, options, required, pattern, maxLength, ref, hasCheckbox, checkboxLabel, disabled, hidden }) => {
                // Skip rendering if the field should be hidden
                if (hidden) {
                  return null;
                }
                
                // Insert locality field right after city field when city is Indore
                if (key === "city" && showLocalityField) {
                  return (
                    <React.Fragment key={key}>
                      <div className="flex flex-col relative">
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-lg">{icon}</span>
                          {label}
                          {required && <span className="text-red-500">*</span>}
                        </label>
                        {type === "select" ? (
                          <select
                            value={formData[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            required={required}
                            className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass}`}
                          >
                            {options && options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={type || "text"}
                            value={formData[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={label}
                            required={required}
                            pattern={pattern}
                            maxLength={maxLength}
                            ref={ref}
                            disabled={disabled}
                            className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                                disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                              }`}
                          />
                        )}
                      </div>
                      
                      {/* Show validation error for contact number */}
                      {key === "contactNumber" && phoneError && (
                        <div className="text-xs text-red-500 mt-1">{phoneError}</div>
                      )}
                      
                      {/* Locality Field */}
                      <div className="flex flex-col">
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-lg"><MdLocationOn /></span>
                          Locality
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.locality}
                          onChange={(e) => handleChange("locality", e.target.value)}
                          placeholder="Enter locality"
                          required={true}
                          className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                        />
                      </div>
                    </React.Fragment>
                  );
                }
                
                // Skip locality field as it's handled separately
                if (key === "locality") return null;
                
                return (
                  <div key={key} className="flex flex-col relative">
                    <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="text-lg">{icon}</span>
                      {label}
                      {required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {type === "select" ? (
                      <>
                        <select
                          value={formData[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          required={required}
                          className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass}`}
                        >
                          {options && options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        {/* Show text input for custom company when "others" is selected */}
                        {key === "lineupCompany" && formData.lineupCompany === "others" && (
                          <input
                            type="text"
                            value={formData.customLineupCompany || ""}
                            onChange={(e) => handleChange("customLineupCompany", e.target.value)}
                            placeholder="Enter custom company name"
                            required={true}
                            className={`mt-2 px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                          />
                        )}
                        
                        {/* Show text input for custom process when "others" is selected */}
                        {key === "lineupProcess" && formData.lineupProcess === "others" && (
                          <input
                            type="text"
                            value={formData.customLineupProcess || ""}
                            onChange={(e) => handleChange("customLineupProcess", e.target.value)}
                            placeholder="Enter custom process name"
                            required={true}
                            className={`mt-2 px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                          />
                        )}
                        
                        {/* Show text input for custom company/profile when "others" is selected */}
                        {key === "companyProfile" && formData.companyProfile === "others" && (
                          <input
                            type="text"
                            value={formData.customCompanyProfile || ""}
                            onChange={(e) => handleChange("customCompanyProfile", e.target.value)}
                            placeholder="Enter custom profile"
                            required={true}
                            className={`mt-2 px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type={type || "text"}
                          value={formData[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={label}
                          required={required}
                          pattern={pattern}
                          maxLength={maxLength}
                          disabled={disabled}
                          className={`px-3 py-2 h-10 text-base rounded-lg ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                              disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                            }`}
                        />
                        
                        {/* Show validation error for contact number */}
                        {key === "contactNumber" && phoneError && (
                          <div className="text-xs text-red-500 mt-1">{phoneError}</div>
                        )}
                        
                        {/* Checkbox for copying contact number to WhatsApp */}
                        {hasCheckbox && (
                          <div className="mt-1">
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sameAsContact}
                                onChange={handleSameAsContactChange}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSameAsContactChange({ target: { checked: !sameAsContact } });
                                  }
                                }}
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

            {/* Call Summary Field */}
            <div className="mt-4">
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-lg"><MdNotes /></span>
                Call Summary
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.callSummary}
                onChange={(e) => handleChange("callSummary", e.target.value)}
                placeholder="Enter call summary..."
                required
                className={`px-3 py-2 h-24 w-full text-base rounded-lg ${darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                  : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} resize-none`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className={`px-6 py-3 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-lg text-base shadow-lg flex items-center gap-2 transition-colors`}
            >
              <FaSave className="text-lg" />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CallInfo;
