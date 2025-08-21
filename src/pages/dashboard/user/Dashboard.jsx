import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faUser,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function formatTanggal(dateStr) {
    const bulanIndo = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const [year, month, day] = dateStr.split("-");
    return `${day} ${bulanIndo[parseInt(month, 10) - 1]} ${year}`;
  }

  return (
    <>
      <div className="flex flex-col h-screen lexend-deca-font">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
              Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full">
              {/* Card Masuk */}
              <a
                href="/absensi/masuk"
                className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Absensi Masuk
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
                <div className="text-blue-600">
                  <FontAwesomeIcon icon={faCalendarCheck} className="w-8 h-8" />
                </div>
              </a>

              {/* Card Cuti */}
              <a
                href="/cuti"
                className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Pengajuan Cuti
                  </h3>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="text-green-600">
                  <FontAwesomeIcon icon={faHome} className="w-8 h-8" />
                </div>
              </a>

              {/* Card Keterangan */}
              <a
                href="/absen-keterangan"
                className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-yellow-100 hover:-translate-y-1"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Absen Keterangan
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600">0</p>
                </div>
                <div className="text-yellow-600">
                  <FontAwesomeIcon icon={faUser} className="w-8 h-8" />
                </div>
              </a>
            </div>
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Riwayat Absen Bulan Ini
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Masuk Normal */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {formatTanggal("2025-06-01")}
                      </h4>
                      <p className="text-sm text-gray-500">Senin</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Masuk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Jam Masuk</p>
                      <p className="text-lg font-semibold text-blue-600">
                        08:00
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jam Pulang</p>
                      <p className="text-lg font-semibold text-blue-600">
                        17:00
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Keterangan</p>
                    <p className="text-sm text-gray-700">-</p>
                  </div>
                </div>

                {/* Card 2: Cuti */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {formatTanggal("2025-06-02")}
                      </h4>
                      <p className="text-sm text-gray-500">Selasa</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      Cuti
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Jam Masuk</p>
                      <p className="text-lg font-semibold text-gray-400">-</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jam Pulang</p>
                      <p className="text-lg font-semibold text-gray-400">-</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Keterangan</p>
                    <p className="text-sm text-gray-700">Cuti Tahunan</p>
                  </div>
                </div>

                {/* Card 3: Izin Sakit */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-yellow-100 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {formatTanggal("2025-06-03")}
                      </h4>
                      <p className="text-sm text-gray-500">Rabu</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                      Izin
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Jam Masuk</p>
                      <p className="text-lg font-semibold text-blue-600">
                        08:10
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jam Pulang</p>
                      <p className="text-lg font-semibold text-blue-600">
                        17:05
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Keterangan</p>
                    <p className="text-sm text-gray-700">Sakit</p>
                  </div>
                </div>

                {/* Card 4: Terlambat (Contoh tambahan) */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-orange-100 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {formatTanggal("2025-06-04")}
                      </h4>
                      <p className="text-sm text-gray-500">Kamis</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                      Terlambat
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Jam Masuk</p>
                      <p className="text-lg font-semibold text-orange-600">
                        09:15
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jam Pulang</p>
                      <p className="text-lg font-semibold text-blue-600">
                        17:30
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Keterangan</p>
                    <p className="text-sm text-gray-700">Macet di jalan</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
