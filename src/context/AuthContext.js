import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (response) => {
        const { token, role } = response;
        const decoded = jwtDecode(token);
        
        const newUser = {
            username: decoded.sub,
            role: role,
            token,
        };
        setUser(newUser);
        console.log('User set in context:', newUser);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);