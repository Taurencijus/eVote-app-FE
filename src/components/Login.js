import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Input, Heading, Box, FormControl, FormLabel } from '@chakra-ui/react';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      console.log('Redirecting because user is:', user);
      toast.info("You are already logged in. Redirecting to your dashboard...");
      navigate(user.role === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        login(data);
        localStorage.setItem('token', data.token);
        navigate(data.role === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard');
        toast.success('Loging successful!');
    } catch (error) {
        toast.error('Login failed. Check if username and password are correct.');
    }
};

return (
  <Box p={5}>
    <Heading mb={6}>Login</Heading>
    <form onSubmit={handleLogin}>
      <FormControl id="username" isRequired>
        <FormLabel>Username:</FormLabel>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired mt={4}>
        <FormLabel>Password:</FormLabel>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" size="lg" mt={4}>
        Login
      </Button>
    </form>
  </Box>
)};

export default Login;