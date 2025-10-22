// frontend/src/components/Homepage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal'; // Your GSAP component
import { Stethoscope, Calendar, UserPlus } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import { useScrollDirection } from '../hooks/useScrollDirection'; // Import our new hook

const Homepage = () => {
  const scrollDirection = useScrollDirection();

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-blue-50 to-white p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-up">
          Welcome to <span className="text-blue-600">CareConnect</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Effortless appointment scheduling for patients and doctors. Your health, organized.
        </p>
        <Link to="/login">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        {/* The title now uses the GSAP ScrollReveal component */}
        <ScrollReveal
          textClassName="text-center text-4xl font-bold mb-16 text-gray-800"
          containerClassName="w-full"
        >
          Streamline Your Healthcare Experience
        </ScrollReveal>

        {/* This motion.div will animate based on scroll direction */}
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center"
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
          // Animate to 'visible' when scrolling down, and 'hidden' when scrolling up
          animate={scrollDirection === "down" ? "visible" : "hidden"}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Feature 1 */}
          <div className="p-6">
            <UserPlus className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
            <p className="text-gray-600">Quickly sign up as a patient or a doctor to get started.</p>
          </div>

          {/* Feature 2 */}
          <div className="p-6">
            <Stethoscope className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Find Your Doctor</h3>
            <p className="text-gray-600">Browse specialists and find the right doctor for your needs.</p>
          </div>

          {/* Feature 3 */}
          <div className="p-6">
            <Calendar className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Book with Ease</h3>
            <p className="text-gray-600">Select an available time slot and book your appointment in seconds.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Homepage;