import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to view your dashboard.");
      navigate('/login');
      return;
    }

    const fetchElections = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/elections', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setElections(data);
      } catch (error) {
        toast.error('Failed to fetch elections.');
      }
    };

    fetchElections();
  }, [user, navigate]);

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
        {elections
          .filter(election => election.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(election => (
            <li key={election.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {election.title} - Starts: {new Date(election.startTime).toLocaleString()} - Ends: {new Date(election.endTime).toLocaleString()}
              {!election.hasVoted && new Date(election.endTime) > new Date() && <button onClick={() => navigate(`/vote-election/${election.id}`)}>Vote</button>}
              {new Date(election.endTime) < new Date() && <button onClick={() => navigate(`/election-results/${election.id}`)}>View Results</button>}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserDashboard;