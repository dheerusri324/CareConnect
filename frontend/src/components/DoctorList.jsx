// frontend/src/components/DoctorList.js

import React, { useState, useEffect } from 'react';
import api from '../api';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/api/doctors');
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/appointments', {
        doctor_id: selectedDoctor,
        date: date,
        time: time,
      });
      setMessage('Appointment booked successfully!');
      // Optionally, clear the form or refresh the appointments list
      setSelectedDoctor('');
      setDate('');
      setTime('');
      setTimeout(() => window.location.reload(), 2000); // Reload to show new appt
    } catch (error) {
      setMessage('Failed to book appointment.');
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleBooking}>
        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
          <option value="">Select a Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} - {doc.specialization}
            </option>
          ))}
        </select>
        <br /><br />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <br /><br />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <br /><br />
        <button type="submit">Book Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DoctorList;