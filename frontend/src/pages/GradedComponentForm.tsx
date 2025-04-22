import React, { useState } from "react";
import { Award, FileText } from "lucide-react";
import axios from "axios";

interface Component {
  name: string;
  percentage: number;
}

const GradedComponentForm = () => {
  const [courseCode, setCourseCode] = useState("");
  const [component, setComponent] = useState<Component>({ name: "", percentage: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/insert-graded-components", {
        courseCode,
        components: [component], // Send component as an array for consistency
      });
      setSuccess(response.data.message);
      setError("");
    } catch (err) {
      setError("Failed to insert graded component");
      setSuccess("");
    }
  };

  const handleComponentChange = (
    field: keyof Component,
    value: string | number
  ) => {
    setComponent((prevComponent) => ({
      ...prevComponent,
      [field]: field === "percentage" ? Number(value) : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Insert Graded Component</h2>
        <p className="text-gray-500">Add a graded component to your course</p>
      </div>

      {success && <div className="p-4 border border-teal-300 rounded bg-teal-50 text-teal-600">{success}</div>}
      {error && <div className="p-4 border border-red-300 rounded bg-red-50 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Course Code</h3>
          </div>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            placeholder="Enter Course Code"
            required
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Component</h3>
          </div>
          <div className="mb-4">
            <label className="text-gray-700">Component Name</label>
            <input
              type="text"
              value={component.name}
              onChange={(e) => handleComponentChange("name", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Component Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700">Percentage</label>
            <input
              type="number"
              value={component.percentage}
              onChange={(e) => handleComponentChange("percentage", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Percentage"
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition duration-200">
          Submit
        </button>
      </form>
    </div>
  );
};

export default GradedComponentForm;