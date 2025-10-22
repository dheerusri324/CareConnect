// frontend/src/components/DoctorList.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SplitText from "@/components/ui/SplitText";
import api from "../api";
import { cn } from "@/lib/utils";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner"; // Import the toast function

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  // The 'message' state is no longer needed

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/doctors");
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const fetchSlots = useCallback(async () => {
    if (selectedDoctor && date) {
      try {
        const response = await api.get(`/api/doctors/${selectedDoctor}/available-slots?date=${date}`);
        setSlots(response.data);
      } catch (error) {
        console.error("Failed to fetch slots", error);
        toast.error("Could not load appointment slots.");
      }
    }
  }, [selectedDoctor, date]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    setSlots([]);
    setSelectedTime("");
    fetchSlots();
  }, [selectedDoctor, date, fetchSlots]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      toast.warning("Please select a time slot.");
      return;
    }
    try {
      await api.post("/api/appointments", {
        doctor_id: selectedDoctor,
        date: date,
        time: selectedTime,
      });
      toast.success("Appointment booked successfully!");
      setTimeout(() => globalThis.location.reload(), 2000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error(err.response.data.message);
        setSelectedTime("");
        fetchSlots();
      } else {
        toast.error("Failed to book appointment.");
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>
          <SplitText
            text="Book an Appointment"
            variant="h2"
            className="text-2xl font-bold text-blue-600"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBooking} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Select a Doctor</label>
            <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a doctor..." />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm">
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id.toString()}>
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDoctor && (
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Select Appointment Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    {date ? date : "dd--mm--yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-xl">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(day) => {
                      if (day) {
                        const correctedDay = new Date(day);
                        correctedDay.setDate(correctedDay.getDate() + 1);
                        setDate(correctedDay.toISOString().split("T")[0]);
                      } else {
                        setDate("");
                      }
                    }}
                    disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {date && slots.length > 0 && (
            <Card className="bg-gray-50 p-4">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-md">Available Slots for {date}:</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant="outline"
                    disabled={slot.booked}
                    onClick={() => setSelectedTime(slot.time)}
                    className={cn(
                      "w-24",
                      selectedTime === slot.time && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {slot.time}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            disabled={!selectedTime}
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            Book Now
          </Button>

          {/* The old message <p> tag is no longer needed */}
        </form>
      </CardContent>
    </Card>
  );
}

export default DoctorList;