import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import DermatologistDashboard from "./components/DermatologistDashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/dermatologist-dashboard/*" element={<PrivateRoute><DermatologistDashboard /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;