import React, { useState } from 'react';

const CreateUserModal = ({ isOpen, onClose, onSave }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('USER');

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSave({ username, password, email, type });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <label>Type:</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit">Create User</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;