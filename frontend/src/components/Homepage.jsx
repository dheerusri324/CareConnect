// frontend/src/components/Homepage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TextType from '@/components/ui/TextType';
import { Stethoscope, Calendar, UserPlus } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-blue-50 to-white p-4">
        
        {/* Typing effect for the main headline */}
        <TextType
          as="h1"
          text={[
            "Welcome to CareConnect",
            "Your Health, Organized.",
            "Book Appointments Today!"
          ]}
          typingSpeed={100}
          deletingSpeed={50}
          pauseDuration={2500}
          className="text-5xl md:text-7xl font-medium text-slate-800 min-h-[180px] md:min-h-[240px]"
          cursorClassName="text-blue-600 text-6xl md:text-8xl"
        />

        <Link to="/login" className="mt-8">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg animate-fade-in-up">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        
        {/* Scroll reveal animation for the section title */}
        <ScrollReveal
          textClassName="text-center text-4xl font-bold mb-16 text-gray-800"
          containerClassName="w-full"
          baseRotation={0} // Keeps the text from being "cross"
        >
          Streamline Your Healthcare Experience
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          
          {/* Feature 1 with "Lift and Glow" hover effect */}
          <div className="p-6 border rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2">
            <UserPlus className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Easy Registration</h3>
            <p className="text-gray-600">Quickly sign up as a patient or a doctor to get started.</p>
          </div>

          {/* Feature 2 with "Lift and Glow" hover effect */}
          <div className="p-6 border rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2">
            <Stethoscope className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Find Your Doctor</h3>
            <p className="text-gray-600">Browse specialists and find the right doctor for your needs.</p>
          </div>

          {/* Feature 3 with "Lift and Glow" hover effect */}
          <div className="p-6 border rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2">
            <Calendar className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Book with Ease</h3>
            <p className="text-gray-600">Select an available time slot and book your appointment in seconds.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Homepage;