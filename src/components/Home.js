import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to the eVote Platform</h1>
      <p>Join us and make your vote count!</p>
      
      {!user && (
        <div className="cards">
          <div className="card">
            <p>Already registered? Log in to check out and participate in the latest elections and polls. Your voice matters!</p>
            <Link to="/login" className="big-button">Login</Link>
          </div>
          <div className="card">
            <p>New to eVote? Register now and join a growing community of proactive citizens. Start voting today!</p>
            <Link to="/register" className="big-button">Register</Link>
          </div>
        </div>
      )}

      <div className="card">
        <p>Want to know more about how eVote empowers every voice? Learn more about what we do and why we do it.</p>
        <Link to="/about-us" className="big-button">About Us</Link>
      </div>
    </div>
  );
}

export default Home;