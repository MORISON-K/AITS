import React from 'react';
import { Link } from 'react-router-dom';

const RegistrarDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Registrar Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          <li><Link to="/ManageIssues" className="text-blue-600 hover:underline">Manage Student Issues</Link></li>
          <li><Link to="/CreateIssue" className="text-blue-600 hover:underline">Create an Issue</Link></li>
          <li><Link to="/AssignIssue" className="text-blue-600 hover:underline">Assign an Issue</Link></li>
                  </ul>
      </nav>
    </div>
  );
};

export default RegistrarDashboard;