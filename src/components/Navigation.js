import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                {!user && <li><Link to="/login">Login</Link></li>}
                {!user && <li><Link to="/register">Register</Link></li>}
                {user && (
                    <>
                        <li><Link to={user.role === 'ADMIN' ? "/admin-dashboard" : "/user-dashboard"}>Dashboard</Link></li>
                        <li><Link to="/about-us">About eVote</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
                
            </ul>
        </nav>
    );
};

export default Navigation;