// frontend/src/components/DoctorDashboard.js

import React, { useState, useEffect } from 'react';
import api from '../api';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/doctor/appointments');
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Failed to fetch doctor's appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <h3>Welcome, {username}!</h3>
      <h4>Your Scheduled Appointments:</h4>
      {appointments.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patient_name}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no upcoming appointments.</p>
      )}
    </div>
  );
}

export default DoctorDashboard;