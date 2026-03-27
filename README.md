🛡️ GuardianAI

AI-Powered Surveillance System

> Team Members
Ashwin Poojary
Shruti Dhumane
Arpita Divate 
Tanishka Dhobale

> Problem Statement
Missing person cases are often reported across multiple platforms such as police records, social media, and NGOs.
There is no unified digital system that allows easy case registration, centralized storage, and intelligent identification support.

This leads to:
Delayed responses
Loss of critical information
Poor coordination between organizations
Manual and inefficient identification processes

> Solution Approach

GuardianAI provides a centralized web platform where:
  Users can register missing person cases
  Images and details are securely stored in a database
  AI-based face similarity matching can assist in identifying individuals (prototype stage)
  Authorities and organizations can access structured data
  The system can scale to support real-time alerts and integrations
  The goal is to use modern web technologies + AI to improve response time and coordination.

> Tech Stack

Frontend
  React (Vite)
  TypeScript
  Tailwind CSS

Backend
  Node.js
  Express.js
  MongoDB (Atlas)
  Multer (Image Uploads)

Tools
  Postman
  Git & GitHub

> Installation Steps
1️. Clone the Repository
    git clone https://github.com/your-username/guardian-ai.git
    cd guardian-ai

2️. Backend Setup
    cd backend
    npm install

Create a .env file inside backend/:
    MONGO_URI=your_mongodb_atlas_connection_string
    PORT=5000

3️. Frontend Setup
    cd frontend
    npm install

How to Run
    Start Backend
    cd backend
    npm run dev

Backend runs at:

http://localhost:5000
Start Frontend
cd frontend
npm run dev

Frontend runs at:

http://localhost:5173
Features
Register missing person cases
Upload photos
Store case data in MongoDB
Centralized case management
REST API integration
Fast UI with React + Vite
AI matching (prototype / future integration)

Future Scope
Real AI-based face recognition
Admin verification system
Mobile app version
Live CCTV integration
Public search portal
Geo-location based alerts
Integration with law enforcement databases
Multi-language support
