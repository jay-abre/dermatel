# DERMATEL: An Integrated Web-Based Telemedicine System

## Project Overview

DERMATEL is an integrated telemedicine system designed to provide personalized eczema classification and management. The system allows patients to schedule appointments, have video consultations with dermatologists, upload eczema images for classification, and receive personalized treatment plans.

## Project Structure

The project is built using a **Spring Boot** backend and a **React** frontend. It follows a microservices architecture to ensure scalability and maintainability.

### Key Components

- **Frontend**: React SPA
- **Backend**: Spring Boot REST API
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Image Processing**: Roboflow API for eczema classification

### Core Features

- **User Management**: Patient and dermatologist registration and authentication
- **Appointment Scheduling**: Allows patients to book appointments with dermatologists
- **Video Consultations**: Enables video calls between patients and dermatologists
- **Eczema Image Upload and Classification**: Patients can upload images for automated eczema classification
- **Personalized Treatment Plans**: Dermatologists can provide custom treatment plans based on classification results
- **Secure Messaging**: Facilitates communication between patients and dermatologists
