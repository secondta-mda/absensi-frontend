import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/user/Dashboard';
import { Absensi } from './pages/dashboard/user/Absensi';
import { Cuti } from './pages/dashboard/user/Cuti';
import { Profil } from './pages/dashboard/user/Profil';
import { NotFound } from './components/Notfound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/absensi/masuk" element={<Absensi />} />
      <Route path="/absensi/pulang" element={<Absensi />} />
      <Route path="/cuti" element={<Cuti />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
