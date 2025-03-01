import React, { useState, useEffect } from 'react';

const AssignIssue = () => {
  const [courseUnits, setCourseUnits] = useState([]); // List of course units
  const [lecturers, setLecturers] = useState([]); // List of lecturers
  const [issues, setIssues] = useState([]); // List of issues for selected course unit
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState('');

  // Simulating fetching data (Replace with actual API calls)
  useEffect(() => {
    setCourseUnits([
      { id: 'cs101', name: 'Computer Science 101' },
      { id: 'math202', name: 'Mathematics 202' },
    ]);
  }, []);

  // Fetch issues related to the selected course unit
  useEffect(() => {
    if (selectedCourse) {
      // Simulated issues per course unit
      const issuesByCourse = {
        cs101: [{ id: 1, title: 'Bug in CS101 assignment submission' }],
        math202: [{ id: 2, title: 'Error in Math202 grading system' }],
      };

      setIssues(issuesByCourse[selectedCourse] || []);
    } else {
      setIssues([]);
    }
  }, [selectedCourse]);

  // Fetch lecturers based on selected course unit
  useEffect(() => {
    if (selectedCourse) {
      // Simulated lecturers per course unit
      const lecturersByCourse = {
        cs101: [
          { id: 'lecturer_1', name: 'Dr. John Doe' },
          { id: 'lecturer_2', name: 'Prof. Alice Smith' },
        ],
        math202: [
          { id: 'lecturer_3', name: 'Dr. Brian Johnson' },
          { id: 'lecturer_4', name: 'Prof. Sarah Lee' },
        ],
      };

      setLecturers(lecturersByCourse[selectedCourse] || []);
    } else {
      setLecturers([]);
    }
  }, [selectedCourse]);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedIssue || !selectedLecturer) {
      alert('Please select a course unit, an issue, and a lecturer.');
      return;
    }

    console.log(`Issue "${selectedIssue}" for "${selectedCourse}" assigned to ${selectedLecturer}`);
    alert(`Issue assigned successfully!`);
  };

  return (
    <div>
      <h2>Assign Issue to Lecturer</h2>
      <form onSubmit={handleAssign}>
        <label>
          Select Course Unit:
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">-- Select a Course --</option>
            {courseUnits.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select Issue:
          <select value={selectedIssue} onChange={(e) => setSelectedIssue(e.target.value)} disabled={!selectedCourse}>
            <option value="">-- Select an Issue --</option>
            {issues.map((issue) => (
              <option key={issue.id} value={issue.title}>
                {issue.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Assign To Lecturer:
          <select value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)} disabled={!selectedCourse}>
            <option value="">-- Select a Lecturer --</option>
            {lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.name}>
                {lecturer.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Assign Issue</button>
      </form>
    </div>
  );
};

export default AssignIssue;
