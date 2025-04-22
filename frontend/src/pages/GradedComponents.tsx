import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, Clipboard, Edit2 } from "lucide-react";

interface Component {
  ComponentName: string;
  Percentage: number;
}

interface GradedComponent {
  course: string;
  courseCode: string;
  components: Component[];
}

const GradedComponents = () => {
  const [gradedComponents, setGradedComponents] = useState<GradedComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGradedComponents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/instructor/graded-components");
        setGradedComponents(response.data.graded_components);
      } catch (err) {
        setError("Failed to fetch graded components");
      } finally {
        setLoading(false);
      }
    };

    fetchGradedComponents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Graded Components</h2>
        <p className="text-gray-500">Manage your course components and percentages</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 rounded bg-red-50 text-red-500">{error}</div>
      ) : gradedComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradedComponents.map((gradedComponent) => (
            <div key={gradedComponent.courseCode} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-teal-600" />
                  {gradedComponent.course}
                </h3>
                <p className="text-teal-600">{gradedComponent.courseCode}</p>
              </div>

              <div className="space-y-3">
                {gradedComponent.components.map((component) => (
                  <div key={component.ComponentName} className="flex justify-between items-center">
                    <span className="text-gray-800 flex items-center gap-2">
                      <Clipboard className="w-5 h-5 text-teal-500" />
                      {component.ComponentName}
                    </span>
                    <span className="text-sm text-gray-500">{component.Percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button className="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-white border border-gray-200 rounded-lg text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No graded components found</h3>
          <p>There are no graded components for your courses yet.</p>
        </div>
      )}
    </div>
  );
};

export default GradedComponents;