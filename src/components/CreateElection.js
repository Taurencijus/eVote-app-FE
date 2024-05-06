import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const CreateElection = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [voteOptions, setVoteOptions] = useState([{ name: '', description: '' }]);
    const navigate = useNavigate();
  
    const isToday = (date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    };
  
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
    const electionData = { title, description, startTime, endTime };

    try {
        const electionResponse = await fetch('http://localhost:8080/admin_only/api/elections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(electionData)
        });

        if (!electionResponse.ok) {
            const errorData = await electionResponse.json();
            throw new Error(errorData.message || 'Failed to create election');
        }

        const election = await electionResponse.json();

        const voteOptionPromises = voteOptions.map((voteOption) =>
            fetch(`http://localhost:8080/admin_only/api/vote-options/by-election/${election.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: voteOption.name,
                    description: voteOption.description
                })
            })
        );

        const results = await Promise.all(voteOptionPromises);
        results.forEach(async (result, index) => {
            if (!result.ok) {
                const errorData = await result.json();
                throw new Error(errorData.message || `Failed to add vote option ${voteOptions[index].name}`);
            }
        });

        console.log('Election and all vote options created successfully!');
        navigate('/admin-dashboard');
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};



  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"></textarea>
      <DatePicker
        selected={startTime}
        onChange={date => setStartTime(date)}
        showTimeSelect
        timeIntervals={15}
        minDate={new Date()}
        minTime={isToday(startTime) ? new Date() : new Date().setHours(0, 0, 0, 0)}
        maxTime={new Date().setHours(23, 45, 0, 0)}
        dateFormat="MMMM d, yyyy h:mm aa"
      />
      <DatePicker
        selected={endTime}
        onChange={date => setEndTime(date)}
        showTimeSelect
        timeIntervals={15}
        minDate={startTime}
        minTime={isToday(endTime) ? new Date() : new Date().setHours(0, 0, 0, 0)}
        maxTime={new Date().setHours(23, 45, 0, 0)}
        dateFormat="MMMM d, yyyy h:mm aa"
      />
      {voteOptions.map((voteOption, index) => (
          <div key={index}>
            <input
              type="text"
              value={voteOption.name}
              onChange={e => handleVoteOptionChange(index, 'name', e.target.value)}
              placeholder="Vote Option Name"
            />
            <textarea
              value={voteOption.description}
              onChange={e => handleVoteOptionChange(index, 'description', e.target.value)}
              placeholder="Vote Option Description"
            />
            <button type="button" onClick={() => handleRemoveVoteOption(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddVoteOption}>Add Vote Option</button>
        <button type="submit">Create Election</button>
    </form>
  );
};

export default CreateElection;