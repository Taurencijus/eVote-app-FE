import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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