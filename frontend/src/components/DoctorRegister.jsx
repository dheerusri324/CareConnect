// frontend/src/components/DoctorRegister.jsx

import React, { useState } from 'react';
import api from '../api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function DoctorRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/auth/register-doctor', {
        username,
        password,
        name,
        specialization,
      });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => { globalThis.location.href = '/login' }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <Card className="w-[400px] shadow-lg animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Doctor Registration</CardTitle>
          <CardDescription>Create your provider account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a login username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Dr. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Cardiology"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            {message && (
              <Alert className={message.includes('successful') ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-transform hover:scale-[1.02]"
            >
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
            <p>Already have an account? <a href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Login here</a></p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DoctorRegister;