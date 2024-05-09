import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';
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
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [elections, setElections] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [electionSearch, setElectionSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      toast.error("Access denied. Admins only.");
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const responses = await Promise.all([
          fetch('http://localhost:8080/api/elections', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8080/admin_only/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!responses[0].ok || !responses[1].ok) throw new Error('Failed to fetch data');
        
        const electionsData = await responses[0].json();
        const usersData = await responses[1].json();
        setElections(electionsData);
        setUsers(usersData);
      } catch (error) {
        toast.error('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, [user, navigate]);
  
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/elections', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch elections');
        const data = await response.json();
        setElections(data);
      } catch (error) {
        toast.error('Failed to load elections. Please try again later.')
      }
    };
  
    fetchElections();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/admin_only/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users. Please try again later.')
      }
    };
    fetchUsers();
  }, []);

  const handleCreateElection = () => {
    navigate('/create-election');
  };

  const handleDeleteElection = async (electionId) => {
    try {
      const response = await fetch(`http://localhost:8080/admin_only/api/elections/${electionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to delete election');
      setElections(elections.filter(election => election.id !== electionId));
      toast.success('Election deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete election. Please try again later.')
    }
  };

  const handleEditElection = (electionId) => {
    navigate(`/edit-election/${electionId}`);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/admin_only/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user. Please try again later.')
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const saveUser = async (userData) => {
    try {
    const response = await fetch(`http://localhost:8080/admin_only/api/users/${userData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    const updatedUser = await response.json();
    setUsers(users.map(user => user.id === userData.id ? updatedUser : user));
    closeModal();
    toast.success('User saved successfully!');
  } catch (error) {
    toast.error('Failed to save updated user. Please try again later.')
  }
  };

  const handleCreateUser = async (userData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/admin_only/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
          throw new Error('Failed to save user');
        }
        const newUser = await response.json();
        setUsers(users => [...users, newUser]);
        setCreateModalOpen(false);
        toast.success('User created successfully!');
    } catch (error) {
        toast.error('Failed creating user. Please try again later.');
    }
};

return (
  <Container maxW="container.xl" p={5}>
      <VStack spacing={5} align="center">
        <Box w="full" bg={useColorModeValue('gray.100', 'gray.700')} p={8} borderRadius="lg" boxShadow="lg">
          <Heading mb={4} textAlign="center">Admin Dashboard</Heading>
          
          <Box>
            <Heading size="md" mb={4}>Elections List</Heading>
            <Stack direction="row" mb={4} align="center">
              <Input
                placeholder="Search Elections"
                value={electionSearch}
                onChange={e => setElectionSearch(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleCreateElection}>Create New Election</Button>
            </Stack>
            <List spacing={3} maxH="lg" overflowY="auto">
              {elections.filter(election => election.title.toLowerCase().includes(electionSearch.toLowerCase())).map((election) => (
                <ListItem key={election.id} bg="white" p={5} borderRadius="md">
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Text fontSize="md">
                      {election.title} - Starts: {new Date(election.startTime).toLocaleString()} - Ends: {new Date(election.endTime).toLocaleString()}
                    </Text>
                    <Stack direction="row" spacing={2}>
                      <Button colorScheme="teal" onClick={() => handleEditElection(election.id)}>Edit</Button>
                      <Button colorScheme="green" onClick={() => navigate(`/election-results/${election.id}`)}>View Results</Button>
                      <Button colorScheme="red" onClick={() => handleDeleteElection(election.id)}>Delete</Button>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box mt={10}>
            <Heading size="md" mb={4}>User List</Heading>
            <Stack direction="row" mb={4} align="center">
              <Input
                placeholder="Search Users"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              <Button colorScheme="blue" onClick={() => setCreateModalOpen(true)}>Create New User</Button>
            </Stack>
            <List spacing={3} maxH="lg" overflowY="auto">
              {users.filter(user => user.username.toLowerCase().includes(userSearch.toLowerCase())).map(user => (
                <ListItem key={user.id} bg="white" p={5} borderRadius="md">
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Text fontSize="md">{user.username} - {user.email} - {user.type}</Text>
                    <Stack direction="row" spacing={2}>
                      <Button colorScheme="teal" onClick={() => openModal(user)}>Edit</Button>
                      <Button colorScheme="red" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Box>

          {isCreateModalOpen && (
            <CreateUserModal
              isOpen={isCreateModalOpen}
              onClose={() => setCreateModalOpen(false)}
              onSave={handleCreateUser}
            />
          )}

          {isModalOpen && selectedUser && (
            <EditUserModal
              isOpen={isModalOpen}
              onClose={closeModal}
              user={selectedUser}
              onSave={saveUser}
            />
          )}

        </Box>
      </VStack>
    </Container>
)};

export default AdminDashboard;