import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export function Navbar({ onToggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-800 text-white px-4 py-3 flex items-center justify-between shadow-md z-30 sticky top-0">
      {/* Left Section - Logo & Toggle (Mobile) */}
      <div className="flex items-center">
        <div className="font-bold text-lg">Absensi MDA</div>
      </div>

      {/* Right Section - User & Logout */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
          <span>User</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-40">
            <button
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();

                setIsDropdownOpen(false);

                window.location.href = "/";
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 w-full text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
