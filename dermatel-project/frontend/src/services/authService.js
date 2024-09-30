import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;

export const login = (username, password) => {
    return axios.post(`${API_URL}/login`, { username, password });
};

export const register = (user) => {
    return axios.post(`${API_URL}/register`, user);
};