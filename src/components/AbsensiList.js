import { useEffect, useState } from 'react';
import API from '../api';

export default function AbsensiList() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get('/absen');
      setData(res.data);
    } catch (err) {
      alert('Gagal memuat data absensi.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk mengambil inisial nama
  const getInitial = (nama) => nama ? nama.charAt(0).toUpperCase() : '?';

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Daftar Absensi</h2>
      <ul className="space-y-3">
        {data.map((item, index) => (
          <li key={index} className="flex items-center bg-white shadow-md rounded-xl px-4 py-3 border border-blue-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mr-3">
              {getInitial(item.nama)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{item.nama}</div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                ${item.status === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}