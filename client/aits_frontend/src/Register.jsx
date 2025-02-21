
// src/Register.jsx
import React, { useState } from 'react';

const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/register', {
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

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { name, email, password };
    registerUser(userData).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        <br />
        <label>Email:</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;