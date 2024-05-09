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
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  const { user } = useAuth();

  return (
    <ChakraProvider>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate replace to={user.role === 'ADMIN' ? "/admin-dashboard" : "/user-dashboard"} />} />
            <Route path="/register" element={!user ? <Registration /> : <Navigate replace to={user.role === 'ADMIN' ? "/admin-dashboard" : "/user-dashboard"} />} />
            <Route path="/admin-dashboard" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate replace to="/login" />} />
            <Route path="/create-election" element={user?.role === 'ADMIN' ? <CreateElection /> : <Navigate replace to="/login" />} />
            <Route path="/edit-election/:electionId" element={user?.role === 'ADMIN' ? <EditElection /> : <Navigate replace to="/login" />} />
            <Route path="/user-dashboard" element={user ? <UserDashboard /> : <Navigate replace to="/login" />} />
            <Route path="/vote-election/:electionId" element={user ? <VoteElection /> : <Navigate replace to="/login" />} />
            <Route path="/election-results/:electionId" element={user ? <ElectionResults /> : <Navigate replace to="/login" />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;