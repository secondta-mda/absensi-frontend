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
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-4">
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="w-8 h-8 text-blue-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                  Jumlah Masuk
                </h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <a
                  href="/absensi/masuk  "
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition w-full text-center"
                >
                  Absen Masuk
                </a>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <FontAwesomeIcon
                    icon={faHome}
                    className="w-8 h-8 text-green-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                  Jumlah Cuti
                </h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <a
                  href="/cuti"
                  className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition w-full text-center"
                >
                  Cuti
                </a>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col items-center">
                <div className="bg-yellow-100 rounded-full p-3 mb-4">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-8 h-8 text-yellow-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                  Jumlah Absen Dengan Keterangan
                </h3>
                <p className="text-3xl font-bold text-yellow-600">0</p>
                <a
                  href="/absen-keterangan"
                  className="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition w-full text-center"
                >
                  Absen Keterangan
                </a>
              </div>
            </div>
            <div className="mt-12 shadow-lg rounded-2xl p-6 bg-white">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Riwayat Absen Bulan Ini
              </h3>
              <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Jam Masuk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Jam Keluar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTanggal("2025-06-01")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">08:00</td>
                      <td className="px-6 py-4 whitespace-nowrap">17:00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          Masuk
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTanggal("2025-06-02")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          Cuti
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Cuti Tahunan
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTanggal("2025-06-03")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">08:10</td>
                      <td className="px-6 py-4 whitespace-nowrap">17:05</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                          Izin
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Sakit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
