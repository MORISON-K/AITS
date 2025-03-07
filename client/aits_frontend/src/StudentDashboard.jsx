import React from 'react';
import './App.css'; 
import "boxicons/css/boxicons.min.css";
import { Link } from 'react-router-dom';


const StudentDashboard = () => {
  return (
    <div className="admin-hub">
      {/* SIDEBAR */}
      <section id="sidebar">
        <a href="#" className="brand">
          <i className="bx bxs-smile"></i>
          <span className="text">Profile</span>
        </a>
        <ul className="side-menu top">
          <li className="active">
            <a href="#">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="bx bxs-shopping-bag-alt"></i>
              <Link to="/IssueSubmission-Page" className='text'>Create a New Isuue</Link>
             
            </a>
          </li>
          <li>
            <a href="#">
              <i className="bx bxs-bell"></i>
              <span className="text">Notifications</span>
            </a>
          </li>
        </ul>
        <ul className="side-menu">
          <li>
            <a href="#" className="logout">
              <i className="bx bxs-log-out-circle"></i>
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </section>
      {/* END SIDEBAR */}

      {/* CONTENT */}
      <section id="content">
       

        <main>
          <div className="head-title">
            <div className="left">
              <h1>Welcome Student !</h1>
              <ul className="breadcrumb">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
              </ul>
            </div>
          </div>

          <div className="table-data">
            <div className="order">
              <div className="head">
                <h3>Recent History</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Course Unit</th>
                    <th>Issue Category</th>
                    <th>Date Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      
                      <p>CSC 1101</p>
                    </td>
                    <td>Missing Marks</td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status completed">Resolved</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      
                      <p>CSC 1101</p>
                    </td>
                    <td>Missing Marks</td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                     
                      <p>CSC 1100</p>
                    </td>
                    <td>Wrong Credentials</td>
                    <td>01-10-2021</td>
                    <td>
                      <span className="status process">In Progress</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
      {/* END CONTENT */}
    </div>
  );
};

export default StudentDashboard;
