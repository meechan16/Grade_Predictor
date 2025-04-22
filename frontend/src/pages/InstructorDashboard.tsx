import React, { useState, useEffect } from "react";
import { GraduationCap, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Course {
  CourseCode: string;
  Name: string;
}

interface Deadline {
  assignment: string;
  course: string;
  dueDate: string;
}

const InstructorDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const instructorId = 1; // Assuming instructor ID is 1 for testing

  useEffect(() => {
    if (!instructorId) {
      navigate("/");
      return;
    }

    const loadCoursesAndDeadlines = async () => {
      try {
        // Fetch courses from the local server
        const coursesResponse = await axios.get(`http://localhost:5000/instructor/dashboard`);
        setCourses(coursesResponse.data.courses);

        // Fetch deadlines from the local server
        const deadlinesResponse = await axios.get(`http://localhost:5000/instructor/dashboard`);
        setDeadlines(deadlinesResponse.data.deadlines);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesAndDeadlines();
  }, [instructorId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h2>
        <p className="text-gray-500">Manage your courses and student grades</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 rounded bg-red-50 text-red-500">
          {error}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.CourseCode}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-teal-600" />
                  {course.Name}
                </h3>
                <p className="text-teal-600">{course.CourseCode}</p>
              </div>
              <p className="text-sm text-gray-500">Click to manage students and grades</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-200 rounded-lg text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No courses found</h3>
          <p>You are not assigned to any courses yet.</p>
        </div>
      )}

      {/* Deadlines */}
      <div className="mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
            <Clock className="w-6 h-6 text-teal-600" />
          </div>
          {deadlines.length > 0 ? (
            <div className="space-y-4">
              {deadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{deadline.assignment}</h4>
                    <p className="text-sm text-gray-500">Course: {deadline.course}</p>
                  </div>
                  <span className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-full">
                    {deadline.dueDate}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming deadlines</p>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
            <Award className="w-6 h-6 text-teal-600" />
          </div>
          {/* Add achievement details here */}
          <p className="text-sm text-gray-500">Badges earned this semester</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;