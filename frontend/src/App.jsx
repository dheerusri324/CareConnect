// frontend/src/App.jsx

import React from 'react'; // We no longer need useState or useEffect here
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import DoctorRegister from './components/DoctorRegister.jsx';
import DoctorList from './components/DoctorList.jsx';
import MyAppointments from './components/MyAppointments.jsx';
import DoctorDashboard from './components/DoctorDashboard.jsx';
import { Button } from "@/components/ui/button";

// Use a DEFAULT import because the component uses 'export default'
// Also, ensure the filename 'ClickSpark' is correct (case-sensitive)
import ClickSpark from '@/components/ui/ClickSpark';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  // NO MORE SPARKLE LOGIC IS NEEDED HERE. The component handles everything itself.

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    globalThis.location.href = '/login';
  };

  return (
    <Router>
      {/* Wrap the entire application in the ClickSpark component.
          We can pass props to customize it, like the spark color! */}
      <ClickSpark sparkColor="#2563eb">
        <div className="min-h-screen bg-gray-50">
          {/* Navigation Bar */}
          <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              CareConnect
            </h1>
            <div className="flex items-center space-x-4">
              {username && (
                <span className="text-gray-700 font-medium">
                  Welcome, {username}!
                </span>
              )}
              {token && (
                 <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-600 hover:text-white transition-colors"
                 >
                  Logout
                 </Button>
              )}
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="p-8">
            <Routes>
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/register-doctor" element={!token ? <DoctorRegister /> : <Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  token ? (
                    role === 'patient' ?
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                          <DoctorList />
                      </div>
                      <div>
                          <MyAppointments />
                      </div>
                    </div>
                    :
                    <DoctorDashboard />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </ClickSpark>
    </Router>
  );
}

export default App;

