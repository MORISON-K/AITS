import React from "react";


const AssignedIssues = () => {
  // Data to be fetched from an API
  const data = [
    { ID: "001", course: "CSC 1101", studentNumber: "24007", category: "Missing Marks", date: "01-10-2021" },
    { ID: "002", course: "CSC 1101", studentNumber: "24008", category: "Missing Marks", date: "01-10-2021" },
    { ID: "003", course: "CSC 1100", studentNumber: "24009", category: "Wrong Credentials", date: "01-10-2021" },
  ];

  return (
    <div className="assigned-issues">
      <h1>Assigned Issues</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col" className="AssignedIsues-th">ID</th>
              <th scope="col" className="AssignedIsues-th">Course Unit</th>
              <th scope="col" className="AssignedIsues-th">Student Number</th>
              <th scope="col" className="AssignedIsues-th">Issue Category</th>
              <th scope="col" className="AssignedIsues-th">Date Created</th>
             
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="AssignedIsues-td">{row.ID}</td>
                <td className="AssignedIsues-td">{row.course}</td>
                <td className="AssignedIsues-td">{row.studentNumber}</td>
                <td className="AssignedIsues-td">{row.category}</td>
                <td className="AssignedIsues-td">{row.date}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedIssues;
