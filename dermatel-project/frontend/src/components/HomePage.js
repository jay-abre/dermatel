import React from 'react'
import { Link } from 'react-router-dom'
import { Hospital, Calendar, Video, MessageSquare, Camera, CreditCard, LogIn, ChevronRight } from 'lucide-react'

export default function HomePage() {
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
                        to="/login"
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <LogIn className="h-4 w-4 mr-1" />
                        <span>Login</span>
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Register
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-16 px-4">
                <div className="max-w-5xl mx-auto space-y-16">
                    <section className="text-center space-y-6">
                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-blue-900">
                            Healthcare at Your Fingertips
                        </h1>
                        <p className="text-xl text-blue-700 max-w-2xl mx-auto">
                            Connect with licensed healthcare providers anytime, anywhere through our secure telemedicine platform.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium text-lg rounded-full hover:bg-blue-700 transition-colors shadow-lg group"
                        >
                            Book an Appointment
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </section>

                    {/* Features Section */}
                    <section className="mt-20">
                        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Our Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: Calendar, title: "Easy Scheduling", description: "Book appointments with just a few clicks", color: "bg-green-100 text-green-600" },
                                { icon: Video, title: "Video Consultations", description: "Face-to-face consultations from the comfort of your home", color: "bg-purple-100 text-purple-600" },
                                { icon: MessageSquare, title: "Secure Messaging", description: "Communicate safely with your healthcare provider", color: "bg-yellow-100 text-yellow-600" },
                                { icon: Camera, title: "Eczema Detection", description: "AI-powered eczema detection from your photos", color: "bg-red-100 text-red-600" },
                                { icon: CreditCard, title: "Secure Payment", description: "Safe and encrypted payment processing", color: "bg-blue-100 text-blue-600" },
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105">
                                    <div className={`rounded-full p-4 ${feature.color} mb-6`}>
                                        <feature.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-blue-800">{feature.title}</h3>
                                    <p className="text-blue-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
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
    )
}