import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VoteElection = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElectionAndOptions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const electionResponse = await fetch(`http://localhost:8080/api/elections/${electionId}`, { headers });
        if (!electionResponse.ok) throw new Error('Failed to fetch election details.');
        const electionData = await electionResponse.json();

        const voteOptionsResponse = await fetch(`http://localhost:8080/api/vote-options/by-election/${electionId}`, { headers });
        if (!voteOptionsResponse.ok) throw new Error('Failed to fetch vote options.');
        const voteOptionsData = await voteOptionsResponse.json();

        setElection({
          ...electionData,
          startTime: new Date(electionData.startTime),
          endTime: new Date(electionData.endTime),
          voteOptions: voteOptionsData
        });
      } catch (error) {
        console.error('Error fetching election and options:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionAndOptions();
  }, [electionId]);

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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit vote');
        }

        setVoteSubmitted(true);
        setError('');
        console.log('Vote submitted successfully!');
        navigate('/user-dashboard'); 
      } catch (error) {
        console.error('An error occurred:', error);
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
    <div>
      <h1>{election?.title}</h1>
      <p>{election?.description}</p>
      <div>
        {election?.voteOptions.map(option => (
          <div key={option.id} style={{ margin: '10px', padding: '10px', border: selectedOption === option.id ? '2px solid green' : '1px solid #ccc' }}>
            <h3>{option.name}</h3>
            <p>{option.description}</p>
            {voteSubmitted ? (
              <p>Vote submitted for this option!</p>
            ) : (
              <button onClick={() => handleSelectOption(option.id)}>Vote</button>
            )}
          </div>
        ))}
      </div>
      {selectedOption && !voteSubmitted && (
        <button onClick={handleSubmitVote} style={{ marginTop: '20px' }}>Submit Vote</button>
      )}
    </div>
  );
};

export default VoteElection;