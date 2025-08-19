import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

function useClock(active = true) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [active]);
  return time.toLocaleTimeString();
}

export function Absensi() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photo, setPhoto] = useState(null);
  const webcamRef = useRef(null);
  const location = useLocation();
  const type = location.pathname.includes("pulang") ? "pulang" : "masuk";
  const clock = useClock(!photoTaken);
  const username = localStorage.getItem('username') || 'Guest User';

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setPhotoTaken(true);
  };

  const resetPhoto = () => {
    setPhoto(null);
    setPhotoTaken(false);
  };

  const handleSubmit = () => {
    // Implementasi pengiriman foto
    alert(`Absensi ${type} berhasil dikirim!`);
    resetPhoto();
  };

  return (
    <div className="flex flex-col h-screen lexend-deca-font">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
            Absensi {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          
          {/* Main Card */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 col-span-2">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  {photo ? (
                    <img src={photo} alt="Captured" className="object-cover" />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="object-cover"
                    />
                  )}
                </div>
                
                <div className="text-3xl font-bold mb-2">{clock}</div>
                <div className="text-xl font-semibold text-gray-600 mb-6 capitalize">{username}</div>
                
                <div className="flex gap-4 w-full">
                  {photoTaken ? (
                    <>
                      <button
                        onClick={resetPhoto}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition"
                      >
                        Kirim
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={capture}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition"
                    >
                      Ambil Foto
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Attendance Cards */}
            <div className="space-y-4 text-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <div className="text-xl font-bold mb-2">
                    <FontAwesomeIcon icon={faArrowRightToBracket} /> Masuk
                  </div>
                  <div className="text-2xl font-mono mb-2">08:00:15</div>
                  <div className='text-sm text-gray-600'>
                    Terlambat
                  </div>
                </div>
            </div>
            <div className="space-y-4 text-center">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <div className="text-xl font-bold mb-2">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} /> Pulang
                  </div>
                  <div className="text-2xl font-mono mb-2">17:30:45</div>
                  <div className='text-sm text-gray-600'>
                    Lembur
                  </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}