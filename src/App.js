import AbsensiForm from './components/AbsensiForm';
import AbsensiList from './components/AbsensiList';
import { useState } from 'react';

function App() {
  const [reload, setReload] = useState(false);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Aplikasi Absensi</h1>
      <AbsensiForm onSubmit={() => setReload(!reload)} />
      <AbsensiList key={reload} />
    </div>
  );
}

export default App;
