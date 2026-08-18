// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 1. IMPORT YOUR NEW HOMEPAGE
import HomePage from './pages/HomePage.jsx'; 

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import VerificationPage from './pages/VerificationPage.jsx';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard.js';
import DonorDashboard from './components/donor/DonorDashboard.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import NGODashboard from './components/ngo/NGODashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" // You can change the position
        reverseOrder={false}
      />
      <Routes>
        
        {/* 2. CHANGE THE ROOT ROUTE TO SHOW THE HOMEPAGE */}
        <Route path="/" element={<HomePage />} />
        
        {/* All other routes remain the same */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-account" element={<VerificationPage />} />
        <Route path="/dashboard" element={<VolunteerDashboard />} />
        <Route path="/dashboard/donor" element={<DonorDashboard />} />
        <Route path="/dashboard/ngo" element={<NGODashboard />} />
        <Route path="/posts/new" element={<CreatePostPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </Router>
  );
}

export default App;