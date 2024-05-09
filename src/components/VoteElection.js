import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  Text
} from '@chakra-ui/react';

const VoteElection = () => {
  const { user } = useAuth();
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to vote.");
      navigate('/login');
      return;
    }

    const fetchElectionAndOptions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const electionResponse = await fetch(`http://localhost:8080/api/elections/${electionId}`, { headers });
        const electionData = await electionResponse.json();

        const voteOptionsResponse = await fetch(`http://localhost:8080/api/vote-options/by-election/${electionId}`, { headers });
        const voteOptionsData = await voteOptionsResponse.json();

        if(!electionResponse.ok || !voteOptionsResponse.ok) throw new Error('Failed to load election and vote options');
        setElection({
          ...electionData,
          startTime: new Date(electionData.startTime),
          endTime: new Date(electionData.endTime),
          voteOptions: voteOptionsData
        });
      } catch (error) {
        toast.error('Failed to load election and vote options');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionAndOptions();
  }, [electionId, user, navigate]);

  const handleSelectOption = (optionId) => {
    if (!voteSubmitted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitVote = async () => {
    if (selectedOption && !voteSubmitted && !isLoading) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/vote/${electionId}/${selectedOption}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: localStorage.getItem('userId') })
        });

        setVoteSubmitted(true);
        setError('');
        toast.success('Vote submitted successfully!');
        navigate('/user-dashboard');
      } catch (error) {
        toast.error('Vote failed. Please try again later.');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxW="container.md" p={5} centerContent>
  <VStack spacing={4} align="stretch">
    <Box textAlign="center">
      <Heading as="h1" mb={4}>{election?.title}</Heading>
      <Text fontSize="lg">{election?.description}</Text>
    </Box>
    <SimpleGrid columns={1} spacing={5}>
      {election?.voteOptions.map(option => (
        <Box
          key={option.id}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          maxW="640px"
          w="full"
          bg={selectedOption === option.id ? "green.100" : "white"}
        >
          <VStack align="stretch">
            <Heading as="h3" size="md">{option.name}</Heading>
            <Text>{option.description}</Text>
            {voteSubmitted ? (
              <Text color="green.500">Vote submitted for this option!</Text>
            ) : (
              <Button colorScheme="blue" onClick={() => handleSelectOption(option.id)}>Vote</Button>
            )}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
    {selectedOption && !voteSubmitted && (
      <Button
        colorScheme="green"
        size="lg"
        mt={4}
        w={["full", "auto"]}
        onClick={handleSubmitVote}
      >
        Submit Vote
      </Button>
    )}
  </VStack>
</Container>
  );
};

export default VoteElection;