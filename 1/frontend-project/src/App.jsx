import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeForm from './pages/EmployeeForm';
import DepartmentForm from './pages/DepartmentForm';
import SalaryForm from './pages/SalaryForm';
import Reports from './pages/Reports';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(localStorage.getItem('epms_user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  function handleLogout() {
    localStorage.removeItem('epms_user');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="min-h-screen text-slate-900">
      <ToastContainer position="top-right" theme="colored" />
      {user && <NavBar onLogout={handleLogout} />}
      <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute user={user}><EmployeeForm /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute user={user}><DepartmentForm /></ProtectedRoute>} />
          <Route path="/salaries" element={<ProtectedRoute user={user}><SalaryForm /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute user={user}><Reports /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
