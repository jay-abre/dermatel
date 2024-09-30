import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <Hospital className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-800">DERMATEL</span>
                </Link>
                <nav className="flex items-center gap-4 sm:gap-6">
                    <Link
                        to="/login"
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <LogIn className="h-4 w-4 mr-1" />
                        <span>Login</span>
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <UserPlus className="h-4 w-4 mr-1" />
                        <span>Register</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;