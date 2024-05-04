import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();

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
    const response = await fetch('http://localhost:8080/admin_only/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    setCreateModalOpen(false);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Elections List</h2>
         <button onClick={handleCreateElection} style={{ padding: '10px', fontSize: '16px' }}>Create New Election</button>
    </div>
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>User List</h2>
            <button onClick={() => setCreateModalOpen(true)} style={{ padding: '10px', fontSize: '16px' }}>Create New User</button>
            {isCreateModalOpen && (
                <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSave={handleCreateUser}
                />
            )}
        </div>
        {users.length > 0 ? (
          <ul>
            {users.map(user => (
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
    </div>
  );
};

export default AdminDashboard;