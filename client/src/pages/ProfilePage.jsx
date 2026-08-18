// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import styles from './ProfilePage.module.css';

// const DetailRow = ({ label, value }) => (
//     value ? (
//         <div className={styles.detailRow}>
//             <div className={styles.detailLabel}>{label}</div>
//             <div className={styles.detailValue}>{value}</div>
//         </div>
//     ) : null
// );

// const ProfilePage = () => {
//     const { user } = useAuth();

//     if (!user) {
//         return <div>Loading profile...</div>;
//     }

//     const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'long',
//     });
    
//     // This function generates the correct dashboard link based on user role
    // const getDashboardLink = () => {
    //     switch (user.role) {
    //         case 'DONOR': return '/dashboard/donor';
    //         case 'NGO': return '/dashboard/ngo';
    //         case 'VOLUNTEER': return '/dashboard';
    //         default: return '/';
    //     }
    // };

//     return (
//         <div className={styles.pageContainer}>
//             <div className={styles.profileCard}>
//                 <div className={styles.cardHeader}>
//                     <Link to={getDashboardLink()} className={styles.backButton}>
//                         &larr; Back to Dashboard
//                     </Link>
//                 </div>
                
//                 <div className={styles.profileHeader}>
//                     <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
//                     <div className={styles.headerText}>
//                         <h1 className={styles.userName}>{user.name}</h1>
//                         <p className={styles.userRole}>{user.role} &bull; Member since {memberSince}</p>
//                     </div>
//                     <span className={`${styles.statusBadge} ${user.status === 'Verified' ? styles.verified : ''}`}>
//                         {user.status}
//                     </span>
//                 </div>

//                 <div className={styles.detailsSection}>
//                     <h2 className={styles.sectionTitle}>Account Information</h2>
//                     <div className={styles.detailsGroup}>
//                         <DetailRow label="Full Name / Organization" value={user.name} />
//                         <DetailRow label="Email Address" value={user.email} />

//                         {/* --- Dynamically show verification details based on role --- */}
//                         {user.role === 'DONOR' && (
//                             <>
//                                 <DetailRow label="Business Address" value={user.verificationDetails?.businessAddress} />
//                                 <DetailRow label="Contact Phone" value={user.verificationDetails?.contactPhoneNumber} />
//                             </>
//                         )}
//                         {user.role === 'NGO' && (
//                             <>
//                                 <DetailRow label="Organization Address" value={user.verificationDetails?.organizationAddress} />
//                                 <DetailRow label="Registration ID" value={user.verificationDetails?.registrationId} />
//                             </>
//                         )}
//                         {user.role === 'VOLUNTEER' && (
//                             <>
//                                 <DetailRow label="Contact Phone" value={user.verificationDetails?.phoneNumber} />
//                                 <DetailRow label="Vehicle Details" value={user.verificationDetails?.vehicleDetails} />
//                             </>
//                         )}
//                     </div>
//                     {user.status === 'Pending' && (
//                         <div className={styles.verificationPrompt}>
//                             Your account is pending review. Details you submit on the verification page will appear here.
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;

// client/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react'; // <-- Import hooks
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosConfig'; // <-- Import axios
import styles from './ProfilePage.module.css';

const DetailRow = ({ label, value }) => (
    value ? (
        <div className={styles.detailRow}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>{value}</div>
        </div>
    ) : null
);

const ProfilePage = () => {
    // We still use useAuth for the basic user role and name, but fetch full details separately.
    const auth = useAuth();
    const [fullUser, setFullUser] = useState(null); // <-- State for the full user profile
    const [loading, setLoading] = useState(true);

    // --- THIS useEffect IS THE FIX ---
    useEffect(() => {
        const fetchFullProfile = async () => {
            try {
                const response = await axios.get('/auth/me'); // Call the updated endpoint
                setFullUser(response.data);
            } catch (error) {
                console.error("Failed to fetch full profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFullProfile();
    }, [auth.user]); // Empty array means this runs once when the page loads

    if (loading || !fullUser) {
        return <div className={styles.pageContainer}><div>Loading profile...</div></div>;
    }

    const memberSince = new Date(fullUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long',
    });
    
    const getDashboardLink = () => {
        switch (fullUser.role) {
            case 'DONOR': return '/dashboard/donor';
            case 'NGO': return '/dashboard/ngo';
            case 'VOLUNTEER': return '/dashboard';
            default: return '/';
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                    <Link to={getDashboardLink()} className={styles.backButton}>
                        &larr; Back to Dashboard
                    </Link>
                </div>
                
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>{fullUser.name.charAt(0).toUpperCase()}</div>
                    <div className={styles.headerText}>
                        <h1 className={styles.userName}>{fullUser.name}</h1>
                        <p className={styles.userRole}>{fullUser.role} &bull; Member since {memberSince}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${fullUser.status === 'Verified' ? styles.verified : ''}`}>
                        {fullUser.status}
                    </span>
                </div>

                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>Account Information</h2>
                    <div className={styles.detailsGroup}>
                        {/* --- NOW USE fullUser TO ACCESS ALL DETAILS --- */}
                        <DetailRow label="Full Name / Organization" value={fullUser.name} />
                        <DetailRow label="Email Address" value={fullUser.email} />

                        {fullUser.role === 'DONOR' && (
                            <>
                                <DetailRow label="Business Address" value={fullUser.verificationDetails?.businessAddress} />
                                <DetailRow label="Contact Phone" value={fullUser.verificationDetails?.contactPhoneNumber} />
                            </>
                        )}
                        {fullUser.role === 'NGO' && (
                            <>
                                <DetailRow label="Organization Address" value={fullUser.verificationDetails?.organizationAddress} />
                                <DetailRow label="Registration ID" value={fullUser.verificationDetails?.registrationId} />
                            </>
                        )}
                        {fullUser.role === 'VOLUNTEER' && (
                            <>
                                <DetailRow label="Contact Phone" value={fullUser.verificationDetails?.phoneNumber} />
                                <DetailRow label="Vehicle Details" value={fullUser.verificationDetails?.vehicleDetails} />
                            </>
                        )}
                    </div>
                    {fullUser.status === 'Pending' && (
                        <div className={styles.verificationPrompt}>
                            Your account is pending review. Details you submit on the verification page will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ProfilePage;