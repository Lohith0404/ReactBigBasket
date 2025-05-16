import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!email || !username || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Check if user already registered
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.find(u => u.email === email)) {
      alert('User already registered with this email');
      return;
    }

    users.push({ email, username, password });
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    alert('Registration successful! Please sign in.');
    navigate('/signin');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
};

export default Register;
