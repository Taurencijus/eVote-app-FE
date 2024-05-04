import React, { useState, useEffect } from 'react';

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setUsername(user.username);
      setEmail(user.email);
      setType(user.type);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedUser = { id: user.id, username, email, type };
      const response = await fetch(`http://localhost:8080/admin_only/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      onSave(await response.json());
      onClose(); 
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="type">User Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;