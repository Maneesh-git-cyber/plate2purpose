import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NGODashboard.module.css';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from '../../api/axiosConfig.js';
import toast from 'react-hot-toast';

const NGODashboard = () => {
    const { user , logout } = useAuth();


    // --- State Management ---
    const [stats, setStats] = useState({});
    const [availablePosts, setAvailablePosts] = useState([]);
    const [pendingPickups, setPendingPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- UI State for Modal ---
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [transportMethod, setTransportMethod] = useState('self');

    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // --- Data Fetching Logic ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    useEffect(() => {
        const fetchNgoData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch available posts and posts already claimed by this NGO
                const [availableRes, claimedRes] = await Promise.all([
                    axios.get('/posts/available'),
                    // We need to create this '/posts/me/claims' endpoint
                    // For now, it might fail, but we'll build it next.
                    axios.get('/posts/me/claims') 
                ]);

                setAvailablePosts(availableRes.data);
                setPendingPickups(claimedRes.data);
                
                // Set placeholder stats based on fetched data
                setStats({
                    mealsReceived: claimedRes.data.length * 25,
                    pendingPickups: claimedRes.data.length,
                    availableNow: availableRes.data.length,
                    peopleFed: (claimedRes.data.length * 25 * 1.5).toFixed(0),
                });

            } catch (err) {
                console.error("Error fetching NGO data:", err);
                // Gracefully handle if one of the calls fails
                if (err.response?.config?.url.includes('/me/claims')) {
                    console.warn("Could not fetch claimed posts. Endpoint might be missing.");
                } else {
                    setError("Could not load dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNgoData();
        } else {
            setLoading(false);
        }
    }, [user]);

    // --- Event Handlers ---
    const getInitials = (name = '') => name.match(/\b\w/g)?.join('').toUpperCase() || 'N';
    const handleOpenModal = (post) => {
        setSelectedPost(post);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setSelectedPost(null);
        setModalOpen(false);
    };
    const handleConfirmAcceptance = async () => {
    if (!selectedPost) return;
    try {
        // --- THIS IS THE FIX ---
        // We now send the selected transport method in the request body
        const response = await axios.put(`/posts/claim/${selectedPost._id}`, { transportMethod });

        setAvailablePosts(prev => prev.filter(p => p._id !== selectedPost._id));
        setPendingPickups(prev => [...prev, response.data]);
        toast.success('Donation accepted successfully!');
        handleCloseModal();
    } catch (error) {
        console.error('Failed to claim post:', error);
        toast.success(`Error: ${error.response?.data?.message || 'Could not claim post.'}`);
        handleCloseModal();
    }
};
    const pageStyle = {
      background: 'linear-gradient(to bottom, #f8fdf9 0%, #f1f8f4 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    };

    const beforeStyle = {
      content: '""',
      position: 'fixed',
      top: '-10%',
      right: '-10%',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(82, 183, 136, 0.25) 0%, rgba(149, 213, 178, 0.15) 40%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0,
      pointerEvents: 'none',
    };

    const afterStyle = {
      content: '""',
      position: 'fixed',
      bottom: '-20%',
      left: '-10%',
      width: '700px',
      height: '700px',
      background: 'radial-gradient(circle, rgba(255, 152, 0, 0.2) 0%, rgba(245, 124, 0, 0.1) 50%, transparent 70%)',
      borderRadius: '50%',
      zIndex: 0,
      pointerEvents: 'none',
    };


    if (loading) return <div>Loading NGO Dashboard...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={pageStyle}>
            <div style={beforeStyle} />
            <div style={afterStyle} />

            <nav className={styles.navbar}>
                <div className={styles['nav-content']}>
                    <button onClick={() => window.scrollTo(0, 0)} className={styles.logo}>
                        Plate2Purpose
                    </button>
                    <div className={styles['nav-links']}>
                        <a href="#hero" className={styles.active}>Dashboard</a>
                        <a href="#available">Available Food</a>
                        <a href="#pending">My Pickups</a>
                        <a href="#impact">Impact</a>
                    </div>
                    <div className={styles['nav-right']}>
                        {/* ... you can keep the notification icon here if you want ... */}
                        <div ref={profileRef} className={styles['profile-container']}>
                            <div className={styles['profile-avatar']} onClick={() => setProfileOpen(!isProfileOpen)}>
                                {getInitials(user?.name)}
                            </div>
                            {isProfileOpen && (
                                <div className={`${styles['profile-dropdown']} ${styles.active}`}>
                                    <div className={styles['profile-dropdown-header']}>
                                        <h3>{user?.name}</h3>
                                        <p>{user?.role}</p>
                                    </div>
                                    <div className={styles['profile-dropdown-menu']}>
                                        <Link to="/profile" className={styles['profile-dropdown-item']}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            <span>View Profile</span>
                                        </Link>
                                        <div className={`${styles['profile-dropdown-item']} ${styles.danger}`} onClick={logout}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            <span>Logout</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {isModalOpen && selectedPost && (
                <div className={`${styles['modal-overlay']} ${styles.active}`}>
                    <div className={styles.modal}>
                        <div className={styles['modal-header']}><h2 id="modalTitle">Accept: {selectedPost.title}</h2><p>Choose your pickup method</p></div>
                        <div className={styles['modal-body']}>
                            <div className={styles['modal-detail']}><div className={styles['modal-detail-label']}>Meals Available</div><div className={styles['modal-detail-value']}>{selectedPost.quantity}</div></div>
                            <div className={styles['modal-detail']}><div className={styles['modal-detail-label']}>Pickup Location</div><div className={styles['modal-detail-value']}>{selectedPost.pickupLocation}</div></div>
                            <div className={`${styles['modal-detail-label']}`} style={{ marginTop: '32px', marginBottom: '16px' }}>Select Pickup Method</div>
                            <div className={styles['transport-options']}>
                                <div className={`${styles['transport-option']} ${transportMethod === 'self' ? styles.selected : ''}`} onClick={() => setTransportMethod('self')}>
                                    <div className={styles['transport-option-icon']}>🚗</div><div className={styles['transport-option-title']}>Self Pickup</div><div className={styles['transport-option-desc']}>We'll collect the food</div>
                                </div>
                                <div className={`${styles['transport-option']} ${transportMethod === 'driver' ? styles.selected : ''}`} onClick={() => setTransportMethod('driver')}>
                                    <div className={styles['transport-option-icon']}>🚚</div><div className={styles['transport-option-title']}>Request Driver</div><div className={styles['transport-option-desc']}>Assign volunteer driver</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['modal-footer']}>
                            <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={handleCloseModal}>Cancel</button>
                            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleConfirmAcceptance}>Confirm Acceptance</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <section className={styles['hero-section']}>
                    <div className={styles['hero-header']}>
                        <h1 className={styles['hero-title']}>Welcome back, {user?.name || 'NGO'}</h1>
                        <p className={styles['hero-subtitle']}>You've received {stats.mealsReceived || 0} meals and served {stats.peopleFed || 0}+ people this month</p>
                        {user?.status === 'Verified' && (<span className={styles['verified-badge']}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Verified NGO</span>)}
                    </div>
                    <a href="#available" className={styles['primary-cta']}>Browse Available Food</a>
                </section>

                <section className={styles['stats-section']}>
                    <div className={styles['section-label']}>Overview</div>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.mealsReceived || 0}</div><div className={styles['stat-label']}>Meals Received</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.pendingPickups || 0}</div><div className={styles['stat-label']}>Pending Pickups</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.availableNow || 0}</div><div className={styles['stat-label']}>Available Now</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.peopleFed || '0'}+</div><div className={styles['stat-label']}>People Fed</div></div>
                    </div>
                </section>

                <section className={styles['available-section']} id="available">
                    <div className={styles['section-label']}>Available Food Near You</div>
                    <div className={styles['available-grid']}>
                        {availablePosts.length > 0 ? availablePosts.map(post => (
                             <div key={post._id} className={styles['food-card']}>
                                <div className={styles['food-card-header']}><h3>{post.title}</h3><div className={styles['food-card-meta']}><span>🍽️ {post.quantity}</span></div></div>
                                <p className={styles['food-card-description']}>Donated by {post.donor.name}</p>
                                <div className={styles['food-card-location']}><span>📍</span><span>{post.pickupLocation}</span></div>
                                <div className={styles['food-card-actions']}><button className={`${styles.btn} ${styles['btn-primary']}`} onClick={() => handleOpenModal(post)}>Accept Donation</button></div>
                            </div>
                        )) : <p>No available food posts right now. Check back soon!</p>}
                    </div>
                </section>

                <section className={styles['pending-section'] } id ="pending">
                    <div className={styles['section-label']}>Pending Pickups</div>
                    <div className={styles['pending-card']}>
                        <h2 className={styles['card-title']}>Your Scheduled Pickups</h2>
                        {pendingPickups.length > 0 ? pendingPickups.map(post => (
                            <div key={post._id} className={styles['pending-item']}>
                                <div className={styles['pending-item-header']}>
                                    <div className={styles['pending-info']}><h4>{post.title}</h4><p>{post.donor.name}, {post.pickupLocation}</p></div>
                                    <span className={`${styles['status-badge']} ${styles.ready}`}>{post.status}</span>
                                </div>
                            </div>
                        )) : <p>You have no pending pickups.</p>}
                    </div>
                </section>
                
                <section className={styles['impact-section']} id ="impact">
                    <h2 className={styles['impact-title']}>Our Impact This Month</h2>
                    <div className={styles['impact-grid']}>
                        <div className={styles['impact-item']}>
                            <h3>{stats.mealsReceived || 0}</h3>
                            <p>Meals received</p>
                        </div>
                        <div className={styles['impact-item']}>
                            <h3>{stats.peopleFed || 0}+</h3>
                            <p>People fed</p>
                        </div>
                        <div className={styles['impact-item']}>
                            <h3>~{((stats.mealsReceived || 0) * 0.5).toFixed(0)} kg</h3>
                            <p>Food waste prevented</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default NGODashboard;