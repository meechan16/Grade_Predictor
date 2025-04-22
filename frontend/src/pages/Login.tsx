import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // We'll use react-router-dom to redirect

interface LoginProps {
  onLogin: (role: 'student' | 'instructor') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Local server URL (localhost with port 5000)
    const backendUrl = 'http://localhost:5000/login'; // Change this URL to match your backend endpoint

    // Send login request to backend
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        // Successful login, redirect to the appropriate dashboard
        onLogin(role);
        navigate(data.redirect_url);
        if (data.redirect_url) {
          navigate(data.redirect_url); // Redirect to the role-specific dashboard
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 text-white items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="p-10 text-center z-10"
        >
          <h1 className="text-4xl font-bold mb-4">IIITD Grade Predictor</h1>
          <p className="text-lg max-w-md mx-auto">
            Empowering students and instructors with insights, performance trends, and predictive analytics for a smarter academic journey.
          </p>
        </motion.div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
      </div>

      {/* Right Panel - Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-teal-700 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="yourname@iiitd.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 pt-4">
            &copy; {new Date().getFullYear()} IIIT Delhi – Grade Predictor
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;