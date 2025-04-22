import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Calendar, Award, TrendingUp, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const rollNumber = '2020UCP0012';

  useEffect(() => {
    axios.get(`http://localhost:5000/dashboard?roll_number=${rollNumber}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [rollNumber]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back, {data.user}!</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Progress – replaced with CGPA as percentage proxy */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall CGPA</h3>
            <TrendingUp className="w-6 h-6 text-teal-100" />
          </div>
          <div className="text-3xl font-bold mb-2">
            {data.progress?.current_cgpa ?? "Not available"}
          </div>
          <div className="w-full bg-teal-400/30 rounded-full h-2 mb-4">
            <div
              className="bg-white rounded-full h-2"
              style={{ width: `${(data.progress?.current_cgpa || 0) * 10}%` }}
            ></div>
          </div>
          <p className="text-teal-100">Keep going! You're doing great.</p>
        </div>

        {/* Active Courses */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Active Courses</h3>
            <BookOpen className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{data.courses}</div>
          <p className="text-gray-500">Currently enrolled courses</p>
        </div>

        {/* Achievements */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
            <Award className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{data.badges}</div>
          <p className="text-gray-500">Badges earned this semester</p>
        </div>
      </div>

      {/* Deadlines & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadlines */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          {data.deadlines.length === 0 ? (
            <p className="text-gray-500">No upcoming deadlines</p>
          ) : (
            <ul className="space-y-4">
              {data.deadlines.map((item: any, i: number) => (
                <li key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.Title}</h4>
                    <p className="text-sm text-gray-500">{item.CourseName}</p>
                  </div>
                  <span className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-full">
                    {new Date(item.EndDate).toDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>
          <div className="space-y-4">
            {data.activity.map((item: any, i: number) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="p-2 bg-teal-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-gray-800">
                    Completed {item.CourseName} • Grade: {item.Grade}
                  </p>
                  <p className="text-sm text-gray-500">Course Code: {item.CourseCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CGPA + SGPA Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Current CGPA</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {data.progress?.current_cgpa ?? "Not available"}
          </div>
          <p className="text-gray-500">Your current CGPA based on completed courses</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Predicted SGPA</h3>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {data.progress?.predicted_sgpa ?? "Not available"}
          </div>
          <p className="text-gray-500">Your predicted SGPA for the current semester</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;