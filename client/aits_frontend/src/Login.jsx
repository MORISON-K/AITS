import React, { useState } from "react";

const Login = ({ handlePageChange }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return alert("Please enter both email and password.");
    }
    console.log("Logging in with:", formData);
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" className="login-input" value={formData.email} onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" className="login-input" value={formData.password} onChange={handleChange} /><br />
        <span className="Forgot-Password">Forgot Password?</span><br />
        <button type="submit" className="login">Login</button><br />
        <span className="without">Don't have an account? </span>
        <span className="without-account" onClick={() => handlePageChange("register")}>Sign up</span>
      </form>
    </div>
  );
};

export default Login;
