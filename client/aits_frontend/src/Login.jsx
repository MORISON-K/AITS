// src/Login.jsx
import React, { useState } from 'react';

const loginUser = async (userData) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { email, password };
    loginUser(userData).then((response) => {
      console.log(response);
      // You might want to handle the response here, like redirecting the user
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
