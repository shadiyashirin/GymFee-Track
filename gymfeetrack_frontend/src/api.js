
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', 
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Token ${token}`; // Attach token to Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // If 401 Unauthorized, token might be expired or invalid
            localStorage.removeItem('authToken'); // Clear invalid token
            // Optionally, redirect to login page
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default api;