import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";

export function Izin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [awalIzin, setAwalIzin] = useState("");
  const [akhirIzin, setAkhirIzin] = useState("");
  const [errorAwal, setErrorAwal] = useState("");
  const [errorAkhir, setErrorAkhir] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleAwalChange = (e) => {
    const value = e.target.value;
    setAwalIzin(value);

    const awalDate = new Date(value);
    const akhirDate = akhirIzin ? new Date(akhirIzin) : null;

    setErrorAwal("");

    if (awalDate < today) {
      setErrorAwal("Tanggal awal izin tidak boleh sebelum hari ini.");
    }

    if (akhirDate && awalDate > akhirDate) {
      setErrorAwal("Tanggal awal izin tidak boleh lebih dari akhir izin.");
    }
  };

  const handleAkhirChange = (e) => {
    const value = e.target.value;
    setAkhirIzin(value);

    const awalDate = awalIzin ? new Date(awalIzin) : null;
    const akhirDate = new Date(value);

    setErrorAkhir("");

    if (awalDate && akhirDate < awalDate) {
      setErrorAkhir("Tanggal akhir izin tidak boleh kurang dari awal izin.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen lexend-deca-font">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
            Form Pengajuan Izin
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <form className="space-y-6">
              {/* Alasan Izin */}
              <div>
                <label
                  htmlFor="alasan-izin"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Alasan Izin
                </label>
                <input
                  type="text"
                  name="alasan_izin"
                  id="alasan-izin"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Contoh: Urusan keluarga, sakit, dll."
                  className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Awal Izin */}
                <div>
                  <label
                    htmlFor="awal-izin"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Awal Izin
                  </label>
                  <input
                    type="date"
                    name="awal_izin"
                    id="awal-izin"
                    value={awalIzin}
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

                {/* Akhir Izin */}
                <div>
                  <label
                    htmlFor="akhir-izin"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Akhir Izin
                  </label>
                  <input
                    type="date"
                    name="akhir_izin"
                    id="akhir-izin"
                    value={akhirIzin}
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

              {/* Pilihan Upload Foto */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Unggah Bukti
                </label>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {imageSrc && (
                  <div className="mt-4">
                    <h3 className="text-gray-700 font-medium mb-2">Pratinjau Foto</h3>
                    <img
                      src={imageSrc}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              {/* Tombol */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={errorAwal || errorAkhir}
                >
                  Ajukan Izin
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}