import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import CreateElection from './components/CreateElection';
import EditElection from './components/EditElection';

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
          <Route path="/create-election" element={<CreateElection />} />
          <Route path="/edit-election" element={<EditElection />} />
          <Route path="/edit-election/:electionId" element={<EditElection />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;