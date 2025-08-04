// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, navigate }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // Initial state is true

    // Log the current loading state every time it changes
    useEffect(() => {
        console.log('AuthProvider loading state changed:', loading);
    }, [loading]);

    const checkAuthStatus = async () => {
        console.log('--- Starting Auth Status Check ---');
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await api.get('me/');
                setUser(response.data.user);
                setIsAuthenticated(true);
                setIsAdmin(response.data.is_gym_admin);
            } catch (error) {
                console.error('Auth Check Failed. Removing token:', error);
                localStorage.removeItem('authToken');
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
        } else {
            console.log('No token found in localStorage.');
        }
        setLoading(false); // This should always run and set loading to false
        console.log('--- Auth Status Check Complete. Loading is now false ---');
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            const response = await api.post('token/', { username, password });
            const authToken = response.data.token;
            localStorage.setItem('authToken', authToken);

            const userProfileResponse = await api.get('me/');
            setUser(userProfileResponse.data.user);
            setIsAuthenticated(true);
            setIsAdmin(userProfileResponse.data.is_gym_admin);
            setLoading(false);
            navigate('/dashboard');
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Login failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            setLoading(true);
            const response = await api.post('register/', { username, email, password });
            console.log('Registration successful:', response.data);
            setLoading(false);
            navigate('/login');
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        navigate('/login');
    };

    const authContextValue = {
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {/* The children (the rest of the app) are only rendered when loading is false */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);