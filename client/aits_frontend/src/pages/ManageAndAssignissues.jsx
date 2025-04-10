import React, { useState, useEffect } from 'react';
import './ManageAndAssignIssues.css'; 

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
      { id: 4, issue: 'Login issue', status: 'Pending', studentNumber: 'S12345', course: 'cs101' },
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
    setSelectedIssue(null);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Assigned': return 'status-assigned';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  };

  return (
    <div className='manage-container'>
      <div className="page-header">
        <h2>Manage and Assign Student Issues</h2>
        
        <div className="filter-container">
          <label className="filter-label">
            Filter by Status:
            <select 
              className="filter-select"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
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
                  <td>
                    {courseUnits.find(unit => unit.id === issue.course)?.name || issue.course}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    {issue.status === 'Pending' && (
                      <button 
                        className="action-button assign-button"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedIssue && (
        <div className="assignment-panel">
          <h3>Assign Issue to Lecturer</h3>
          <div className="issue-details">
            <div className="detail-item">
              <span className="detail-label">Issue:</span>
              <span className="detail-value">{selectedIssue.issue}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Course:</span>
              <span className="detail-value">
                {courseUnits.find(unit => unit.id === selectedIssue.course)?.name || selectedIssue.course}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Student:</span>
              <span className="detail-value">{selectedIssue.studentNumber}</span>
            </div>
          </div>

          <form onSubmit={handleAssign} className="assignment-form">
            <div className="form-group">
              <label className="form-label">
                Assign To Lecturer:
                <select 
                  className="form-select"
                  value={selectedLecturer} 
                  onChange={(e) => setSelectedLecturer(e.target.value)}
                >
                  <option value="">-- Select a Lecturer --</option>
                  {lecturers.map(lecturer => (
                    <option key={lecturer.id} value={lecturer.name}>{lecturer.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setSelectedIssue(null)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Assign Issue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageAndAssignIssues;
