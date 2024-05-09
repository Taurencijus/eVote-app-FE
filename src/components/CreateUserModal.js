import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  ModalFooter
} from '@chakra-ui/react';

const CreateUserModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      toast.error("Access Denied: Only admins can create users.");
      navigate('/');
    }
  }, [user, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('USER');

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSave({ username, password, email, type });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create User</ModalHeader>
      <ModalCloseButton />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Type</FormLabel>
            <Select value={type} onChange={e => setType(e.target.value)}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} type="submit">
            Create User
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </form>
    </ModalContent>
  </Modal>
  );
};

export default CreateUserModal;