import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from '../../api/axiosConfig.js';
import styles from './VolunteerDashboard.module.css';
import toast from 'react-hot-toast';

// Debug: Check if styles are loading
console.log('CSS Modules loaded:', styles);

function VolunteerDashboard() {
    // --- DYNAMIC DATA STATE ---
    const { user, logout, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({});
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [availableJobs, setAvailableJobs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);

    // --- UI STATE ---
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // --- REFS ---
    const profileRef = useRef(null);
    const notificationsRef = useRef(null);

    // --- DATA FETCHING ---
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setNotificationsOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // We define the async function outside the main logic
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activeRes, availableRes, notificationsRes] = await Promise.all([
                    axios.get('/deliveries/volunteer/stats'),
                    axios.get('/deliveries/active'),
                    axios.get('/deliveries/available'),
                    axios.get('/deliveries/notifications')
                ]);
                setStats(statsRes.data);
                setActiveDeliveries(activeRes.data);
                setAvailableJobs(availableRes.data);
                setNotifications(notificationsRes.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                // No matter what, we are done loading.
                setLocalLoading(false);
            }
        };

        // This is the main logic gate.
        // If the global auth is still working, we do nothing yet.
        if (authLoading) {
            return; 
        }

        // If auth is finished AND we have a user, start the fetch.
        if (user) {
            setLocalLoading(true); // Set loading to true ONLY when we are about to fetch.
            setError(null);
            fetchDashboardData();
        } else {
            // If auth is finished and there is NO user, we are definitely not loading.
            setLocalLoading(false);
        }

    }, [user, authLoading]); // The dependencies are still correct.

    // --- EVENT HANDLERS ---
    const getInitials = (name = '') => name.match(/\b\w/g)?.join('').toUpperCase() || '';
    const handleOpenJobModal = (job) => { setSelectedJob(job); setModalOpen(true); };
    const handleCloseJobModal = () => { setModalOpen(false); setSelectedJob(null); };

    const handleConfirmAcceptJob = async () => {
        if (!selectedJob) return;
        try {
            const response = await axios.put(`/deliveries/${selectedJob._id}/accept`);
            setActiveDeliveries(prevActive => [...prevActive, response.data]);
            setAvailableJobs(prevAvailable => prevAvailable.filter(job => job._id !== selectedJob._id));
            toast.success('Job accepted successfully!');
            handleCloseJobModal();
        } catch (error) {
            console.error('Failed to accept job:', error);
            toast.error(`Error: ${error.response?.data?.message || 'Could not accept job.'}`);
            handleCloseJobModal();
        }
    };
    
    const markAllRead = () => toast.success('Marking all notifications as read...');
    const handleNavigation = (destination) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const origin = `${latitude},${longitude}`;
                    const encodedDestination = encodeURIComponent(destination);
                    const mapsUrl = `https://www.google.com/maps/dir/${origin}/${encodedDestination}`;
                    window.open(mapsUrl, '_blank');
                },
                () => toast.error("Unable to retrieve your location.")
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
        }
    };

    const handleStatusUpdate = async (delivery, newStatus) => {
        try {
            const response = await axios.put(`/deliveries/${delivery._id}/status`, { status: newStatus });
            setActiveDeliveries(prevActive => 
                prevActive.map(d => d._id === delivery._id ? response.data : d)
            );
            toast.success(`Delivery status updated to: ${newStatus}`);

            if (newStatus === 'Completed') {
                setActiveDeliveries(prevActive => prevActive.filter(d => d._id !== delivery._id));
                const statsRes = await axios.get('/deliveries/volunteer/stats');
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error(`Failed to update status to ${newStatus}:`, error);
            toast.error(`Error: ${error.response?.data?.message || 'Could not update status.'}`);
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

    // --- NEW, MORE ROBUST LOADING AND ERROR STATES ---

    // First, check if the global authentication is still loading
    if (authLoading) {
        return <div style={{padding: '2rem'}}><h1>Initializing Session...</h1></div>;
    }

    // If auth is done, but there's no user, show login link
    if (!user) {
        return <div style={{padding: '2rem'}}><h1>Please <Link to="/login">login</Link> to view your dashboard.</h1></div>;
    }

    // If there IS a user, but this component's data is loading, show this
    if (localLoading) {
        return <div style={{padding: '2rem'}}><h1>Loading Dashboard...</h1></div>;
    }

    // If there was an error fetching the component's data, show this
    if (error) {
        return <div style={{padding: '2rem'}}><h1>{error}</h1><button onClick={() => window.location.reload()}>Retry</button></div>;
    }

    // --- MAIN JSX ---
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
                        <a href="#Dashboard" className={styles.active}>Dashboard</a>
                        <a href="#activedelivery">Active Deliveries</a>
                        <a href="#jobs">Available Jobs</a>
                        <a href="#myservice">My Service</a>
                    </div>
                    <div className={styles['nav-right']}>
                        <div ref={notificationsRef} className={styles['notification-container']}>
                            {/* ... your notification icon and dropdown ... */}
                        </div>

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

            {isModalOpen && selectedJob && (
                <div className={`${styles['modal-overlay']} ${styles.active}`}>
                    <div className={styles.modal}>
                        <div className={styles['modal-header']}>
                            <h2>Accept: {selectedJob.title}</h2>
                            <p>Review the delivery details</p>
                        </div>
                        <div className={styles['modal-body']}>
                            <div className={styles['modal-detail']}>
                                <div className={styles['modal-detail-label']}>Pickup From</div>
                                <div className={styles['modal-detail-value']}>
                                    {selectedJob.donor?.name} at {selectedJob.donor?.verificationDetails?.businessAddress || 'Address Not Provided'}
                                </div>
                            </div>
                            <div className={styles['modal-detail']}>
                                <div className={styles['modal-detail-label']}>Deliver To</div>
                                <div className={styles['modal-detail-value']}>
                                    {selectedJob.ngo?.name} at {selectedJob.ngo?.verificationDetails?.organizationAddress || 'Address Not Provided'}
                                </div>
                            </div>
                            {/* We have removed the hardcoded distance and time details */}
                        </div>
                        <div className={styles['modal-footer']}>
                            <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={handleCloseJobModal}>Cancel</button>
                            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={handleConfirmAcceptJob}>Accept Job</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <section className={styles['hero-section']}>
                    <div className={styles['hero-header']} id='Dashboard'>
                        <h1 className={styles['hero-title']}>Welcome back, {user.name}</h1>
                        <p className={styles['hero-subtitle']}>You've completed {stats.totalDeliveries || 0} deliveries and volunteered {stats.hoursVolunteered || 0} hours</p>
                        {user.status === 'Verified' && (
                          <span className={styles['verified-badge']}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              Verified Volunteer
                          </span>
                        )}
                    </div>
                    <a href="#jobs" className={styles['primary-cta']}>View Available Jobs</a>
                </section>

                <section className={styles['stats-section']}>
                    <div className={styles['section-label']}>Overview</div>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.totalDeliveries || 0}</div><div className={styles['stat-label']}>Total Deliveries</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{ stats.hoursVolunteered || 0}</div><div className={styles['stat-label']}>Hours Volunteered</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.activeDeliveries || 0}</div><div className={styles['stat-label']}>Active Deliveries</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{(stats.mealsDelivered || 0).toLocaleString()}</div><div className={styles['stat-label']}>Meals Delivered</div></div>
                    </div>
                </section>

                <section className={styles['active-section']} id='activedelivery'>
                    <div className={styles['section-label']}>Active Deliveries ({activeDeliveries.length})</div>
                    {activeDeliveries.length > 0 ? (
                        activeDeliveries.map(delivery => (
                            <div key={delivery._id} className={styles['delivery-card']}>
                                <div className={styles['delivery-header']}>
                                    <div className={styles['delivery-info']}><h3>{delivery.foodPost?.title || 'N/A'}</h3><p>Status: {delivery.status}</p></div>
                                    <span className={`${styles['delivery-status']} ${delivery.status === 'In-Progress' ? styles['in-progress'] : ''}`}>{delivery.status}</span>
                                </div>
                                <div className={styles['delivery-route']}>
                                    <div className={styles['route-point']}>
                                        <div className={styles['route-point-label']}>Pickup From</div>
                                        <div className={styles['route-point-location']}>{delivery.donor?.name || 'N/A'}</div>
                                        <div className={styles['route-point-details']}>{delivery.donor?.verificationDetails?.address || 'Address not available'}</div>
                                    </div>
                                    <div className={styles['route-arrow']}>→</div>
                                    <div className={styles['route-point']}>
                                        <div className={styles['route-point-label']}>Deliver To</div>
                                        <div className={styles['route-point-location']}>{delivery.ngo?.name || 'N/A'}</div>
                                        <div className={styles['route-point-details']}>{delivery.ngo?.verificationDetails?.address || 'Address not available'}</div>
                                    </div>
                                </div>
                                <div className={styles['delivery-actions']}>
                                    {delivery.status === 'Accepted' && (
                                        <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={() => handleStatusUpdate(delivery, 'In-Progress')}>
                                            Mark as Picked Up
                                        </button>
                                    )}
                                    
                                    {delivery.status === 'In-Progress' && (
                                        <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={() => handleStatusUpdate(delivery, 'Completed')}>
                                            Mark as Delivered
                                        </button>
                                    )}
                                    
                                    <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={() => handleNavigation(delivery.donor?.verificationDetails?.address || '')}>
                                        Navigate to Pickup
                                    </button>
                                    
                                    <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={() => handleNavigation(delivery.ngo?.verificationDetails?.address || '')}>
                                        Navigate to Dropoff
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : ( <p>You have no active deliveries. Time to pick one up!</p> )}
                </section>

                <section className={styles['jobs-section']} id="jobs">
                    <div className={styles['section-label']}>Available Delivery Jobs ({availableJobs.length})</div>
                    <div className={styles['jobs-grid']}>
                        {availableJobs.length > 0 ? (
                            availableJobs.map(job => (
                                <div key={job._id} className={styles['job-card']}>
                                    <div className={styles['job-header']}>
                                        <h3>{job.foodPost?.title || 'N/A'}</h3>
                                        <div className={styles['job-meta']}>
                                            {/* Meta details can be added back here later if needed */}
                                        </div>
                                    </div>
                                    <div className={styles['job-locations']}>
                                        <div className={styles['job-location-item']}>
                                            <div className={styles['job-location-label']}>Pickup</div>
                                            <div className={styles['job-location-text']}>{job.donor?.name || 'N/A'}</div>
                                        </div>
                                        <div className={styles['job-location-item']}>
                                            <div className={styles['job-location-label']}>Deliver To</div>
                                            <div className={styles['job-location-text']}>{job.ngo?.name || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={() => handleOpenJobModal(job)}>Accept Job</button>
                                </div>
                            ))
                        ) : ( <p>No available jobs right now. Great work clearing the board!</p> )}
                    </div>
                </section>

                <section className={styles['impact-section']} id='myservice'>
                    <h2 className={styles['impact-title']}>Your Volunteer Impact</h2>
                    <div className={styles['impact-grid']}>
                        <div className={styles['impact-item']}><h3>{stats.hoursVolunteered || 0} hrs</h3><p>Service hours logged</p></div>
                        <div className={styles['impact-item']}><h3>{(stats.mealsDelivered || 0).toLocaleString()}</h3><p>Meals delivered</p></div>
                        <div className={styles['impact-item']}><h3>~{((stats.mealsDelivered || 0) * 0.5).toLocaleString()} kg</h3><p>Food waste prevented</p></div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default VolunteerDashboard;