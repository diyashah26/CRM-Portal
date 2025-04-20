import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDateRange,
  MdAccountBalance,
  MdPerson,
  MdNumbers,
  MdWork,
  MdHome,
} from "react-icons/md";

function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Set initial theme immediately before render to prevent flash
  useEffect(() => {
    // Set initial theme state immediately
    const isDark = localStorage.theme === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const updateThemeState = () => {
      const isDark = localStorage.theme === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
    };

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

  const [profile, setProfile] = useState({
    image:
      "https://www.shutterstock.com/shutterstock/photos/2445591577/display_1500/stock-photo-passport-photo-portrait-of-woman-on-white-background-2445591577.jpg",
    name: "John Doe",
    empCode: "EMP001",
    designation: "Software Developer",
    contact: "9876543210",
    email: "john@example.com",
    joiningDate: "2022-01-10",
    dob: "1995-06-15",
    address: "123, Main Street, Delhi - 110001",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "9988776655",
    relation: "Spouse",
    bankName: "State Bank of India",
    branchName: "MG Road",
    ifsc: "SBIN0001234",
    accountNumber: "123456789012",
    reAccountNumber: "123456789012",
    beneficiaryAddress: "123, Main Street, Delhi - 110001",
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, image: imageUrl });
    }
  };

  const handleSave = () => {
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  // Define fields by section
  const employeeFields = [
    { 
      label: "Employee Name", 
      key: "name", 
      icon: <MdPerson />, 
      maxLength: 50,
      inputClass: "w-full"
    },
    { 
      label: "Emp Code", 
      key: "empCode", 
      icon: <MdNumbers />, 
      maxLength: 10,
      inputClass: "w-full"
    },
    { 
      label: "Designation", 
      key: "designation", 
      icon: <MdWork />, 
      maxLength: 50,
      inputClass: "w-full"
    },
    { 
      label: "Contact Number", 
      key: "contact", 
      icon: <MdPhone />, 
      type: "tel",
      pattern: "[0-9]{10}",
      maxLength: 10,
      inputClass: "w-full"
    },
    { 
      label: "Email ID", 
      key: "email", 
      icon: <MdEmail />, 
      type: "email",
      maxLength: 50,
      inputClass: "w-full"
    },
    { 
      label: "Joining Date", 
      key: "joiningDate", 
      type: "date", 
      icon: <MdDateRange />, 
      inputClass: "w-full"
    }
  ];

  const personalFields = [
    { 
      label: "Date Of Birth", 
      key: "dob", 
      type: "date", 
      icon: <MdDateRange />, 
      inputClass: "w-full"
    },
    {
      label: "Address",
      key: "address",
      icon: <MdHome />,
      maxLength: 200,
      inputClass: "w-full"
    },
    { 
      label: "Emergency Contact Name", 
      key: "emergencyContactName", 
      icon: <MdPerson />, 
      maxLength: 50,
      inputClass: "w-full"
    },
    { 
      label: "Emergency Contact Number", 
      key: "emergencyContactNumber", 
      icon: <MdPhone />, 
      type: "tel",
      pattern: "[0-9]{10}",
      maxLength: 10,
      inputClass: "w-full"
    },
    { 
      label: "Relation", 
      key: "relation", 
      icon: <MdPerson />, 
      maxLength: 30,
      inputClass: "w-full"
    }
  ];

  const bankFields = [
    { 
      label: "Bank Name", 
      key: "bankName", 
      icon: <MdAccountBalance />, 
      maxLength: 50,
      inputClass: "w-full"
    },
    { 
      label: "Branch", 
      key: "branchName", 
      icon: <MdAccountBalance />, 
      maxLength: 50,
      inputClass: "w-full"
    },
    { 
      label: "IFSC", 
      key: "ifsc", 
      icon: <MdNumbers />, 
      maxLength: 11,
      inputClass: "w-full"
    },
    { 
      label: "Account Number", 
      key: "accountNumber", 
      icon: <MdNumbers />, 
      maxLength: 18,
      inputClass: "w-full"
    },
    { 
      label: "Re-Enter Account Number", 
      key: "reAccountNumber", 
      icon: <MdNumbers />, 
      maxLength: 18,
      inputClass: "w-full"
    },
    { 
      label: "Beneficiary Address", 
      key: "beneficiaryAddress", 
      icon: <MdLocationOn />, 
      maxLength: 200,
      inputClass: "w-full"
    }
  ];

  // Render a section of fields
  const renderFields = (fields) => {
    return fields.map(({ label, key, type, icon, inputClass, maxLength, pattern }) => (
      <div key={key} className="flex flex-col">
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className="text-lg">{icon}</span>
          {label}
        </label>
        {editMode ? (
          <input
            type={type || "text"}
            value={profile[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={label}
            maxLength={maxLength}
            pattern={pattern}
            className={`px-3 py-2 text-base rounded-lg ${darkMode 
              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
              : 'border-gray-300 bg-white focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass}`}
          />
        ) : (
          <div className={`px-3 py-2 text-base rounded-lg border overflow-hidden ${darkMode 
            ? 'border-gray-600 bg-gray-700 text-white' 
            : 'border-gray-200 bg-white text-gray-800'} ${inputClass} flex items-center`}>
            {profile[key]}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="h-full flex flex-col p-4">
        {/* User Information Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Profile Image - removed border */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden group flex-shrink-0 shadow-md">
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {editMode && (
                  <>
                    <label
                      htmlFor="imageUpload"
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <FaCamera className="text-white text-xl" />
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-[#e2692c]' : 'text-[#1a5d96]'} tracking-tight`}>
                  {profile.name}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-semibold">Employee Code:</span> {profile.empCode}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                  {profile.designation}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => editMode ? handleSave() : setEditMode(true)}
                className={`px-4 py-2 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-lg text-sm shadow-md flex items-center gap-2 transition-all duration-300`}
              >
                {editMode ? (
                  <>
                    <FaSave /> Save Changes
                  </>
                ) : (
                  <>
                    <FaEdit /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content with sections */}
        <div className="flex-1 overflow-hidden pr-2">
          <div className="grid grid-cols-3 gap-4">
            {/* Employee Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-[#1a5d96] dark:text-[#e2692c]">Employee Details</h3>
              </div>
              <div className="p-4 overflow-hidden">
                <div className="grid grid-cols-1 gap-4">
                  {renderFields(employeeFields)}
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-[#1a5d96] dark:text-[#e2692c]">Personal Details</h3>
              </div>
              <div className="p-4 overflow-hidden">
                <div className="grid grid-cols-1 gap-4">
                  {renderFields(personalFields)}
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-[#1a5d96] dark:text-[#e2692c]">Bank Details</h3>
              </div>
              <div className="p-4 overflow-hidden">
                <div className="grid grid-cols-1 gap-4">
                  {renderFields(bankFields)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
