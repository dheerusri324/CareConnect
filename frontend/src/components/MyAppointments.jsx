// frontend/src/components/MyAppointments.js

import React, { useState, useEffect } from 'react';
import api from '../api';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/my-appointments');
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>My Appointments</h2>
      {appointments.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.doctor_name}</td>
                <td>{appt.specialization}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no appointments.</p>
      )}
    </div>
  );
}

export default MyAppointments;