import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Login from './components/Login';
import CarForm from './components/CarForm';
import SlotForm from './components/SlotForm';
import RecordForm from './components/RecordForm';
import PaymentForm from './components/PaymentForm';
import Reports from './components/Reports';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4000';

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get('/api/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/*"
          element={
            user ? (
              <Layout setUser={setUser}>
                <Routes>
                  <Route path="/" element={<Navigate to="/car" />} />
                  <Route path="/car" element={<CarForm />} />
                  <Route path="/parkingslot" element={<SlotForm />} />
                  <Route path="/parkingrecord" element={<RecordForm />} />
                  <Route path="/payment" element={<PaymentForm />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
