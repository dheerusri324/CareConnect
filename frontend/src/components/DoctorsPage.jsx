// frontend/src/components/DoctorsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import DoctorCard from './DoctorCard';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/api/doctors/profiles');
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Our Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;