import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
                role
            });
            // Handle successful registration (redirect to login or show success message)
        } catch (error) {
            console.error("Registration error:", error);
            // Handle registration error (show message to user)
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select role</option>
                        <option value="ROLE_PATIENT">Patient</option>
                        <option value="ROLE_DERMATOLOGIST">Dermatologist</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
