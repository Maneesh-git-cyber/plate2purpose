// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext.jsx';
// import axios from '../api/axiosConfig.js';
// import './VerificationPage.css';

// // --- STEP 1: Import all three specific form components ---
// import DonorVerificationForm from '../components/verification/DonorVerificationForm.jsx';
// import NGOVerificationForm from '../components/verification/NGOVerificationForm.jsx';
// import VolunteerVerificationForm from '../components/verification/VolunteerVerificationForm.jsx';

// const VerificationPage = () => {
//     const { user } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleSubmit = async (verificationData) => {
//         setLoading(true);
//         setError(null);
//         try {
//             await axios.post('/users/submit-verification', verificationData);
//             alert('Verification details submitted successfully! An admin will review your profile shortly.');
//             setLoading(false);
//             // In the future, we will redirect the user to their dashboard from here.
//             // For example: navigate('/dashboard');
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to submit verification.');
//             setLoading(false);
//         }
//     };

//     const renderVerificationForm = () => {
//         if (!user) {
//             return <p>Loading user information...</p>;
//         }

//         switch (user.role) {
//             case 'DONOR':
//                 return <DonorVerificationForm onSubmit={handleSubmit} loading={loading} />;
//             case 'NGO':
//                 return <NGOVerificationForm onSubmit={handleSubmit} loading={loading} />;
            
//             // --- STEP 2: Render the Volunteer component instead of the placeholder ---
//             case 'VOLUNTEER':
//                 return <VolunteerVerificationForm onSubmit={handleSubmit} loading={loading} />;
                
//             default:
//                 return <p>Invalid user role. Please contact support.</p>;
//         }
//     };

//     return (
//         <div className="verification-container">
//             <div className="verification-box">
//                 <h2>Account Verification</h2>
//                 <p>Welcome, {user?.name}! Your account is currently pending. Please provide the following details to get verified.</p>
//                 <hr />
//                 {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
//                 {renderVerificationForm()}
//             </div>
//         </div>
//     );
// };

// export default VerificationPage;


// client/src/pages/VerificationPage.jsx

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate
// import { useAuth } from '../context/AuthContext.jsx';
// import axios from '../api/axiosConfig.js';
// import styles from './VerificationPage.module.css'; // <-- 2. IMPORT THE NEW CSS MODULE
// import toast from 'react-hot-toast';

// // Import all three specific form components
// import DonorVerificationForm from '../components/verification/DonorVerificationForm.jsx';
// import NGOVerificationForm from '../components/verification/NGOVerificationForm.jsx';
// import VolunteerVerificationForm from '../components/verification/VolunteerVerificationForm.jsx';

// const VerificationPage = () => {
//     const { user } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate(); // <-- 3. INITIALIZE useNavigate

//     const handleSubmit = async (verificationData) => {
//         setLoading(true);
//         setError(null);
//         try {
//             await axios.post('/users/submit-verification', verificationData);
//             toast.success('Verification details submitted successfully! An admin will review your profile shortly. Please log in to continue.');
            
//             // --- 4. THE FIX: REDIRECT THE USER ---
//             navigate('/login');

//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to submit verification.');
//             setLoading(false);
//         }
//     };

//     const renderVerificationForm = () => {
//         if (!user) {
//             return <p>Loading user information...</p>;
//         }

//         // We will pass the styles down to the child forms
//         const formProps = {
//             onSubmit: handleSubmit,
//             loading: loading,
//             styles: styles 
//         };

//         switch (user.role) {
//             case 'DONOR':
//                 return <DonorVerificationForm {...formProps} />;
//             case 'NGO':
//                 return <NGOVerificationForm {...formProps} />;
//             case 'VOLUNTEER':
//                 return <VolunteerVerificationForm {...formProps} />;
//             default:
//                 return <p>Invalid user role. Please contact support.</p>;
//         }
//     };

//     return (
//         <div className={styles.pageContainer}>
//             <div className={styles.verificationBox}>
//                 <h2>Account Verification</h2>
//                 <p>
//                     Welcome, <strong>{user?.name}</strong>! Your account is currently pending. Please provide the following details to get verified by our team.
//                 </p>
//                 <hr />
//                 {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
//                 {renderVerificationForm()}
//             </div>
//         </div>
//     );
// };

// export default VerificationPage;


// client/src/pages/VerificationPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from '../api/axiosConfig.js';
import styles from './VerificationPage.module.css';
import toast from 'react-hot-toast'; // <-- IMPORTED

import DonorVerificationForm from '../components/verification/DonorVerificationForm.jsx';
import NGOVerificationForm from '../components/verification/NGOVerificationForm.jsx';
import VolunteerVerificationForm from '../components/verification/VolunteerVerificationForm.jsx';

const VerificationPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (verificationData) => {
        setLoading(true);
        try {
            await axios.post('/users/submit-verification', verificationData);
            toast.success('Details submitted! Please log in to continue.'); // <-- REPLACED alert()
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to submit verification.';
            toast.error(errorMessage); // <-- REPLACED setError() logic
            setLoading(false);
        }
    };

    const renderVerificationForm = () => {
        if (!user) return <p>Loading user information...</p>;
        const formProps = { onSubmit: handleSubmit, loading: loading, styles: styles };
        switch (user.role) {
            case 'DONOR': return <DonorVerificationForm {...formProps} />;
            case 'NGO': return <NGOVerificationForm {...formProps} />;
            case 'VOLUNTEER': return <VolunteerVerificationForm {...formProps} />;
            default: return <p>Invalid user role. Please contact support.</p>;
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.verificationBox}>
                <h2>Account Verification</h2>
                <p>
                    Welcome, <strong>{user?.name}</strong>! Your account is currently pending. Please provide the following details to get verified by our team.
                </p>
                <hr />
                {renderVerificationForm()}
            </div>
        </div>
    );
};

export default VerificationPage;