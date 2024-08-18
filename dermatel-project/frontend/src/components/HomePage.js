import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center bg-primary text-primary-foreground shadow-md animate-fade-in">
                <Link to="/" className="flex items-center space-x-2">
                    <HospitalIcon className="h-8 w-8" />
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

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center bg-background animate-fade-in">
                <section className="w-full max-w-4xl py-16 md:py-24 lg:py-32 text-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-heading animate-fade-in">
                                Convenient Healthcare at Your Fingertips
                            </h1>
                            <p className="text-gray-600 md:text-xl animate-fade-in">
                                Connect with licensed healthcare providers anytime, anywhere through our secure telemedicine platform.
                            </p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex h-12 items-center justify-center rounded-md bg-primary text-primary-foreground px-8 text-sm font-medium shadow-md transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 animate-hover"
                            >
                                Book an Appointment
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t border-border bg-primary text-primary-foreground animate-fade-in">
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
}

function HospitalIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 6v4" />
            <path d="M14 14h-4" />
            <path d="M14 18h-4" />
            <path d="M14 8h-4" />
            <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
            <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
        </svg>
    );
}
