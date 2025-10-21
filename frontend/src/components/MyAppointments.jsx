// frontend/src/components/MyAppointments.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from 'lucide-react';
import { cn } from "@/lib/utils";

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
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">My Appointments</CardTitle>
        <CalendarDays className="h-6 w-6 text-blue-500" />
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Doctor</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="font-medium">{appt.doctor_name}</div>
                    <div className="text-sm text-muted-foreground">{appt.specialization}</div>
                  </TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell className="text-right">
                    {/* ENHANCED CONDITIONAL BADGE COLORS */}
                    <Badge className={cn(
                      "font-semibold capitalize", // 'capitalize' makes sure status is "Completed", not "completed"
                      appt.status === 'Completed'
                        ? "bg-slate-100 text-slate-800"
                        : "bg-blue-100 text-blue-800"
                    )}>
                      {appt.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-4">You have no upcoming appointments.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default MyAppointments;

