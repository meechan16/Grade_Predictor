import React from 'react';
import { TrendingUp, Award, BookOpen, AlertCircle } from 'lucide-react';

const grades = [
  {
    id: 1,
    course: 'Web Development',
    instructor: 'Dr. Sarah Johnson',
    currentGrade: 'A',
    percentage: 92,
    assignments: [
      { name: 'Project 1', score: 95, total: 100 },
      { name: 'Midterm', score: 88, total: 100 },
      { name: 'Quiz 1', score: 85, total: 100 }
    ]
  },
  {
    id: 2,
    course: 'Data Structures',
    instructor: 'Prof. Michael Chen',
    currentGrade: 'B+',
    percentage: 87,
    assignments: [
      { name: 'Assignment 1', score: 90, total: 100 },
      { name: 'Quiz 1', score: 82, total: 100 },
      { name: 'Project 1', score: 88, total: 100 }
    ]
  },
  {
    id: 3,
    course: 'Software Engineering',
    instructor: 'Dr. Emily Williams',
    currentGrade: 'A-',
    percentage: 89,
    assignments: [
      { name: 'Group Project', score: 92, total: 100 },
      { name: 'Presentation', score: 88, total: 100 },
      { name: 'Quiz 1', score: 85, total: 100 }
    ]
  },
  {
    id: 4,
    course: 'Machine Learning',
    instructor: 'Prof. David Lee',
    currentGrade: 'B',
    percentage: 84,
    assignments: [
      { name: 'Assignment 1', score: 85, total: 100 },
      { name: 'Project 1', score: 82, total: 100 },
      { name: 'Quiz 1', score: 80, total: 100 }
    ]
  }
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const Grades = () => {
  const gpa = 3.75;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Grades</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Current GPA:</span>
          <span className="text-2xl font-bold text-teal-600">{gpa}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Performance</h3>
            <TrendingUp className="w-6 h-6 text-teal-100" />
          </div>
          <div className="text-3xl font-bold mb-2">88%</div>
          <p className="text-teal-100">Class Average: 82%</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Courses</h3>
            <BookOpen className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">4</div>
          <p className="text-gray-500">Currently Enrolled</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Academic Standing</h3>
            <Award className="w-6 h-6 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">Good</div>
          <p className="text-gray-500">Dean's List Eligible</p>
        </div>
      </div>

      <div className="space-y-6">
        {grades.map((course) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{course.course}</h3>
                  <p className="text-gray-500">{course.instructor}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${getGradeColor(course.currentGrade)}`}>
                  {course.currentGrade}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Current Progress</span>
                  <span className="text-teal-600 font-medium">{course.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${course.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                {course.assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-t border-gray-100">
                    <span className="text-gray-600">{assignment.name}</span>
                    <span className="font-medium text-gray-800">{assignment.score}/{assignment.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;