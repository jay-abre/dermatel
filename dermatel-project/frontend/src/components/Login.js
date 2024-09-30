import React, {useState} from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import {Link, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate input
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });
            setSuccess('Login successful!');
            // Save the auth token
            const token = response.data.token;
            localStorage.setItem('authToken', token);

            // Decode the token to get the user role
            const decodedToken = jwtDecode(token);
            const userRoles = decodedToken.roles;

            // Redirect based on user role
            if (userRoles.includes('ROLE_DERMATOLOGIST')) {
                navigate('/dermatologist-dashboard');
            } else if (userRoles.includes('ROLE_PATIENT')) {
                navigate('/dashboard');
            } else if (userRoles.includes('ROLE_ADMIN')) {
                navigate('/admin-dashboard');
            } else {
                setError('Invalid user role');
            }
        } catch (error) {
            setError('Login failed: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar/> {/* Include the Navbar component */}
            <div className="flex-grow flex justify-center items-center p-6">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Login to Your Account</h2>
                    {error && <div
                        className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
                    {success && <div
                        className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="username"
                                   className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password"
                                   className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
            {/* Footer */}
            <footer
                className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t border-border bg-primary text-primary-foreground animate-fade-in">
                <p className="text-xs">&copy; 2024 Telemedicine App. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link to="/terms" className="text-xs hover:underline underline-offset-4 animate-hover">
                        Terms of Service
                    </Link>
                    <Link to="/privacy" className="text-xs hover:underline underline-offset-4 animate-hover">
                        Privacy Policy
                    </Link>
                    <Link to="/contact" className="text-xs hover:underline underline-offset-4 animate-hover">
                        Contact Us
                    </Link>
                </nav>
            </footer>
        </div>
    );
};

export default Login;