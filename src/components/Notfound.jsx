import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-center p-6">
      {/* Angka 404 */}
      <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg">
        404
      </h1>

      {/* Judul */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
        Oops! Halaman tidak ditemukan
      </h2>

      {/* Deskripsi */}
      <p className="text-gray-600 mt-2 max-w-md">
        Sepertinya halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
      </p>

      {/* Tombol kembali */}
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
