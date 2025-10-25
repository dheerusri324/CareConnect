// frontend/src/App.jsx

import React, { useState, useEffect } from 'react'; // Ensure useState and useEffect are imported
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import DoctorRegister from './components/DoctorRegister.jsx';
import DoctorList from './components/DoctorList.jsx';
import MyAppointments from './components/MyAppointments.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import DoctorsPage from './components/DoctorsPage.jsx';
import DoctorProfilePage from './components/DoctorProfilePage.jsx';
import { Button } from "@/components/ui/button";
import ClickSpark from '@/components/ui/ClickSpark';
import { Toaster } from "sonner";
import { Bell } from 'lucide-react';
import api from './api';
import { DateTime } from 'luxon';

// This component decides which view to show based on the user's role.
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
  // Ensure this line is present and correctly declares both hasNotification and setHasNotification
  const [hasNotification, setHasNotification] = useState(false);

  // --- Notification Check Logic ---
  useEffect(() => {
    let intervalId = null;

    const checkAppointments = async () => {
      if (token && role === 'patient') {
        try {
          const response = await api.get('/api/my-appointments');
          const appointments = response.data.appointments;
          const now = DateTime.now();
          let upcoming = false;

          for (const appt of appointments) {
            if (appt.status !== 'Completed') {
              const apptDateTime = DateTime.fromISO(appt.date + 'T' + appt.time);
              const diffMinutes = apptDateTime.diff(now, 'minutes').minutes;
              if (diffMinutes > 0 && diffMinutes <= 15) {
                upcoming = true;
                break;
              }
            }
          }
          setHasNotification(upcoming); // Use the setter function
        } catch (error) {
          console.error("Error checking appointments for notification:", error);
          setHasNotification(false);
        }
      } else {
        setHasNotification(false);
      }
    };

    checkAppointments(); // Initial check

    if (role === 'patient') {
      intervalId = setInterval(checkAppointments, 60000); // Check every minute
    }

    return () => { // Cleanup
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, role]); // Rerun if auth state changes
  // --- End Notification Check ---


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    globalThis.location.href = '/login';
  };

  return (
    <Router>
      <ClickSpark sparkColor="#2563eb">
        <div className="min-h-screen bg-gray-50">
          {token && (
            <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-6">
                <a href="/dashboard" className="text-2xl font-bold text-blue-600">
                  CareConnect
                </a>
                <a href="/doctors" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                  All Doctors
                </a>
              </div>
              <div className="flex items-center space-x-4">
                {role === 'patient' && ( // Only show bell for patients
                  <div className="relative">
                    <Bell className={`h-6 w-6 transition-colors ${hasNotification ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                    {hasNotification && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                )}
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
              <Route path="/doctor/:id" element={token ? <DoctorProfilePage /> : <Navigate to="/login" />} />
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
      </ClickSpark>
    </Router>
  );
}

export default App;

