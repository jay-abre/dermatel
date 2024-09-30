import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function KycProfile() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        dateOfBirth: '',
        document: null
    });
    const [fileName, setFileName] = useState('No file chosen');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isProfileExists, setIsProfileExists] = useState(false);
    const [isEditable, setIsEditable] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/me/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setFormData({
                        name: response.data.fullName,
                        address: response.data.address,
                        phoneNumber: response.data.phoneNumber,
                        dateOfBirth: response.data.dateOfBirth,
                        document: response.data.document
                    });
                    setFileName('Document uploaded');
                    setIsProfileExists(true);
                }
            } catch (error) {
                setError('Failed to fetch profile. Please try again.');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prevState => ({
            ...prevState,
            document: file
        }));
        setFileName(file ? file.name : 'No file chosen');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formDataToSend = new FormData();
        formDataToSend.append('fullName', formData.name);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);

        if (formData.document) {
            formDataToSend.append('document', formData.document);
        }

        const url = isProfileExists ? 'http://localhost:8080/api/me/profile/update' : 'http://localhost:8080/api/me/profile/create';

        try {
            const response = await axios.post(url, formDataToSend, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });

            setSuccess(true);
            setIsEditable(false);
            console.log('Form submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Failed to submit user information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = () => {
        setIsEditable(true);
    };

    const handleCancelClick = () => {
        setIsEditable(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {success && <div className="text-green-500 text-center mb-4">KYC information submitted successfully!</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        readOnly={!isEditable}
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        readOnly={!isEditable}
                        rows="4"
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        readOnly={!isEditable}
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        readOnly={!isEditable}
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="document" className="block text-sm font-medium text-gray-700">Upload Document</label>
                    <input
                        id="document"
                        name="document"
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-2 text-sm text-gray-500">{fileName}</p>
                </div>
                {isEditable && (
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="w-1/2 mr-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                        {isProfileExists && (
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="w-1/2 ml-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </form>
            {isProfileExists && !isEditable && (
                <button
                    onClick={handleUpdateClick}
                    className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Update
                </button>
            )}
        </div>
    );
}