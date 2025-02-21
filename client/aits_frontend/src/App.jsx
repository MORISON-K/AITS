import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <nav>
        <button onClick={() => handlePageChange('login')}>Login</button>
        <button onClick={() => handlePageChange('register')}>Register</button>
      </nav>
      {currentPage === 'login' ? <Login /> : <Register />}
    </div>
  );
}

export default App;
