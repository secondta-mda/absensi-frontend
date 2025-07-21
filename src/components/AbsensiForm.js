import { useState } from 'react';
import API from '../api';

export default function AbsensiForm({ onSubmit }) {
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('masuk');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/absen', { nama, status });
      onSubmit(); // reload data
      setNama('');
    } catch (err) {
      alert('Gagal menambahkan absensi.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 space-y-6 bg-white shadow-lg rounded-2xl border border-blue-100
        transition-all duration-300
        sm:max-w-md
        md:max-w-lg
        "
      style={{ marginTop: '2rem' }}
    >
      <h2 className="text-xl font-bold text-blue-700 text-center mb-2">Form Absensi</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="nama" className="text-sm font-medium text-gray-700">Nama</label>
        <input
          id="nama"
          className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="text"
          placeholder="Masukkan nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pulang">Pulang</option>
          <option value="masuk">Masuk</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 transition"
      >
        Simpan
      </button>
    </form>
  );
}