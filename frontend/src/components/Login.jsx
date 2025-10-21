// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import api from '../api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);
      globalThis.location.href = '/dashboard';
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      {/* Card now animates on load */}
      <Card className="w-[400px] shadow-lg animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">Welcome Back</CardTitle>
          <CardDescription>Log in to manage your appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {/* Input fields now have a blue "glow" on focus */}
              <Input
                id="username"
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {/* Button has white text and a subtle hover scale effect */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-transform hover:scale-[1.02]"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
            {/* Links have a smoother color transition */}
            <p>Need an account? <a href="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Register as a Patient</a></p>
            <p className="mt-2">Are you a doctor? <a href="/register-doctor" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Register Here</a></p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;