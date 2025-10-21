// frontend/src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import DoctorRegister from "./components/DoctorRegister.jsx";
import DoctorList from "./components/DoctorList.jsx";
import MyAppointments from "./components/MyAppointments.jsx";
import DoctorDashboard from "./components/DoctorDashboard.jsx";

// Import shadcn components
import { Button } from "@/components/ui/button";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    globalThis.location.href = "/login";
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CareConnect</h1>
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
            <Route
              path="/login"
              element={!token ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!token ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register-doctor"
              element={
                !token ? <DoctorRegister /> : <Navigate to="/dashboard" />
              }
            />

            <Route
              path="/dashboard"
              element={
                token ? (
                  role === "patient" ? (
                    // Patient Dashboard
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <DoctorList />
                      </div>
                      <div>
                        <MyAppointments />
                      </div>
                    </div>
                  ) : (
                    <DoctorDashboard />
                  ) // Doctor Dashboard
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
