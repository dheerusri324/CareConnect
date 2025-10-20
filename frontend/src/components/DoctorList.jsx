// frontend/src/components/DoctorList.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';

function DoctorList() {
  // State for the component
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch the list of doctors when the component loads
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

  // Fetch available slots whenever the selected doctor or date changes
  useEffect(() => {
    if (selectedDoctor && date) {
      // Clear previous slots and message
      setSlots([]);
      setSelectedTime('');
      setMessage('');

      const fetchSlots = async () => {
        try {
          const response = await api.get(`/api/doctors/${selectedDoctor}/available-slots?date=${date}`);
          setSlots(response.data);
        } catch (error) {
          console.error("Failed to fetch slots", error);
          setMessage('Could not load appointment slots.');
        }
      };
      fetchSlots();
    }
  }, [selectedDoctor, date]);

  // Handle the final booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      setMessage('Please select a time slot.');
      return;
    }
    try {
      await api.post('/api/appointments', {
        doctor_id: selectedDoctor,
        date: date,
        time: selectedTime,
      });
      setMessage('Appointment booked successfully!');
      // Reload the page to show the new appointment in the list below
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage('Failed to book appointment.');
    }
  };

  // Basic styling for slot buttons
  const slotButtonStyle = (slot) => ({
    backgroundColor: slot.booked ? '#ccc' : (selectedTime === slot.time ? '#007bff' : '#fff'),
    color: slot.booked ? '#666' : (selectedTime === slot.time ? '#fff' : '#000'),
    border: '1px solid #ccc',
    padding: '8px 12px',
    margin: '4px',
    cursor: slot.booked ? 'not-allowed' : 'pointer',
    borderRadius: '4px',
  });

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleBooking}>
        {/* Step 1: Select Doctor */}
        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
          <option value="">Select a Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name} - {doc.specialization}
            </option>
          ))}
        </select>
        <br /><br />

        {/* Step 2: Select Date (only appears after a doctor is chosen) */}
        {selectedDoctor && (
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            min={new Date().toISOString().split('T')[0]} // Prevent booking past dates
            required 
          />
        )}
        <br /><br />

        {/* Step 3: Select Time Slot (only appears after a date is chosen) */}
        {date && slots.length > 0 && (
          <div style={{ border: '1px solid #eee', padding: '10px' }}>
            <h4>Available Slots for {date}:</h4>
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                style={slotButtonStyle(slot)}
                disabled={slot.booked}
                onClick={() => setSelectedTime(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
        <br />

        {/* Final submission button */}
        <button type="submit" disabled={!selectedTime}>Book Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DoctorList;