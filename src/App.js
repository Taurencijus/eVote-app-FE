import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import AdminDashboard from './components/AdminDashboard';
import CreateElection from './components/CreateElection';
import EditElection from './components/EditElection';
import UserDashboard from './components/UserDashboard';
import VoteElection from './components/VoteElection';
import Navigation from './components/Navigation';
import AboutUs from './components/AboutUs';
import ElectionResults from './components/ElectionResults';
import './App.css';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          {user ? (
            <>
              <Route path="/login" element={<Navigate replace to="/home" />} />
              <Route path="/register" element={<Navigate replace to="/home" />} />
              <Route path="/admin-dashboard" element={user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate replace to="/home" />} />
              <Route path="/create-election" element={user.role === 'ADMIN' ? <CreateElection /> : <Navigate replace to="/home" />} />
              <Route path="/edit-election/:electionId" element={user.role === 'ADMIN' ? <EditElection /> : <Navigate replace to="/home" />} />
              <Route path="/user-dashboard" element={<UserDashboard />} /> 
              <Route path="/vote-election/:electionId" element={<VoteElection />} />
              <Route path="/election-results/:electionId" element={<ElectionResults />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/admin-dashboard" element={<Navigate replace to="/login" />} />
              <Route path="/create-election" element={<Navigate replace to="/login" />} />
              <Route path="/edit-election/:electionId" element={<Navigate replace to="/login" />} />
              <Route path="/user-dashboard" element={<Navigate replace to="/login" />} />
              <Route path="/vote-election/:electionId" element={<Navigate replace to="/login" />} />
            </>
          )}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;