import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    
            setElection({
                ...electionData,
                startTime: new Date(electionData.startTime),
                endTime: new Date(electionData.endTime),
                voteOptions: updatedVoteOptions
            });
                setIsLoading(false);

        } catch (error) {
            toast.error('Failed to load results. Please try again later.')
            setError('Failed to load results');
        } 
    };

    fetchData();
  }, [electionId]);

  if (isLoading) return <div>Loading results...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!election) return <div>No election data available.</div>;

  return (
    <div>
      <h1>Results for: {election.title}</h1>
      <p>{election.description}</p>
      {election.voteOptions.map(option => (
        <div key={option.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>{option.name}</h3>
          <p>{option.description}</p>
          <p>Votes: {option.votes}</p>
        </div>
      ))}
    </div>
  );
};

export default ElectionResults;