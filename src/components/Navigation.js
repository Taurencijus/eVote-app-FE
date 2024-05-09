import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Flex,
    Spacer,
    Button,
    useColorModeValue,
    Image
  } from '@chakra-ui/react';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const bgColor = useColorModeValue('gray.100', 'gray.900');
    const color = useColorModeValue('black', 'white');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Flex bg={bgColor} p="4" color={color} align="center">
            <Box p="2">
                <Image src="evote-logo.png" boxSize="50px" alt="eVote Logo" />
            </Box>
            <Spacer />
            <Box>
                <Link to="/"><Button colorScheme="teal" variant="ghost">Home</Button></Link>
                <Link to="/about-us"><Button colorScheme="teal" variant="ghost">About eVote</Button></Link>
                {user && (
                    <Link to={user.role === 'ADMIN' ? "/admin-dashboard" : "/user-dashboard"}>
                        <Button colorScheme="teal" variant="ghost">Dashboard</Button>
                    </Link>
                )}
            </Box>
            <Spacer />
            <Box>
                {user ? (
                    <Button colorScheme="red" variant="solid" onClick={handleLogout}>Logout</Button>
                ) : (
                    <>
                        <Link to="/login"><Button colorScheme="teal" variant="outline">Login</Button></Link>
                        <Link to="/register"><Button colorScheme="teal" variant="solid">Register</Button></Link>
                    </>
                )}
            </Box>
        </Flex>
    );
};

export default Navigation;