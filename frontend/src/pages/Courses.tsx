import React, { useEffect, useState } from 'react';
import { Users, Star, CalendarDays, Clock, X } from 'lucide-react';
import axios from 'axios';

// Seeded random function
const seededRandom = (seed: string): number => {
  let x = Math.sin(parseInt(seed)) * 10000;
  return x - Math.floor(x);
};

interface Course {
  CourseCode: string;
  CourseName: string;
  InstructorName: string;
  Deadlines: { title: string; due_date: string }[];
  progress: number;
  next_class: string;
  students: number;
  rating: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePopup, setActivePopup] = useState<number | null>(null);
  const rollNumber = '2020UCP0012'; // Replace with dynamic value if needed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/students/2020UCP0012/courses`,
          {
            withCredentials: true,
          }
        );
        console.log('API response:', response.data); // Log the response for debugging

        // Get the current date as a string (YYYY-MM-DD format)
        const today = new Date().toISOString().split('T')[0];

        // Simulating additional data since your response does not provide it
        const coursesWithSimulatedData = response.data.map((course: any) => {
          // Use the current date as the seed for consistent random values
          const seed = today + course.CourseCode; // Combining date and course code for uniqueness
          const random = seededRandom(seed);

          return {
            ...course,
            progress: Math.floor(random * 101), // Random progress percentage
            next_class: `Next Class: ${Math.floor(random * 10) + 1} PM`, // Random time for next class
            students: Math.floor(random * 3) + 2, // Random number of students between 50 and 550
            rating: (random * 5).toFixed(1), // Random rating between 0 and 5
          };
        });

        setCourses(coursesWithSimulatedData);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [rollNumber]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading courses...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">My Courses</h2>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300">
          Browse More Courses
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-600">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.CourseCode}
              className="relative bg-white border border-gray-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.CourseName}</h3>
                <p className="text-sm text-gray-600">{course.InstructorName}</p>

                <div className="flex items-center justify-between mb-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{course.students} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-700">{course.rating}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-teal-600 font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{course.next_class}</span>
                  </div>
                  <button
                    className="text-teal-600 hover:text-teal-700 font-medium"
                    onClick={() => setActivePopup(index)}
                  >
                    Deadlines
                  </button>
                </div>
              </div>

              {activePopup === index && (
                <div className="absolute inset-0 z-30 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                      onClick={() => setActivePopup(null)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-teal-600" />
                      Upcoming Deadlines
                    </h4>
                    {course.Deadlines.length === 0 ? (
                      <p className="text-gray-500">No upcoming deadlines.</p>
                    ) : (
                      <ul className="space-y-3">
                        {course.Deadlines.map((dl, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span className="text-gray-700">{dl.title}</span>
                            <span className="text-sm text-gray-500">{dl.due_date}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;