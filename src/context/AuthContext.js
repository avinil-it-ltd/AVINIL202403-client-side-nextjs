'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
