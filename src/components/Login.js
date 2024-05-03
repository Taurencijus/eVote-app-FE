import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await authenticateUser(username, password);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const authenticateUser = (username, password) => {
    console.log('Authenticating', username, password);
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === 'password') {
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;