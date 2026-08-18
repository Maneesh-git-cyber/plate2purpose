# Plate2Purpose 🍽️

> **Connecting surplus food with people who need it.**

Plate2Purpose is a MERN-stack food redistribution platform designed to reduce food waste by connecting **food donors, NGOs, and volunteers** through a single web application.

The platform allows donors to post surplus food, NGOs to discover and claim available food, and volunteers to coordinate deliveries when transportation assistance is required.

## 🌱 Problem Statement

Large quantities of edible food are wasted every day while many people and communities face food insecurity. A major challenge is coordinating the different parties involved in food redistribution.

**Plate2Purpose** addresses this problem by providing a centralized platform where:

- 🍱 **Donors** can list surplus food for redistribution.
- 🤝 **NGOs** can browse and claim available food.
- 🚚 **Volunteers** can accept and complete delivery jobs.
- ✅ Users can submit verification details to improve trust and accountability.

## ✨ Features

### 👤 Role-Based Users

Plate2Purpose supports multiple user roles:

- **Donor**
  - Create surplus-food posts
  - View previously created donations
  - Submit verification information

- **NGO**
  - Browse available food donations
  - Claim food donations
  - Choose between self-pickup and requesting a volunteer driver
  - View claimed donations
  - Track impact/statistics

- **Volunteer**
  - View available delivery jobs
  - Accept delivery assignments
  - Track active deliveries
  - Update delivery status
  - View volunteer statistics

### 🔐 Authentication & Authorization

- User registration and login
- Password hashing using `bcryptjs`
- JWT-based authentication
- Protected API routes
- Role-based access control
- Persistent authentication state on the frontend

### 🍲 Food Donation Management

- Create food donation posts
- Specify food quantity and pickup location
- Track donation status
- NGO claim workflow
- Automatic creation of delivery jobs when a volunteer driver is requested

### 🚚 Delivery Management

Delivery jobs move through the following states:

`Pending → Accepted → In-Progress → Completed`

Volunteers can:

- Browse available delivery jobs
- Accept a delivery
- View donor and NGO information
- Update delivery status
- Complete deliveries
- View delivery-related statistics

### 🛡️ Verification

Users can submit role-specific verification information such as:

- Business details
- Organization details
- Contact information
- Registration/license information
- Vehicle details
- Identification/proof documents

## 🏗️ Tech Stack

### Frontend

- React 18
- React Router
- Axios
- React Hot Toast
- Tailwind CSS
- CSS Modules

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Development Tools

- Git & GitHub
- VS Code
- Nodemon
- MongoDB Atlas

## 📁 Project Structure

```text
Plate2Purpose/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       │   ├── donor/
│       │   ├── ngo/
│       │   ├── volunteer/
│       │   ├── verification/
│       │   └── specific/
│       ├── context/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
│
├── .gitignore
└── README.md
```

## 🔄 Application Workflow

```text
Donor
  │
  │ Creates surplus-food post
  ▼
Available Food
  │
  │ NGO claims donation
  ▼
NGO
  │
  ├── Self Pickup
  │
  └── Request Driver
          │
          ▼
      Delivery Job
          │
          ▼
       Volunteer
          │
          ├── Accept
          ├── In-Progress
          └── Completed
```

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (LTS recommended)
- Git
- MongoDB / MongoDB Atlas
- VS Code (recommended)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Plate2Purpose
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> Never commit your `.env` file or database credentials to GitHub.

Start the backend:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5001
```

### 3. Configure the Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

## 🔌 API Overview

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Food Posts

```text
POST /api/posts
GET  /api/posts/me/donations
GET  /api/posts/available
PUT  /api/posts/claim/:id
GET  /api/posts/me/claims
```

### Deliveries

```text
GET /api/deliveries/available
GET /api/deliveries/active
GET /api/deliveries/volunteer/stats
PUT /api/deliveries/:id/accept
PUT /api/deliveries/:id/status
```

### Users

```text
POST /api/users/submit-verification
```

## 🗄️ Database Models

The backend currently uses three primary MongoDB models:

### User

Stores:

- Name
- Email
- Hashed password
- Role
- Verification status
- Verification details

### FoodPost

Stores:

- Food title
- Quantity
- Pickup location
- Donation status
- Donor
- Claiming NGO

### Delivery

Stores:

- Delivery status
- Food post
- Donor
- NGO
- Assigned volunteer
- Timestamps

## 🔒 Security

The project includes several basic security mechanisms:

- Passwords are hashed before being stored.
- JWT tokens are used for authenticated sessions.
- Protected routes require authentication.
- Role-based middleware restricts access to role-specific operations.
- Environment variables are used for database credentials and JWT secrets.

## 🚀 Future Improvements

Potential improvements include:

- Real-time notifications
- Admin verification dashboard
- Google Maps integration for route tracking
- Real-time delivery tracking
- Push notifications
- Image upload for food donations
- Automated food-expiry reminders
- Advanced analytics and impact reports
- Improved document verification
- Deployment using services such as Render, Railway, Vercel, or AWS

## 🎯 Project Goal

Plate2Purpose aims to make surplus-food redistribution **simple, transparent, and coordinated** by bringing donors, NGOs, and volunteers together on one platform.

---

**Built with the MERN stack ❤️ to reduce food waste and increase community impact.**
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
