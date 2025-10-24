// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import DoctorRegister from './components/DoctorRegister.jsx';
import DoctorList from './components/DoctorList.jsx';
import MyAppointments from './components/MyAppointments.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import DoctorsPage from './components/DoctorsPage.jsx'; // Import the new page
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

function Dashboard({ userRole }) {
  if (userRole === 'patient') {
    return (
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DoctorList />
        </div>
        <div>
          <MyAppointments />
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-8">
        <DoctorDashboard />
      </div>
    );
  }
}

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    globalThis.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {token && (
          <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="text-2xl font-bold text-blue-600">
                CareConnect
              </a>
              {/* ADDED LINK TO DOCTORS PAGE */}
              <a href="/doctors" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                All Doctors
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Welcome, {username}!
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-600 hover:text-white transition-colors"
               >
                Logout
              </Button>
            </div>
          </nav>
        )}

        <main>
          <Routes>
            <Route path="/" element={!token ? <Homepage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/register-doctor" element={!token ? <DoctorRegister /> : <Navigate to="/dashboard" />} />
            <Route path="/doctors" element={token ? <DoctorsPage /> : <Navigate to="/login" />} />
            <Route
              path="/dashboard"
              element={
                token ? <Dashboard userRole={role} /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>

        <Toaster richColors position="top-center" />
      </div>
    </Router>
  );
}

export default App;