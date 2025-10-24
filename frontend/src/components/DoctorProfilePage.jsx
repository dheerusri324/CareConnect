// frontend/src/components/DoctorProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { format } from 'date-fns'; // For formatting the review date

const API_URL = "http://127.0.0.1:5000";

function DoctorProfilePage() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/doctors/${id}`);
                setDoctor(response.data);
            } catch (err) {
                console.error("Failed to fetch doctor profile", err);
                setError('Failed to fetch doctor profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorProfile();
    }, [id]);

    if (loading) {
        return <div className="text-center p-10">Loading doctor profile...</div>;
    }
    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }
    if (!doctor) {
        return <div className="text-center p-10">Doctor not found.</div>;
    }

    const imageUrl = `${API_URL}/static/uploads/${doctor.profile_pic}`;
    const rating = doctor.average_rating ? doctor.average_rating.toFixed(1) : "N/A";

    return (
        <div className="container mx-auto max-w-4xl py-8">
            {/* Doctor Header Card */}
            <Card className="mb-8 shadow-md">
                <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6">
                    <img
                        src={imageUrl}
                        alt={doctor.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-100"
                        // Add a fallback image if the primary one fails
                        onError={(e) => { e.target.onerror = null; e.target.src=`${API_URL}/static/uploads/default.png` }}
                    />
                    <div className="text-center md:text-left">
                        <CardTitle className="text-3xl font-bold">{doctor.name}</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground">{doctor.specialization}</CardDescription>
                        <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">{rating}</span>
                            <span className="text-muted-foreground">({doctor.review_count} reviews)</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Reviews Section Card */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Patient Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    {doctor.reviews && doctor.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {doctor.reviews.map(review => (
                                <div key={review.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold">{review.patient_username}</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {review.comment && <p className="text-gray-700 mb-1">{review.comment}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        Reviewed on: {format(new Date(review.created_at), 'PPP')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No reviews available for this doctor yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default DoctorProfilePage;
