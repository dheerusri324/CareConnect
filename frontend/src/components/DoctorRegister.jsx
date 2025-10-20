// frontend/src/components/DoctorRegister.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function DoctorRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register-doctor', {
        username,
        password,
        name,
        specialization,
      });
      setMessage('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Full Name (e.g., Dr. Jane Doe)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Specialization (e.g., Cardiology)"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default DoctorRegister;