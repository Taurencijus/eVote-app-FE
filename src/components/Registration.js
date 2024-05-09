import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react';


const Registration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      toast.info("You are already registered and logged in.");
      navigate('/');
    }
  }, [user, navigate]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    const userData = { username, password, email };
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if(!response.ok) throw new Error('Registration failed')       
        toast.success('Registration successful!');
        navigate('/login');     
    } catch (error) {
      toast.error('Registration failed.');
    }
  };

  return (
    <Container centerContent p={6}>
  <VStack spacing={4} align="stretch" w="full" maxW="md">
    <Heading as="h2" size="lg" textAlign="center">Registration</Heading>
    <form onSubmit={handleRegistration}>
      <FormControl isRequired>
        <FormLabel htmlFor="username">Username:</FormLabel>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </FormControl>

      <FormControl isRequired mt={4}>
        <FormLabel htmlFor="email">Email:</FormLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </FormControl>

      <FormControl isRequired mt={4}>
        <FormLabel htmlFor="password">Password:</FormLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </FormControl>

      <Button
        mt={6}
        w="full"
        colorScheme="blue"
        type="submit"
      >
        Register
      </Button>
    </form>
  </VStack>
</Container>
  );
};

export default Registration;