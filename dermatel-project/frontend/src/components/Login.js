import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Hospital, LogIn, Key, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
            const token = response.data.token;
            localStorage.setItem('authToken', token);

            const decodedToken = jwtDecode(token);
            const userRoles = decodedToken.roles;

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
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white shadow-md">
                <Link to="/" className="flex items-center space-x-2">
                    <Hospital className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-800">DERMATEL</span>
                </Link>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link
                        to="/register"
                        className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Register
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center items-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                        <div className="p-8 sm:p-10">
                            <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">Login to Your Account</h2>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    {success}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-blue-800 mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your username"
                                        />
                                        <LogIn className="h-5 w-5 text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-blue-800 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your password"
                                        />
                                        <Key className="h-5 w-5 text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-8 px-4 bg-white">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <p className="text-blue-600 mb-4 md:mb-0">&copy; 2024 DERMATEL. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors">Terms of Service</Link>
                        <Link to="/contact" className="text-blue-600 hover:text-blue-800 transition-colors">Contact Us</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;