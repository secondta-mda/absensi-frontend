import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";

export function Cuti() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [awalCuti, setAwalCuti] = useState("");
  const [akhirCuti, setAkhirCuti] = useState("");
  const [errorAwal, setErrorAwal] = useState("");
  const [errorAkhir, setErrorAkhir] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleAwalChange = (e) => {
    const value = e.target.value;
    setAwalCuti(value);

    const awalDate = new Date(value);
    const akhirDate = akhirCuti ? new Date(akhirCuti) : null;

    // Reset error
    setErrorAwal("");

    // Validasi awal cuti < hari ini
    if (awalDate < today) {
      setErrorAwal("Tanggal awal cuti tidak boleh sebelum hari ini.");
    }

    // Validasi awal cuti > akhir cuti
    if (akhirDate && awalDate > akhirDate) {
      setErrorAwal("Tanggal awal cuti tidak boleh lebih dari akhir cuti.");
    }
  };

  const handleAkhirChange = (e) => {
    const value = e.target.value;
    setAkhirCuti(value);

    const awalDate = awalCuti ? new Date(awalCuti) : null;
    const akhirDate = new Date(value);

    // Reset error
    setErrorAkhir("");

    // Validasi akhir cuti < awal cuti
    if (awalDate && akhirDate < awalDate) {
      setErrorAkhir("Tanggal akhir cuti tidak boleh kurang dari awal cuti.");
    }
  };

  return (
    <div className="flex flex-col h-screen lexend-deca-font">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
            Form Pengajuan Cuti
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <form className="space-y-6">
              {/* Alasan Cuti */}
              <div>
                <label
                  htmlFor="alasan-cuti"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Alasan Cuti
                </label>
                <input
                  type="text"
                  name="alasan_cuti"
                  id="alasan-cuti"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Contoh: Urusan keluarga, sakit, dll."
                  className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Awal Cuti */}
                <div>
                  <label
                    htmlFor="awal-cuti"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Awal Cuti
                  </label>
                  <input
                    type="date"
                    name="awal_cuti"
                    id="awal-cuti"
                    value={awalCuti}
                    onChange={handleAwalChange}
                    className={`border ${
                      errorAwal ? "border-red-500" : "border-gray-300"
                    } w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      errorAwal ? "focus:ring-red-500" : "focus:ring-blue-500"
                    }`}
                  />
                  {errorAwal && (
                    <p className="text-red-500 text-sm mt-1">{errorAwal}</p>
                  )}
                </div>

                {/* Akhir Cuti */}
                <div>
                  <label
                    htmlFor="akhir-cuti"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Akhir Cuti
                  </label>
                  <input
                    type="date"
                    name="akhir_cuti"
                    id="akhir-cuti"
                    value={akhirCuti}
                    onChange={handleAkhirChange}
                    className={`border ${
                      errorAkhir ? "border-red-500" : "border-gray-300"
                    } w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      errorAkhir ? "focus:ring-red-500" : "focus:ring-blue-500"
                    }`}
                  />
                  {errorAkhir && (
                    <p className="text-red-500 text-sm mt-1">{errorAkhir}</p>
                  )}
                </div>
              </div>

              {/* Tombol */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={errorAwal || errorAkhir}
                >
                  Ajukan Cuti
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
