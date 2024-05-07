import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/elections', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch elections');
        const data = await response.json();
        setElections(data);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };
  
    fetchElections();
  }, []);

  const handleVote = (electionId) => {
    navigate(`/vote-election/${electionId}`);
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <input
        type="text"
        placeholder="Search Elections"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul>
        {elections.filter(election => election.title.toLowerCase().includes(searchTerm.toLowerCase())).map(election => (
          <li key={election.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {election.title} - Starts: {new Date(election.startTime).toLocaleString()} - Ends: {new Date(election.endTime).toLocaleString()}
            {!election.hasVoted && <button onClick={() => handleVote(election.id)}>Vote</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;