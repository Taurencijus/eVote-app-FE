import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditUserModal = ({ isOpen, onClose, user: propUser, onSave }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      toast.error("Access Denied: Only admins can edit users.");
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (propUser && isOpen) {
      setUsername(propUser.username);
      setEmail(propUser.email);
      setType(propUser.type);
    }
  }, [propUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedUser = { id: propUser.id, username, email, type };
      const response = await fetch(`http://localhost:8080/admin_only/api/users/${propUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });
      onSave(await response.json());
      onClose(); 
    } catch (error) {
      toast.error('Failed to update user. Please try again later.');
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