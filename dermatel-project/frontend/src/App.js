import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
