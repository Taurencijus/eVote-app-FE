import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import EditUserModal from './components/EditUserModal';

function App() {
  return (
    <Router>
      <div>
      <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
          <Route path="/edit-user" element={<EditUserModal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;