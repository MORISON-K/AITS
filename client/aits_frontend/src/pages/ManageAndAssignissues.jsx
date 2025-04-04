import React, { useState, useEffect } from 'react';

const ManageAndAssignIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [courseUnits, setCourseUnits] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState('');

  useEffect(() => {
    setIssues([
      { id: 1, issue: 'Login issue', status: 'Pending', studentNumber: 'S12345', course: 'cs101' },
      { id: 2, issue: 'Error in grading', status: 'Assigned', studentNumber: 'S67890', course: 'math202' },
      { id: 3, issue: 'Course registration failure', status: 'Resolved', studentNumber: 'S11223', course: 'cs101' },
    ]);
    setCourseUnits([
      { id: 'cs101', name: 'Computer Science 101' },
      { id: 'math202', name: 'Mathematics 202' },
    ]);
  }, []);

  useEffect(() => {
    if (selectedIssue) {
      const lecturersByCourse = {
        cs101: [
          { id: 'lecturer_1', name: 'Dr. John Paul' },
          { id: 'lecturer_2', name: 'Prof. John Kizito' },
        ],
        math202: [
          { id: 'lecturer_3', name: 'Mr.Bernard Muwonge' },
          { id: 'lecturer_4', name: 'Dr.Emmanuel Lule' },
        ],
      };
      setLecturers(lecturersByCourse[selectedIssue.course] || []);
    } else {
      setLecturers([]);
    }
  }, [selectedIssue]);

  const updateStatus = (id, newStatus) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedIssue || !selectedLecturer) {
      alert('Please select an issue and a lecturer.');
      return;
    }
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === selectedIssue.id ? { ...issue, status: 'Assigned' } : issue
      )
    );
    alert(`Issue "${selectedIssue.issue}" assigned to ${selectedLecturer}`);
  };
  

  return (
    <div className='manage'>
      <h2>Manage and Assign Student Issues</h2>
      
      <label>
        Filter by Status:
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
        </select>
      </label>

      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue</th>
            <th>Student Number</th>
            <th>Course</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues
            .filter(issue => filterStatus === 'All' || issue.status === filterStatus)
            .map(issue => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.issue}</td>
                <td>{issue.studentNumber}</td>
                <td>{issue.course}</td>
                <td>{issue.status}</td>
                <td>
                  {issue.status === 'Pending' && (
                    <button onClick={() => setSelectedIssue(issue)}>Assign</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedIssue && (
        <div>
          <h2>Assign Issue to Lecturer</h2>
          <form onSubmit={handleAssign}>
            <p><strong>Issue:</strong> {selectedIssue.issue}</p>
            <p><strong>Course:</strong> {selectedIssue.course}</p>

            <label>
              Assign To Lecturer:
              <select value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)}>
                <option value="">-- Select a Lecturer --</option>
                {lecturers.map(lecturer => (
                  <option key={lecturer.id} value={lecturer.name}>{lecturer.name}</option>
                ))}
              </select>
            </label>
            <button type="submit">Assign Issue</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageAndAssignIssues;
