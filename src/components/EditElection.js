import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditElection = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    voteOptions: [{ name: '', description: '' }]
  });

  useEffect(() => {
    const fetchElectionAndOptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
  
        // Fetch election details
        const electionResponse = await fetch(`http://localhost:8080/api/elections/${electionId}`, { headers });
        if (!electionResponse.ok) throw new Error('Failed to fetch election details.');
        const electionData = await electionResponse.json();
  
        // Fetch vote options associated with the election
        const voteOptionsResponse = await fetch(`http://localhost:8080/api/vote-options/by-election/${electionId}`, { headers });
        if (!voteOptionsResponse.ok) throw new Error('Failed to fetch vote options.');
        const voteOptionsData = await voteOptionsResponse.json();
  
        // Setting the state with fetched data
        setElection({
          ...electionData,
          startTime: new Date(electionData.startTime),
          endTime: new Date(electionData.endTime),
          voteOptions: voteOptionsData.map(option => ({
            id: option.id,
            name: option.name,
            description: option.description
          }))
        });
  
      } catch (error) {
        console.error('Error fetching election and options:', error.message);
      }
    };
  
    fetchElectionAndOptions();
  }, [electionId]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'title' || name === 'description') {
      setElection(prev => ({ ...prev, [name]: value }));
    } else {
      const newVoteOptions = [...election.voteOptions];
      newVoteOptions[index] = { ...newVoteOptions[index], [name]: value };
      setElection(prev => ({ ...prev, voteOptions: newVoteOptions }));
    }
  };

  const handleDateChange = (name, date) => {
    setElection(prev => ({ ...prev, [name]: date }));
  };

  const handleAddVoteOption = () => {
    setElection(prev => ({
      ...prev,
      voteOptions: [...prev.voteOptions, { name: '', description: '' }]
    }));
  };

  const handleVoteOptionChange = (event, index, field) => {
    const updatedVoteOptions = election.voteOptions.map((option, idx) => {
        if (idx === index) {
            return { ...option, [field]: event.target.value };
        }
        return option;
    });
    setElection({...election, voteOptions: updatedVoteOptions});
};

  const handleRemoveVoteOption = index => {
    setElection(prev => ({
      ...prev,
      voteOptions: prev.voteOptions.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const electionData = {
      title: election.title,
      description: election.description,
      startTime: election.startTime.toISOString(),
      endTime: election.endTime.toISOString(),
      voteOptions: election.voteOptions.filter(option => option.id) // Only send existing options to update
    };
  
    try {
      // Update the election and existing vote options
      const electionResponse = await fetch(`http://localhost:8080/admin_only/api/elections/${electionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(electionData)
      });
  
      if (!electionResponse.ok) {
        const errorData = await electionResponse.json();
        throw new Error(errorData.message || 'Failed to update election');
      }
  
      // Handle new vote options creation
      const newVoteOptions = election.voteOptions.filter(option => !option.id);
      const createVoteOptionPromises = newVoteOptions.map(option =>
        fetch(`http://localhost:8080/admin_only/api/vote-options/by-election/${electionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name: option.name, description: option.description })
        })
      );
  
      const results = await Promise.all(createVoteOptionPromises);
      results.forEach(async (result, index) => {
        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(errorData.message || `Failed to create new vote option`);
        }
      });
  
      console.log('Election and all vote options updated successfully!');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={election.title} onChange={handleInputChange} placeholder="Title" />
      <textarea name="description" value={election.description} onChange={handleInputChange} placeholder="Description" />
      <DatePicker selected={election.startTime} onChange={date => handleDateChange('startTime', date)} />
      <DatePicker selected={election.endTime} onChange={date => handleDateChange('endTime', date)} />
      {election.voteOptions.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            value={option.name}
            onChange={e => handleVoteOptionChange(e, index, 'name')}
            placeholder="Vote Option Name"
          />
          <input
            type="text"
            name="description"
            value={option.description}
            onChange={e => handleVoteOptionChange(e, index, 'description')}
            placeholder="Vote Option Description"
          />
          <button type="button" onClick={() => handleRemoveVoteOption(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddVoteOption}>Add Vote Option</button>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditElection;