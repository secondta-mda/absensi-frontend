import { useState, useEffect, useRef } from "react";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

// Simple spinner component
function Spinner({ size = 40, color = "#ff0000" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin"
      style={{ display: "block", margin: "auto" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="90"
        strokeDashoffset="60"
      />
    </svg>
  );
}

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
  const [stream, setStream] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [absensiStatus, setAbsensiStatus] = useState(null);
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [initializationComplete, setInitializationComplete] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.pathname.includes("pulang") ? "pulang" : "masuk";
  const clock = useClock(!photoTaken);

  // Fungsi untuk menampilkan SweetAlert dengan auto-close
  const showAlert = (icon, title, text, timer = 2500) => {
    return Swal.fire({
      icon,
      title,
      text,
      timer,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  };

  // Cleanup camera stream
  const cleanupCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Camera track stopped:", track.label);
      });
      setStream(null);
    }
  };

  // Enhanced camera initialization with better mobile support
  // Enhanced camera initialization with broad compatibility
  const initializeCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);

    try {
      // Stop existing stream first
      cleanupCamera();

      // Default constraints yang ringan (aman di semua device)
      let constraints = {
        video: true, // biarkan browser pilih resolusi terbaik
        audio: false,
      };

      // Deteksi environment
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        constraints = {
          video: {
            facingMode: "user", // kamera depan (selfie)
          },
          audio: false,
        };
      }

      console.log("Requesting camera access with constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Tunggu metadata lalu paksa play()
        await new Promise((resolve, reject) => {
          const video = videoRef.current;

          const onLoadedMetadata = async () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            try {
              await video.play(); // ⬅️ WAJIB
              console.log("Video started playing");
              resolve();
            } catch (err) {
              console.error("Video play() failed:", err);
              reject(err);
            }
          };

          const onError = (error) => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            reject(error);
          };

          video.addEventListener("loadedmetadata", onLoadedMetadata);
          video.addEventListener("error", onError);
        });
      }

      setStream(mediaStream);
      console.log("Camera initialized successfully");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(err.message);

      let errorMessage = "Tidak dapat mengakses kamera.";
      if (err.name === "NotAllowedError") {
        errorMessage =
          "Akses kamera ditolak. Pastikan Anda memberikan izin kamera.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "Kamera tidak ditemukan pada perangkat ini.";
      } else if (err.name === "NotSupportedError") {
        errorMessage = "Kamera tidak didukung pada browser ini.";
      }

      showAlert("error", "Kamera Tidak Dapat Diakses", errorMessage);
    } finally {
      setCameraLoading(false);
    }
  };

  // Initialize user data and check browser compatibility
  // Dalam useEffect initializeApp, perbaiki parsing userData
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Browser tidak mendukung akses kamera");
        }

        // Get user data from localStorage
        const userDataStr = localStorage.getItem("userData");
        console.log("Raw userData from localStorage:", userDataStr);

        if (!userDataStr) {
          console.error("No userData found in localStorage");
          navigate("/login");
          return;
        }

        let parsedData;
        try {
          parsedData = JSON.parse(userDataStr);
        } catch (parseError) {
          console.error("Failed to parse userData:", parseError);
          localStorage.removeItem("userData"); // Clean corrupted data
          navigate("/login");
          return;
        }

        // PERBAIKAN DI SINI: Handle both response format and direct user object
        let user;
        if (parsedData.success && parsedData.data) {
          // Format: {"success":true,"data":{...}}
          user = parsedData.data;
        } else if (parsedData.id && parsedData.username) {
          // Format: {"id":1,"username":"a",...}
          user = parsedData;
        } else {
          console.error("Invalid user data structure:", parsedData);
          localStorage.removeItem("userData");
          navigate("/login");
          return;
        }

        if (!user || !user.id) {
          console.error("Invalid user data:", user);
          localStorage.removeItem("userData");
          navigate("/login");
          return;
        }

        setUserData(user);
        console.log("User data loaded successfully:", user);

        // Test API connection
        console.log("Testing API connection...");
        if (process.env.REACT_APP_API_URL) {
          console.log("API URL configured:", process.env.REACT_APP_API_URL);
        } else {
          console.warn("REACT_APP_API_URL not configured");
        }
      } catch (error) {
        console.error("App initialization error:", error);
        showAlert("error", "Kesalahan Inisialisasi", error.message);
      } finally {
        setInitializationComplete(true);
      }
    };

    initializeApp();
  }, [navigate]);

  // Check absensi status when user data is available
  useEffect(() => {
    const checkAbsensiStatus = async () => {
      if (!userData?.id || !initializationComplete) return;

      const timeoutId = setTimeout(() => {
        console.warn("API call timeout - proceeding with default status");
        setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
        setLoadingStatus(false);
        showAlert(
          "warning",
          "Koneksi Lambat",
          "Menggunakan mode offline. Beberapa fitur mungkin terbatas.",
          3000
        );
      }, 10000); // 10 second timeout

      try {
        setLoadingStatus(true);
        console.log("Checking absensi status for user:", userData.id);
        console.log("API URL:", process.env.REACT_APP_API_URL);

        // Check if API URL is configured
        if (!process.env.REACT_APP_API_URL) {
          throw new Error(
            "API URL tidak dikonfigurasi. Periksa file environment."
          );
        }

        const apiUrl = `${process.env.REACT_APP_API_URL}/absensi/status/${userData.id}`;
        console.log("Making request to:", apiUrl);

        const controller = new AbortController();
        const timeoutSignal = setTimeout(() => {
          console.log("Request timeout, aborting...");
          controller.abort();
        }, 8000); // 8 second request timeout

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutSignal);
        clearTimeout(timeoutId);

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error text:", errorText);

          if (response.status === 404) {
            // User belum pernah absen, set default status
            console.log(
              "User belum pernah absen (404), setting default status"
            );
            setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
            setLoadingStatus(false);
            return;
          } else if (response.status === 500) {
            console.error("Server error (500)");
            throw new Error(`Server error: ${errorText}`);
          }

          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("Absensi status result:", result);

        if (result && result.success && result.data) {
          setAbsensiStatus(result.data);

          // Redirect berdasarkan status absensi
          if (!result.data.sudah_masuk) {
            if (location.pathname.includes("pulang")) {
              console.log("Redirecting to masuk - user has not checked in");
              navigate("/absensi/masuk");
              return;
            }
          } else if (!result.data.sudah_pulang) {
            if (location.pathname.includes("masuk")) {
              console.log("Redirecting to pulang - user already checked in");
              navigate("/absensi/pulang");
              return;
            }
          }
        } else {
          console.warn("Unexpected response format:", result);
          // Fallback ke status default
          setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("Error checking absensi status:", error);

        if (error.name === "AbortError") {
          console.log("Request was aborted due to timeout");
          setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
          showAlert(
            "warning",
            "Koneksi Timeout",
            "Server tidak merespons. Menggunakan mode offline sementara.",
            3000
          );
        } else if (
          error.name === "TypeError" &&
          error.message.includes("Failed to fetch")
        ) {
          console.log("Network error - possibly CORS or server down");
          setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
          showAlert(
            "error",
            "Koneksi Gagal",
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
            4000
          );
        } else {
          // Set default status agar app tetap berfungsi
          setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
          showAlert(
            "error",
            "Terjadi Kesalahan",
            `Gagal memuat status absensi: ${error.message}`,
            4000
          );
        }
      } finally {
        setLoadingStatus(false);
      }
    };

    checkAbsensiStatus();
  }, [userData, location.pathname, navigate, initializationComplete]);

  // Fetch riwayat absensi
  const fetchRiwayatAbsensiHariIni = async () => {
    if (!userData?.id) return;

    try {
      console.log("Fetching riwayat absensi...");

      const controller = new AbortController();
      const timeoutSignal = setTimeout(() => controller.abort(), 5000); // 5 second timeout for riwayat

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/absensi/hari-ini/${userData.id}`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutSignal);

      if (!response.ok) {
        if (response.status === 404) {
          // No history found, set empty array
          setRiwayatAbsensi([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setRiwayatAbsensi(result.data || []);
        console.log("Riwayat absensi loaded:", result.data);
      } else {
        setRiwayatAbsensi([]);
      }
    } catch (error) {
      console.error("Error fetching riwayat absensi hari ini:", error);
      if (error.name !== "AbortError") {
        console.log("Setting empty riwayat due to error");
      }
      setRiwayatAbsensi([]);
      // Don't show alert for riwayat fetch error to avoid too many alerts
    }
  };

  // Load riwayat when absensi status is loaded
  useEffect(() => {
    if (absensiStatus && userData?.id) {
      fetchRiwayatAbsensiHariIni();
    }
  }, [absensiStatus, userData]);

  // Initialize camera when conditions are met
  useEffect(() => {
    const shouldInitializeCamera =
      !loadingStatus &&
      initializationComplete &&
      !photoTaken &&
      absensiStatus &&
      !(absensiStatus.sudah_masuk && absensiStatus.sudah_pulang) &&
      !stream;

    if (shouldInitializeCamera) {
      console.log("Initializing camera...");
      initializeCamera();
    }

    // Cleanup on unmount
    return () => {
      cleanupCamera();
    };
  }, [
    loadingStatus,
    initializationComplete,
    photoTaken,
    absensiStatus,
    stream,
  ]);

  const username = userData?.username || "Guest User";
  const jamMasuk = userData?.jam_masuk || "08:00:00";
  const jamPulang = userData?.jam_pulang || "17:00:00";

  // Format tanggal Indonesia
  const formatTanggal = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  // Format waktu dari database
  const formatWaktu = (waktu) => {
    if (!waktu) return "-";
    return new Date(waktu).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageUrl = canvas.toDataURL("image/jpeg", 0.8); // Added quality parameter
      setPhoto(imageUrl);
      setPhotoTaken(true);

      cleanupCamera();
      console.log("Photo captured successfully");
    }
  };

  const resetPhoto = async () => {
    await showAlert(
      "info",
      "Mengatur Ulang",
      "Kamera akan diatur ulang...",
      1500
    );

    setPhoto(null);
    setPhotoTaken(false);
    setCameraError(null);

    // Initialize camera again
    await initializeCamera();
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      if (!photo) throw new Error("Tidak ada gambar yang diambil");

      const blob = await fetch(photo).then((res) => res.blob());
      if (!blob.type.match(/image\/(jpeg|png|jpg)/)) {
        throw new Error("Format gambar harus JPG/PNG");
      }

      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", blob);
      cloudinaryForm.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      cloudinaryForm.append(
        "cloud_name",
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
      );

      console.log("Uploading to Cloudinary...");
      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: cloudinaryForm,
        }
      );

      if (!cloudinaryRes.ok) {
        const errorText = await cloudinaryRes.text();
        throw new Error(`Cloudinary error: ${errorText}`);
      }

      const cloudinaryData = await cloudinaryRes.json();
      console.log("Image uploaded to Cloudinary successfully");

      console.log("Submitting absensi to backend...");
      const backendController = new AbortController();
      const backendTimeoutSignal = setTimeout(
        () => backendController.abort(),
        15000
      ); // 15 second timeout for backend

      const backendRes = await fetch(`${process.env.REACT_APP_API_URL}/absen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData?.id,
          type: type,
          image_url: cloudinaryData.secure_url,
          jam_masuk_user: userData?.jam_masuk,
          jam_pulang_user: userData?.jam_pulang,
        }),
        signal: backendController.signal,
      });

      clearTimeout(backendTimeoutSignal);

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menyimpan absensi");
      }

      const responseData = await backendRes.json();
      console.log("Absensi submitted successfully:", responseData);

      await showAlert(
        "success",
        "Absensi Berhasil",
        `Absensi ${type} berhasil! Status: ${responseData.data.keterangan}`
      );

      // Refresh status absensi setelah berhasil
      try {
        const statusController = new AbortController();
        const statusTimeoutSignal = setTimeout(
          () => statusController.abort(),
          5000
        );

        const statusResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/absensi/status/${userData.id}`,
          { signal: statusController.signal }
        );

        clearTimeout(statusTimeoutSignal);

        if (statusResponse.ok) {
          const statusResult = await statusResponse.json();
          if (statusResult.success) {
            setAbsensiStatus(statusResult.data);
          }
        }
      } catch (statusError) {
        console.log("Failed to refresh status, but absensi was successful");
      }

      // Reset foto setelah alert selesai
      setPhoto(null);
      setPhotoTaken(false);
      setCameraError(null);
    } catch (error) {
      console.error("Submit error:", error);
      await showAlert(
        "error",
        "Absensi Gagal",
        error.message || "Terjadi kesalahan saat mengirim absensi"
      );

      // Reset foto setelah alert error selesai
      setPhoto(null);
      setPhotoTaken(false);
      setCameraError(null);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading screen while initializing
  if (!initializationComplete || loadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto p-6">
          <Spinner size={60} color="#ff0000" />
          <span className="text-[#ff0000] font-bold text-lg animate-pulse text-center">
            {!initializationComplete
              ? "Menginisialisasi..."
              : "Memuat status..."}
          </span>

          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: !initializationComplete
                  ? "30%"
                  : loadingStatus
                  ? "70%"
                  : "100%",
              }}
            ></div>
          </div>

          {loadingStatus && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Menghubungkan ke server...
              </p>
              <p className="text-xs text-gray-500 mb-3">
                API: {process.env.REACT_APP_API_URL || "Tidak dikonfigurasi"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition mr-2"
              >
                Muat Ulang Halaman
              </button>
              <button
                onClick={() => {
                  setAbsensiStatus({ sudah_masuk: false, sudah_pulang: false });
                  setLoadingStatus(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition"
              >
                Lanjut Offline
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const sudahAbsenHariIni =
    absensiStatus?.sudah_masuk && absensiStatus?.sudah_pulang;

  return (
    <div className="flex flex-col h-screen lexend-deca-font">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
            Absensi {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>

          {/* Status Absensi Hari Ini */}
          {absensiStatus && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                Status Absensi Hari Ini
              </h3>
              <div className="flex gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    absensiStatus.sudah_masuk
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      absensiStatus.sudah_masuk ? faCheckCircle : faTimesCircle
                    }
                  />
                  <span>
                    Masuk: {absensiStatus.sudah_masuk ? "Sudah" : "Belum"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    absensiStatus.sudah_pulang
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      absensiStatus.sudah_pulang ? faCheckCircle : faTimesCircle
                    }
                  />
                  <span>
                    Pulang: {absensiStatus.sudah_pulang ? "Sudah" : "Belum"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Card - Hanya tampil jika belum absen lengkap */}
          {!sudahAbsenHariIni && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 col-span-2 mb-6 text-center">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 rounded-xl overflow-hidden w-full max-w-2xl min-h-[300px] flex items-center justify-center bg-gray-100">
                  {cameraLoading ? (
                    <div className="flex flex-col items-center">
                      <Spinner size={40} color="#ff0000" />
                      <span className="text-[#ff0000] font-bold animate-pulse">
                        Memuat Kamera...
                      </span>
                    </div>
                  ) : cameraError ? (
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="text-red-500 text-4xl mb-2">📷</div>
                      <p className="text-red-600 font-semibold mb-2">
                        Kamera Tidak Tersedia
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {cameraError}
                      </p>
                      <button
                        onClick={initializeCamera}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  ) : photo ? (
                    <img src={photo} alt="Captured" className="w-full h-auto" />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto"
                      // onLoadedData={() => setCameraLoading(false)}
                    />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Tanggal */}
                <div className="text-lg font-semibold text-gray-600 mb-2">
                  {formatTanggal(new Date())}
                </div>

                <div className="text-3xl font-bold mb-2">{clock}</div>

                {/* Nama dan Keterangan Jam */}
                <div className="text-xl font-semibold text-gray-600 mb-2 capitalize">
                  {username}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Jam Masuk: {jamMasuk} | Jam Pulang: {jamPulang}
                </div>

                <div className="flex gap-4 w-full max-w-md">
                  {photoTaken ? (
                    <>
                      <button
                        onClick={resetPhoto}
                        disabled={isUploading}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50"
                      >
                        {isUploading ? "Mengupload..." : "Kirim"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={capture}
                      disabled={cameraLoading || cameraError || !stream}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition disabled:opacity-50"
                    >
                      {cameraLoading
                        ? "Mempersiapkan Kamera..."
                        : cameraError
                        ? "Kamera Tidak Tersedia"
                        : "Ambil Foto"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Riwayat Absensi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faArrowRightToBracket}
                  className="text-blue-500"
                />
                Riwayat Masuk
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {riwayatAbsensi
                  .filter((item) => item.jam_masuk)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="p-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {formatWaktu(item.jam_masuk)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.keterangan_masuk === "tepat waktu"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.keterangan_masuk}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTanggal(item.jam_masuk)}
                      </div>
                    </div>
                  ))}
                {riwayatAbsensi.filter((item) => item.jam_masuk).length ===
                  0 && (
                  <p className="text-gray-500 text-center py-4">
                    Belum ada riwayat masuk
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="text-green-500"
                />
                Riwayat Pulang
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {riwayatAbsensi
                  .filter((item) => item.jam_pulang)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="p-3 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {formatWaktu(item.jam_pulang)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.keterangan_pulang === "tepat waktu"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {item.keterangan_pulang}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTanggal(item.jam_pulang)}
                      </div>
                    </div>
                  ))}
                {riwayatAbsensi.filter((item) => item.jam_pulang).length ===
                  0 && (
                  <p className="text-gray-500 text-center py-4">
                    Belum ada riwayat pulang
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loading Overlay */}
          {isUploading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center gap-4">
                  <Spinner size={30} color="#ff0000" />
                  <div>
                    <p className="text-lg font-semibold">
                      Mengupload gambar...
                    </p>
                    <p className="text-sm text-gray-600">
                      Mohon tunggu sebentar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pesan jika sudah absen lengkap */}
          {sudahAbsenHariIni && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-2xl mb-2"
              />
              <p className="text-green-700 font-semibold">
                Anda sudah menyelesaikan absensi hari ini!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
