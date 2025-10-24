/* eslint-disable no-unused-vars */
// frontend/src/pages/DoctorsPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DoctorCard from '../components/DoctorCard';

function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found.');
                }
                // Update this URL to use the new '/profiles' endpoint
                const response = await api.get('/api/doctors/profiles', {
                    headers: { 'x-access-token': token }
                });
                setDoctors(response.data);
            } catch (err) {
                console.error("Failed to fetch doctors", err);
                setError('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Function to handle card click
    const handleDoctorCardClick = (doctorId) => {
        navigate(`/doctor/${doctorId}`); // Navigate to a new route like /doctor/1
    };

    if (loading) return <div>Loading doctors...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="doctors-page">
            <h1>All Doctors</h1>
            <div className="doctor-list">
                {doctors.length > 0 ? (
                    doctors.map(doctor => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onClick={() => handleDoctorCardClick(doctor.id)} // Pass click handler
                        />
                    ))
                ) : (
                    <p>No doctors found.</p>
                )}
            </div>
        </div>
    );
}

export default DoctorsPage;