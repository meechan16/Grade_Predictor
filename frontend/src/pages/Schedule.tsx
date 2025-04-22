import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import axios from 'axios';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface Class {
  id: number;
  subject: string;
  time: string;
  location: string;
  instructor: string;
  type: 'Lecture' | 'Lab';
}

interface DaySchedule {
  id: number;
  day: string;
  classes: Class[];
}

const Schedule = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const rollNumber = '2020UCP0012'; // Replace with dynamic value if needed

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/students/${rollNumber}/courses`, 
          { withCredentials: true }
        );
        
        // Example response data simulation
        const fetchedSchedule: DaySchedule[] = response.data.map((course: any, index: number) => ({
          id: index + 1,
          day: weekDays[index % weekDays.length], // Distribute the days randomly
          classes: [
            {
              id: index + 1,
              subject: course.CourseName,
              time: `10:00 AM - 11:30 AM`, // Simulate class time
              location: `Room ${Math.floor(Math.random() * 500)}`,
              instructor: course.InstructorName,
              type: index % 2 === 0 ? 'Lecture' : 'Lab', // Alternate between Lecture and Lab
            }
          ],
        }));

        setSchedule(fetchedSchedule);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    fetchSchedule();
  }, [rollNumber]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Class Schedule</h2>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50">
            Previous Week
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Next Week
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {schedule.map((day) => (
          <div key={day.id} className="border-b border-gray-200 last:border-b-0">
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">{day.day}</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {day.classes.map((class_) => (
                <div key={class_.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-1">{class_.subject}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{class_.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{class_.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>{class_.instructor}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      class_.type === 'Lecture' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      {class_.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;