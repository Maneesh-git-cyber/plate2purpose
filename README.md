# Surplus Food Redistribution and Donation Platform

This is the official repository for our MERN stack project aimed at reducing food waste by connecting donors with NGOs.

## Project Setup Instructions

Follow these steps carefully to get the project running on your local machine.

### 1. Prerequisites

Make sure you have the following software installed:
- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (Recommended)

### 2. Getting the Code

First, clone the repository to your machine:

`git clone https://github.com/your-username/your-repo-name.git`
`cd surplus-food-platform`

### 3. Backend Setup

The backend server runs on Node.js and connects to our shared database.

1.  Navigate to the server directory: `cd server`
2.  Install all required packages: `npm install`
3.  **IMPORTANT: Configure Environment Variables**
    - Create a copy of the `.env.example` file and name it `.env`.
    - Open the new `.env` file.
    - **Ask the team leader for the `MONGO_URI` connection string and paste it as the value for `MONGO_URI`.**
4.  Start the backend server: `npm run dev`

The server should now be running at `http://localhost:5001`.

### 4. Frontend Setup

The frontend is a React application.

1.  Open a **new terminal window**.
2.  Navigate to the client directory from the project root: `cd client`
3.  Install all required packages: `npm install`
4.  Start the frontend application: `npm start`

Your browser should automatically open to `http://localhost:3000`. You are now ready to code!