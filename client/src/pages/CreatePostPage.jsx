// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './CreatePostPage.module.css';
// import axios from '../api/axiosConfig.js';
// import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT useAuth
// import toast from 'react-hot-toast';

// const CreatePostPage = () => {
//     const { user } = useAuth(); // <-- 2. GET THE LOGGED-IN USER
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         title: '',
//         quantity: '',
//         pickupLocation: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // --- 3. NEW useEffect TO PRE-FILL ADDRESS ---
//     useEffect(() => {
//         // When the component loads, check if we have a user with a verified address
//         if (user && user.verificationDetails?.businessAddress) {
//             setFormData(prevState => ({
//                 ...prevState,
//                 pickupLocation: user.verificationDetails.businessAddress
//             }));
//         }
//     }, [user]); // This effect runs whenever the user object is available

//     const { title, quantity, pickupLocation } = formData;

//     const onChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         try {
//             await axios.post('/posts', { title, quantity, pickupLocation });
//             toast.success('Food post created successfully!');
//             navigate('/dashboard/donor');
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to create post. Please try again.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className={styles.pageContainer}>
//             <div className={styles.formContainer}>
//                 <h2>Post New Food Availability</h2>
//                 {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                
//                 <form onSubmit={handleSubmit}>
//                     {/* ... (The Title and Quantity form groups remain unchanged) ... */}
//                     <div className={styles.formGroup}>
//                         <label htmlFor="title">Title</label>
//                         <input type="text" id="title" name="title" placeholder="e.g., 15 Large Pizzas" value={title} onChange={onChange} required />
//                     </div>
//                     <div className={styles.formGroup}>
//                         <label htmlFor="quantity">Quantity</label>
//                         <input type="text" id="quantity" name="quantity" placeholder="e.g., Feeds approximately 45 people" value={quantity} onChange={onChange} required />
//                     </div>

//                     <div className={styles.formGroup}>
//                         <label htmlFor="pickupLocation">Pickup Location</label>
//                         <textarea id="pickupLocation" name="pickupLocation" placeholder="Enter the full address for pickup" value={pickupLocation} onChange={onChange} required></textarea>
//                         <p className={styles.fieldHint}>Your default address is pre-filled. You can change it for this specific post if needed.</p>
//                     </div>

//                     {/* --- 4. NEW BUTTONS CONTAINER --- */}
//                     <div className={styles.buttonGroup}>
//                         <button type="button" className={styles.cancelButton} onClick={() => navigate('/dashboard/donor')}>
//                             Cancel
//                         </button>
//                         <button type="submit" className={styles.submitButton} disabled={loading}>
//                             {loading ? 'Posting...' : 'Post Food'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreatePostPage;



// client/src/pages/CreatePostPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePostPage.module.css';
import axios from '../api/axiosConfig.js';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // <-- IMPORTED

const CreatePostPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', quantity: '', pickupLocation: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.verificationDetails?.businessAddress) {
            setFormData(prevState => ({ ...prevState, pickupLocation: user.verificationDetails.businessAddress }));
        }
    }, [user]);

    const { title, quantity, pickupLocation } = formData;
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/posts', { title, quantity, pickupLocation });
            toast.success('Food post created successfully!'); // <-- REPLACED alert()
            navigate('/dashboard/donor');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create post.'); // <-- REPLACED alert()/setError()
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formContainer}>
                <h2>Post New Food Availability</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}><label htmlFor="title">Title</label><input type="text" id="title" name="title" placeholder="e.g., 15 Large Pizzas" value={title} onChange={onChange} required /></div>
                    <div className={styles.formGroup}><label htmlFor="quantity">Quantity</label><input type="text" id="quantity" name="quantity" placeholder="e.g., Feeds approximately 45 people" value={quantity} onChange={onChange} required /></div>
                    <div className={styles.formGroup}><label htmlFor="pickupLocation">Pickup Location</label><textarea id="pickupLocation" name="pickupLocation" placeholder="Enter the full address for pickup" value={pickupLocation} onChange={onChange} required></textarea><p className={styles.fieldHint}>Your default address is pre-filled.</p></div>
                    <div className={styles.buttonGroup}><button type="button" className={styles.cancelButton} onClick={() => navigate('/dashboard/donor')}>Cancel</button><button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Posting...' : 'Post Food'}</button></div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;