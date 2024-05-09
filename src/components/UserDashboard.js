import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Heading,
  Input,
  List,
  ListItem,
  Stack,
  VStack,
  Text,
  Container
} from '@chakra-ui/react';

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your dashboard.");
      navigate('/login');
      return;
    }

    const fetchElections = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/elections', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if(!response.ok) throw new Error('Failed to fetch elections.');
        const data = await response.json();
        setElections(data);
      } catch (error) {
        toast.error('Failed to fetch elections.');
      }
    };

    fetchElections();
  }, [user, navigate]);

  return (
    <Container maxW="container.xl" p={5}>
      <VStack spacing={5} align="center">
        <Box w="full" bg="gray.100" p={8} borderRadius="lg" boxShadow="lg">
          <Heading mb={4} textAlign="center">Explore Elections</Heading>
          <Text textAlign="center" fontSize="lg" fontWeight="semibold">Every vote counts. Make yours count too!</Text>
          <Input
            placeholder="Search Elections"
            mt={6}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <List spacing={3} mt={4} maxH="4xl" overflowY="auto">
            {elections
              .filter(election => election.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(election => (
                <ListItem key={election.id} bg="white" p={5} borderRadius="md">
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Text fontSize="md">
                      {election.title} - Starts: {new Date(election.startTime).toLocaleString()} - Ends: {new Date(election.endTime).toLocaleString()}
                    </Text>
                    {!election.hasVoted && new Date(election.endTime) > new Date() && new Date(election.startTime) <= new Date() && (
                      <Button colorScheme="blue" onClick={() => navigate(`/vote-election/${election.id}`)}>Vote</Button>
                    )}
                    {new Date(election.endTime) < new Date() && (
                      <Button colorScheme="teal" onClick={() => navigate(`/election-results/${election.id}`)}>View Results</Button>
                    )}
                  </Stack>
                </ListItem>
              ))}
          </List>
        </Box>
      </VStack>
    </Container>
  );
};

export default UserDashboard;