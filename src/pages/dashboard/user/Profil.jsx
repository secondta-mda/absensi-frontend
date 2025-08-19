import { useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { Sidebar } from "../../../components/Sidebar";

export function Profil() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen lexend-deca-font">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
            Profil Pengguna
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Ubah Username */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-2">
                Ubah Username
              </h3>
              <form className="flex flex-col flex-1">
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={"johndoe"}
                    className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Tombol */}
                <div className="mt-auto pt-4 border-t">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition"
                  >
                    Simpan Username
                  </button>
                </div>
              </form>
            </div>

            {/* Card Ubah Password */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-2">
                Ubah Password
              </h3>
              <form className="flex flex-col flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="col-span-1 md:col-span-2">
                    <label
                      htmlFor="password-lama"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Password Lama
                    </label>
                    <input
                      type="password"
                      name="password_lama"
                      id="password-lama"
                      className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password-baru"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="password_baru"
                      id="password-baru"
                      className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="konfirmasi-password"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      name="konfirmasi_password"
                      id="konfirmasi-password"
                      className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {/* Tombol */}
                <div className="mt-auto pt-4 border-t">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition"
                  >
                    Simpan Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
