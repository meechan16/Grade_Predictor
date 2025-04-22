import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bell } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <BookOpen className="w-8 h-8" />
            <span className="ml-2 text-xl font-bold">CourseCompass</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 cursor-pointer hover:text-teal-200" />
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="text-sm font-medium">DR</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;