// frontend/src/components/ReviewModal.jsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import api from '../api';

const ReviewModal = ({ open, onOpenChange, appointment, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    try {
      await api.post('/api/reviews', {
        appointment_id: appointment.id,
        rating,
        comment,
      });
      toast.success("Thank you for your review!");
      onReviewSubmitted();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Add bg-white to make the modal opaque */}
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Leave a Review for {appointment?.doctor_name}</DialogTitle>
          <DialogDescription>Your feedback helps others make informed decisions.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div 
            className="flex justify-center space-x-2"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Share your experience... (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-slate-100"
          />
        </div>
        <DialogFooter>
            <Button onClick={handleSubmit} className="w-full">Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;