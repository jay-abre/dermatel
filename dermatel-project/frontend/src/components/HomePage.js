import React from 'react'
import { Link } from 'react-router-dom'
import { Hospital, Calendar, Video, MessageSquare, Camera, CreditCard, LogIn } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
                <Link to="/" className="flex items-center space-x-2">
                    <Hospital className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">DERMATEL</span>
                </Link>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link
                        to="/login"
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <LogIn className="h-4 w-4 mr-1" />
                        <span>Login</span>
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Register
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
                            Healthcare at Your Fingertips
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with licensed healthcare providers anytime, anywhere through our secure telemedicine platform.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-md hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Book an Appointment
                        </Link>
                    </section>

                    {/* Features Section */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">Our Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Calendar, title: "Easy Scheduling", description: "Book appointments with just a few clicks" },
                                { icon: Video, title: "Video Consultations", description: "Face-to-face consultations from the comfort of your home" },
                                { icon: MessageSquare, title: "Secure Messaging", description: "Communicate safely with your healthcare provider" },
                                { icon: Camera, title: "Eczema Detection", description: "AI-powered eczema detection from your photos" },
                                { icon: CreditCard, title: "Secure Payment", description: "Safe and encrypted payment processing" },
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                                    <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 px-4 text-center text-sm text-gray-600 bg-white">
                <p>&copy; 2024 Telemedicine App. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                    <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                    <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
                </div>
            </footer>
        </div>
    )
}