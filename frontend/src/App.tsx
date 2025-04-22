import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Calendar, Layout, Users, BookOpenCheck, GraduationCap, Settings, ClipboardCheck } from 'lucide-react';

import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import GradedComponents from './pages/GradedComponents';
import Setting from './pages/Setting';
import InstructorDashboard from './pages/InstructorDashboard';
import GradedComponentForm from './pages/GradedComponentForm';

const queryClient = new QueryClient();

const studentNav = [
  { icon: Layout, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Courses', path: '/courses' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
];

const profNav = [
  { icon: Layout, label: 'Dashboard', path: '/instructordashboard' },
  { icon: Users, label: 'Courses', path: '/courses' },
  { icon: Users, label: 'Add Graded Component', path: '/Addgraded' },
  { icon: Users, label: 'View Graded Components', path: '/GradedComponents' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // "student" or "instructor"

  const handleLogin = (userRole: 'student' | 'instructor') => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const navigationItems = role === 'instructor' ? profNav : studentNav;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {!isLoggedIn ? (
          <Routes>
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        ) : (
          <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <Sidebar items={navigationItems} />
                </div>

                <div className="md:col-span-3">
                  <div className="bg-white rounded-lg shadow">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/instructordashboard" element={<InstructorDashboard />} />
                      <Route path="/courses" element={<Courses />} />
                      <Route path="/Addgraded" element={<GradedComponentForm />} />
                      <Route path="/GradedComponents" element={<GradedComponents />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/assignments" element={<Assignments />} />
                      <Route path="/grades" element={<Grades />} />
                      <Route path="/setting" element={<Setting />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Router>
    </QueryClientProvider>
  );
}

export default App;