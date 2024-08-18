import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/outline';


const Navbar = () => {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center bg-primary text-primary-foreground shadow-md animate-fade-in">
            <Link to="/" className="flex items-center space-x-2">
                <HomeIcon  className="h-8 w-8" />
                <span className="text-xl font-bold">Telemedicine App</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4 animate-hover">
                    Login
                </Link>
                <Link to="/register" className="text-sm font-medium hover:underline underline-offset-4 animate-hover">
                    Register
                </Link>
            </nav>
        </header>
    );
};

export default Navbar;
