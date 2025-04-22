import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const assignments = [
  {
    id: 1,
    title: 'Final Project',
    course: 'Web Development',
    dueDate: '2024-03-15',
    status: 'pending',
    priority: 'high',
    description: 'Build a full-stack web application using React and Node.js',
    progress: 60
  },
  {
    id: 2,
    title: 'Algorithm Implementation',
    course: 'Data Structures',
    dueDate: '2024-03-20',
    status: 'in-progress',
    priority: 'medium',
    description: 'Implement three sorting algorithms and compare their performance',
    progress: 30
  },
  {
    id: 3,
    title: 'System Design Document',
    course: 'Software Engineering',
    dueDate: '2024-03-25',
    status: 'completed',
    priority: 'medium',
    description: 'Create a detailed system design document for the semester project',
    progress: 100
  },
  {
    id: 4,
    title: 'Research Paper',
    course: 'Machine Learning',
    dueDate: '2024-03-30',
    status: 'pending',
    priority: 'low',
    description: 'Write a research paper on recent advances in neural networks',
    progress: 0
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 text-green-600';
    case 'in-progress':
      return 'bg-yellow-50 text-yellow-600';
    default:
      return 'bg-red-50 text-red-600';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-600';
    case 'medium':
      return 'bg-yellow-50 text-yellow-600';
    default:
      return 'bg-blue-50 text-blue-600';
  }
};

const Assignments = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Create New Assignment
        </button>
      </div>

      <div className="space-y-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{assignment.title}</h3>
                <p className="text-gray-500">{assignment.course}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{assignment.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${assignment.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{assignment.progress}%</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;