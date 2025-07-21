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

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Daftar Absensi</h2>
      <ul className="bg-white shadow rounded-xl p-4 space-y-2">
        {data.map((item, index) => (
          <li key={index} className="border-b py-2">
            <strong>{item.nama}</strong> - {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
