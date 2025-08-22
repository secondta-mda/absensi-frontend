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
  const [cameraLoading, setCameraLoading] = useState(true);

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

  // Start camera stream
  useEffect(() => {
  if (photoTaken) return;

  let localStream;
  const startCamera = async () => {
    try {
      setCameraLoading(true);
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }
      setStream(localStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      showAlert(
        "error",
        "Kamera Tidak Dapat Diakses",
        "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin."
      );
    } finally {
      setCameraLoading(false);
    }
  };

  startCamera();

  return () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  };
}, [photoTaken]); // 🔑 hanya bergantung pada photoTaken


  // Ambil data user dari localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setUserData(user);
      console.log("User data loaded:", user);
    }
  }, []);

  // Cek status absensi
  // Perbaikan pada useEffect untuk cek status absensi
  useEffect(() => {
    const checkAbsensiStatus = async () => {
      if (!userData?.data.id) return;

      try {
        setLoadingStatus(true);
        console.log("Checking absensi status for user:", userData.data.id); // Debug log

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/absensi/status/${userData.data.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result); // Debug log

        if (result.success) {
          setAbsensiStatus(result.data);

          // Redirect berdasarkan status absensi
          if (!result.data.sudah_masuk) {
            if (location.pathname.includes("pulang")) {
              navigate("/absensi/masuk");
            }
          } else if (!result.data.sudah_pulang) {
            if (location.pathname.includes("masuk")) {
              navigate("/absensi/pulang");
            }
          }
        } else {
          throw new Error(result.message || "Failed to get absensi status");
        }
      } catch (error) {
        console.error("Error checking absensi status:", error);
        showAlert(
          "error",
          "Terjadi Kesalahan",
          `Gagal memuat status absensi: ${error.message}`
        );
      } finally {
        setLoadingStatus(false);
      }
    };

    const fetchRiwayatAbsensiHariIni = async () => {
      if (!userData?.data.id) return;

      try {
        console.log("Fetching riwayat absensi for user:", userData.data.id); // Debug log

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/absensi/hari-ini/${userData.data.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Riwayat API Response:", result); // Debug log

        if (result.success) {
          setRiwayatAbsensi(result.data);
        }
      } catch (error) {
        console.error("Error fetching riwayat absensi hari ini:", error);
        // Jangan tampilkan alert untuk riwayat, biarkan silent fail
      }
    };

    if (userData?.data.id) {
      checkAbsensiStatus();
      fetchRiwayatAbsensiHariIni();
    }
  }, [userData?.data.id]); // Hapus dependencies yang menyebabkan loop

  // Ambil riwayat absensi
  const fetchRiwayatAbsensiHariIni = async () => {
    if (!userData?.data.id) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/absensi/hari-ini/${userData.data.id}`
      );
      const result = await response.json();

      if (result.success) {
        setRiwayatAbsensi(result.data);
      }
    } catch (error) {
      console.error("Error fetching riwayat absensi hari ini:", error);
      showAlert(
        "error",
        "Terjadi Kesalahan",
        "Gagal memuat riwayat absensi. Silakan coba lagi."
      );
    }
  };

  const username = userData?.data.username || "Guest User";
  const jamMasuk = userData?.data.jam_masuk || "08:00:00";
  const jamPulang = userData?.data.jam_pulang || "17:00:00";

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

      const imageUrl = canvas.toDataURL("image/jpeg");
      setPhoto(imageUrl);
      setPhotoTaken(true);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const resetPhoto = async () => {
    // Tampilkan alert terlebih dahulu
    await showAlert(
      "info",
      "Mengatur Ulang",
      "Kamera akan diatur ulang...",
      1500
    );

    // Setelah alert selesai, reset state dan reload
    setPhoto(null);
    setPhotoTaken(false);
    setCameraLoading(true);

    // Mulai ulang kamera
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      showAlert(
        "error",
        "Kamera Tidak Dapat Diakses",
        "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin."
      );
      setCameraLoading(false);
    }
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

      const backendRes = await fetch(`${process.env.REACT_APP_API_URL}/absen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData?.data.id,
          type: type,
          image_url: cloudinaryData.secure_url,
          jam_masuk_user: userData?.data.jam_masuk,
          jam_pulang_user: userData?.data.jam_pulang,
        }),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menyimpan absensi");
      }

      const responseData = await backendRes.json();

      // Menggunakan SweetAlert2 untuk notifikasi sukses
      await showAlert(
        "success",
        "Absensi Berhasil",
        `Absensi ${type} berhasil! Status: ${responseData.data.keterangan}`
      );

      // Refresh status absensi setelah berhasil
      const statusResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/absensi/status/${userData.data.id}`
      );
      const statusResult = await statusResponse.json();
      if (statusResult.success) {
        setAbsensiStatus(statusResult.data);
      }

      // Reset foto setelah alert selesai
      await resetPhoto();
    } catch (error) {
      // Menggunakan SweetAlert2 untuk notifikasi error
      await showAlert(
        "error",
        "Absensi Gagal",
        error.message || "Terjadi kesalahan saat mengirim absensi"
      );

      // Reset foto setelah alert error selesai
      await resetPhoto();
      console.error("Upload error:", error);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };


  const sudahAbsenHariIni =
    absensiStatus?.sudah_masuk && absensiStatus?.sudah_pulang;
  // navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     console.log("Latitude:", position.coords.latitude);
  //     console.log("Longitude:", position.coords.longitude);
  //   },
  //   (error) => {
  //     console.error("Error:", error);
  //   }
  // );

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
                <div className="relative mb-4 rounded-xl overflow-hidden w-full max-w-2xl min-h-[300px] flex items-center justify-center">
                  {cameraLoading ? (
                    <div className="flex flex-col items-center">
                      <Spinner size={40} color="#ff0000" />
                      <span className="text-[#ff0000] font-bold animate-pulse">
                        Memuat Kamera...
                      </span>
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
                      onLoadedData={() => setCameraLoading(false)}
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
                      disabled={cameraLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition disabled:opacity-50"
                    >
                      {cameraLoading ? "Mempersiapkan Kamera..." : "Ambil Foto"}
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
                <p className="text-lg font-semibold">Mengupload gambar...</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
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
