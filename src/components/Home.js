import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, VStack, Text, Button, Heading, Flex, Link as ChakraLink } from '@chakra-ui/react';

function Home() {
  const { user } = useAuth();

  return (
    <Flex direction="column" align="center" p={5} pt={10} minH="calc(100vh - 64px)"> {/* Assume 64px is your navbar's height */}
      <VStack spacing={8} align="stretch" w="full" maxW="container.md">
        <Box textAlign="center">
          <Heading as="h1" size="2xl">Welcome to the eVote Platform</Heading>
          <Text fontSize="xl">Join us and make your vote count!</Text>
        </Box>

        {!user && (
          <VStack spacing={4}>
            <Box bg="teal.50" p={5} borderRadius="lg" shadow="md">
              <Text fontSize="lg" mb={3}>Already registered? Log in to check out and participate in the latest elections and polls. Your voice matters!</Text>
              <ChakraLink as={Link} to="/login">
                <Button colorScheme="teal">Login</Button>
              </ChakraLink>
            </Box>
            <Box bg="blue.50" p={5} borderRadius="lg" shadow="md">
              <Text fontSize="lg" mb={3}>New to eVote? Register now and join a growing community of proactive citizens. Start voting today!</Text>
              <ChakraLink as={Link} to="/register">
                <Button colorScheme="blue">Register</Button>
              </ChakraLink>
            </Box>
          </VStack>
        )}

        <Box bg="gray.50" p={5} borderRadius="lg" shadow="md">
          <Text fontSize="lg" mb={3}>Want to know more about how eVote empowers every voice? Learn more about what we do and why we do it.</Text>
          <ChakraLink as={Link} to="/about-us">
            <Button colorScheme="gray">About Us</Button>
          </ChakraLink>
        </Box>
      </VStack>
    </Flex>
  );
}

export default Home;