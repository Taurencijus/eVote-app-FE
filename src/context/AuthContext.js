import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
    }, []);

    const login = (response) => {
        const { token, role } = response;
        const decoded = jwtDecode(token);
        
        const newUser = {
            username: decoded.sub,
            role,
            token,
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        console.log('User set in context:', newUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);