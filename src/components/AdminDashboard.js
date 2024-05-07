import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [elections, setElections] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [electionSearch, setElectionSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/elections', {
          headers: {
            'Authorization': `Bearer ${token}`
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/admin_only/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateElection = () => {
    navigate('/create-election');
  };

  const handleDeleteElection = async (electionId) => {
    try {
      const response = await fetch(`http://localhost:8080/admin_only/api/elections/${electionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to delete election');
      setElections(elections.filter(election => election.id !== electionId));
    } catch (error) {
      console.error('Error deleting election:', error);
    }
  };

  const handleEditElection = (electionId) => {
    navigate(`/edit-election/${electionId}`);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/admin_only/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const saveUser = async (userData) => {
    const response = await fetch(`http://localhost:8080/admin_only/api/users/${userData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }
    const updatedUser = await response.json();
    setUsers(users.map(user => user.id === userData.id ? updatedUser : user));
    closeModal();
  };

  const handleCreateUser = async (userData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/admin_only/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        }

        const newUser = await response.json();
        setUsers(users => [...users, newUser]);
        setCreateModalOpen(false);
        toast.success('User created successfully!');
    } catch (error) {
        console.error('Error creating user:', error);
        toast.error(`Registration failed: ${error}`);
    }
};

return (
  <div>
    <h1>Admin Dashboard</h1>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Elections List</h2>
      <input
        type="text"
        placeholder="Search Elections"
        value={electionSearch}
        onChange={e => setElectionSearch(e.target.value)}
      />
      <button onClick={handleCreateElection} style={{ padding: '10px', fontSize: '16px' }}>Create New Election</button>
    </div>
    {elections.filter(election => election.title.toLowerCase().includes(electionSearch.toLowerCase())).length > 0 ? (
      <ul>
        {elections.filter(election => election.title.toLowerCase().includes(electionSearch.toLowerCase())).map((election) => (
          <li key={election.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {election.title} - Starts: {new Date(election.startTime).toLocaleString()} - Ends: {new Date(election.endTime).toLocaleString()}
           <div>
            <button onClick={() => handleEditElection(election.id)}>Edit</button>
            <button onClick={() => handleDeleteElection(election.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No elections to display</p>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search Users"
        value={userSearch}
        onChange={e => setUserSearch(e.target.value)}
      />
      <button onClick={() => setCreateModalOpen(true)} style={{ padding: '10px', fontSize: '16px' }}>Create New User</button>
      {isCreateModalOpen && (
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateUser}
        />
      )}
    </div>
    {users.filter(user => user.username.toLowerCase().includes(userSearch.toLowerCase())).length > 0 ? (
      <ul>
        {users.filter(user => user.username.toLowerCase().includes(userSearch.toLowerCase())).map(user => (
          <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{user.username} - {user.email} - {user.type}</span>
            <div>
              <button onClick={() => openModal(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No users to display</p>
    )}
    {isModalOpen && selectedUser && (
      <EditUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
        onSave={saveUser}
      />
    )}
  </div>
)};

export default AdminDashboard;