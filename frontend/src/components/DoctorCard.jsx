// frontend/src/components/DoctorCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star } from "lucide-react";

// The base URL for your backend server
const API_URL = "http://127.0.0.1:5000";

const DoctorCard = ({ doctor }) => {
  const rating = doctor.average_rating ? doctor.average_rating.toFixed(1) : "No reviews";
  // Construct the full image URL
  const imageUrl = `${API_URL}/static/uploads/${doctor.profile_pic}`;

  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={imageUrl}
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription>{doctor.specialization}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="font-bold">{rating}</span>
        <span className="text-muted-foreground">({doctor.review_count} reviews)</span>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;