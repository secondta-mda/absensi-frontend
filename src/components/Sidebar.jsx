import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarCheck,
  faUser,
  faTimes,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function Sidebar({ active }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Tutup sidebar ketika resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    {
      key: "home",
      label: <p className="mt-[5px]">Home</p>,
      icon: <FontAwesomeIcon icon={faHome} className="mr-2" />,
      path: "/",
    },
    {
      key: "absensi",
      label: <p className="mt-[5px]">Absensi</p>,
      icon: <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />,
      path: "/absensi/masuk",
    },
    {
      key: "profil",
      label: <p className="mt-[5px]">Profil</p>,
      icon: <FontAwesomeIcon icon={faUser} className="mr-2" />,
      path: "/profil",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed md:hidden z-10 bottom-4 right-4 bg-gray-700 text-white py-3 px-4 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* Overlay untuk mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 shadow-lg border-r border-gray-800 z-20 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-64 w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 font-bold text-gray-100 text-xl border-b border-gray-800 flex justify-between items-center">
            <span>Menu</span>
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <ul className="flex-1 p-2 space-y-2 overflow-y-auto">
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center text-left px-4 py-2 rounded-lg transition font-medium ${
                    active === item.key
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
