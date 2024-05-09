import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Container, VStack, FormControl, FormLabel, Input, Textarea, Button, Box
} from '@chakra-ui/react';

const CreateElection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            toast.error("Access Denied: Only admins can create elections.");
            navigate('/');
        }
    }, [user, navigate]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [voteOptions, setVoteOptions] = useState([{ name: '', description: '' }]);

    const handleAddVoteOption = () => {
        setVoteOptions([...voteOptions, { name: '', description: '' }]);
    };

    const handleRemoveVoteOption = index => {
        setVoteOptions(voteOptions.filter((_, i) => i !== index));
    };

    const handleVoteOptionChange = (index, field, value) => {
        const newVoteOptions = voteOptions.map((voteOption, idx) => {
            if (idx === index) {
                return { ...voteOption, [field]: value };
            }
            return voteOption;
        });
        setVoteOptions(newVoteOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const electionData = { title, description, startTime, endTime, voteOptions };

        try {
            const response = await fetch('http://localhost:8080/admin_only/api/elections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(electionData)
            });
            const election = await response.json();
            if (!response.ok) throw new Error('Failed to create election');

            const voteOptionPromises = voteOptions.map((voteOption) =>
              fetch(`http://localhost:8080/admin_only/api/vote-options/by-election/${election.id}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({ name: voteOption.name, description: voteOption.description })
              })
          );

          const results = await Promise.all(voteOptionPromises);
          results.forEach(async (result, index) => {
              if (!result.ok) throw new Error('Failed to create elections');
          });

            toast.success('Election created successfully!');
            navigate('/admin-dashboard');
        } catch (error) {
            toast.error('Failed to create election. Please try again later.');
        }
    };

    return (
      <Container maxW="container.md" p={5}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input placeholder="Enter election title" value={title} onChange={e => setTitle(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Enter election description" value={description} onChange={e => setDescription(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Start Time</FormLabel>
              <DatePicker
                selected={startTime}
                onChange={setStartTime}
                showTimeSelect
                timeIntervals={15}
                minDate={new Date()}
                minTime={new Date()}
                maxTime={new Date().setHours(23, 45)}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="react-datepicker"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>End Time</FormLabel>
              <DatePicker
                selected={endTime}
                onChange={setEndTime}
                showTimeSelect
                timeIntervals={15}
                minDate={startTime}
                minTime={new Date()}
                maxTime={new Date().setHours(23, 45)}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="react-datepicker"
              />
            </FormControl>
            {voteOptions.map((voteOption, index) => (
              <Box key={index} w="full" p={5} shadow="md" borderWidth="1px" borderRadius="md" overflow="hidden">
                <FormControl isRequired>
                  <FormLabel>Vote Option Name</FormLabel>
                  <Input
                    type="text"
                    value={voteOption.name}
                    onChange={e => handleVoteOptionChange(index, 'name', e.target.value)}
                    placeholder="Enter name of the vote option"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Vote Option Description</FormLabel>
                  <Textarea
                    value={voteOption.description}
                    onChange={e => handleVoteOptionChange(index, 'description', e.target.value)}
                    placeholder="Enter description of the vote option"
                  />
                </FormControl>
                <Button mt={2} colorScheme="red" onClick={() => handleRemoveVoteOption(index)}>Remove Vote Option</Button>
              </Box>
            ))}
            <Button mt={4} colorScheme="blue" onClick={handleAddVoteOption}>Add Vote Option</Button>
            <Button mt={4} colorScheme="green" type="submit">Create Election</Button>
          </VStack>
        </form>
      </Container>
    );
};

export default CreateElection;