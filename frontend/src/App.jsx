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
import { Button } from "@/components/ui/button";

// --- NEW DASHBOARD COMPONENT ---
// This component decides which view to show based on the user's role.
function Dashboard({ userRole }) {
  if (userRole === 'patient') {
    // Return the Patient Dashboard Layout
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
    // Assume any other role is a Doctor
    // Return the Doctor Dashboard Layout
    return (
      <div className="p-8">
        <DoctorDashboard />
      </div>
    );
  }
}
// --- END OF NEW COMPONENT ---


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
      {token && (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
          <a href="/dashboard" className="text-2xl font-bold text-blue-600">
            CareConnect
          </a>
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

          {/* === UPDATED DASHBOARD ROUTE === */}
          {/* Uses the new Dashboard component */}
          <Route
            path="/dashboard"
            element={
              token ? <Dashboard userRole={role} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

