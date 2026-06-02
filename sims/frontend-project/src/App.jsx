import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userAPI } from './api/userAPI';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SpareParts from './pages/SpareParts';
import StockInPage from './pages/StockInPage';
import StockOutPage from './pages/StockOutPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-4xl font-bold text-white mb-4">SIMS</h1>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/spareparts"
          element={user ? <SpareParts user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/stockin"
          element={user ? <StockInPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/stockout"
          element={user ? <StockOutPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={user ? <ReportsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
