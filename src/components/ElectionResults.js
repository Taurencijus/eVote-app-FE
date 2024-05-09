import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Box,
    Container,
    VStack,
    Text,
    Heading
  } from '@chakra-ui/react';

const ElectionResults = () => {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
    
        try {
            const [electionResponse, voteOptionsResponse, resultsResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/elections/${electionId}`, { headers }),
                fetch(`http://localhost:8080/api/vote-options/by-election/${electionId}`, { headers }),
                fetch(`http://localhost:8080/api/vote/count/by-election/${electionId}`, { headers })
            ]);
            const electionData = await electionResponse.json();
            const voteOptionsData = await voteOptionsResponse.json();
            const resultsData = await resultsResponse.json();
    
            const updatedVoteOptions = voteOptionsData.map(option => ({
                ...option,
                votes: resultsData[option.id] || 0
            }));
            if(!electionResponse.ok || !voteOptionsResponse.ok || !resultsResponse.ok) throw new Error('Failed to load results');
    
            setElection({
                ...electionData,
                startTime: new Date(electionData.startTime),
                endTime: new Date(electionData.endTime),
                voteOptions: updatedVoteOptions
            });
                setIsLoading(false);

        } catch (error) {
            toast.error('Failed to load results. Please try again later.')
        } 
    };

    fetchData();
  }, [electionId]);

  if (isLoading) return <div>Loading results...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!election) return <div>No election data available.</div>;

  return (
    <Container maxW="container.md" p={5}>
    <VStack spacing={4} align="stretch">
      <Heading as="h1" size="xl" textAlign="center">Results for: {election.title}</Heading>
      <Text fontSize="lg" my={4}>{election.description}</Text>
      {election.voteOptions.map(option => (
        <Box key={option.id} p={5} shadow="md" borderWidth="1px" borderRadius="md" overflow="hidden">
          <VStack spacing={3}>
            <Heading as="h3" size="md">{option.name}</Heading>
            <Text>{option.description}</Text>
            <Text fontWeight="bold">Votes: {option.votes}</Text>
          </VStack>
        </Box>
      ))}
    </VStack>
  </Container>
  );
};

export default ElectionResults;