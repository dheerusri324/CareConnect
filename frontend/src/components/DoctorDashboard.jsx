// frontend/src/components/DoctorDashboard.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import SplitText from '@/components/ui/SplitText';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/doctor/appointments');
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Failed to fetch doctor's appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>
            <SplitText
                text={`Dr. ${username}'s Dashboard`}
                variant="h1"
                className="text-3xl font-bold text-blue-600"
            />
        </CardTitle>
        <CardDescription>Here are your upcoming appointments.</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Patient Name</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{appt.patient_name}</TableCell>
                  <TableCell>{appt.date}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {appt.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">You have no upcoming appointments.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default DoctorDashboard;