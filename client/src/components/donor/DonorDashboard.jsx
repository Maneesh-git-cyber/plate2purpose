import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DonorDashboard.module.css';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from '../../api/axiosConfig.js';

const DonorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [attentionPosts, setAttentionPosts] = useState([]);
    const [livePosts, setLivePosts] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

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
        const fetchDonorData = async () => {
            setLoading(true);
            setError(null);
            try {
                const postsRes = await axios.get('/posts/me/donations');
                const allPosts = postsRes.data;

                setAttentionPosts(allPosts.filter(p => p.status === 'Claimed'));
                setLivePosts(allPosts.filter(p => p.status === 'Available'));
                setRecentActivity(allPosts.slice(0, 5));

                setStats({
                    totalMeals: allPosts.reduce((acc, post) => acc + (parseInt(post.quantity.match(/\d+/)?.[0]) || 25), 0),
                    activePosts: allPosts.filter(p => p.status === 'Available').length,
                    pendingPickups: allPosts.filter(p => p.status === 'Claimed').length,
                    thisMonth: allPosts.length,
                });
            } catch (err) {
                console.error("Error fetching donor data:", err);
                setError("Could not load your dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchDonorData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const getInitials = (name = '') => name.match(/\b\w/g)?.join('').toUpperCase() || 'D';

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

    if (loading) return <div>Loading Donor Dashboard...</div>;
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
                        <a href="#attention">Attention</a>
                        <a href="#activity">Activity</a>
                        <a href="#impact">Impact</a>
                    </div>
                    <div className={styles['nav-right']}>
                        {/* This 'profile-container' div is the key */}
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

            <div className={styles.container}>
                <section className={styles['hero-section']} id="hero">
                    <div className={styles['hero-header']}>
                        <h1 className={styles['hero-title']}>Good afternoon, {user?.name || 'Donor'}</h1>
                        <p className={styles['hero-subtitle']}>You've donated {stats.totalMeals || 0} meals and helped feed hundreds in your community</p>
                        {user?.status === 'Verified' && (<span className={styles['verified-badge']}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Verified Donor</span>)}
                    </div>
                    <button onClick={() => navigate('/posts/new')} className={styles['primary-cta']}>Post Food Availability</button>
                </section>

                <section className={styles['stats-section']}>
                    <div className={styles['section-label']}>Overview</div>
                    <div className={styles['stats-grid']}>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.totalMeals || 0}</div><div className={styles['stat-label']}>Total Meals Donated</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.activePosts || 0}</div><div className={styles['stat-label']}>Active Posts</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.pendingPickups || 0}</div><div className={styles['stat-label']}>Pending Pickups</div></div>
                        <div className={styles['stat-item']}><div className={styles['stat-value']}>{stats.thisMonth || 0}</div><div className={styles['stat-label']}>Posts This Month</div></div>
                    </div>
                </section>

                <section className={styles['attention-section']} id="attention">
                    <div className={styles['section-label']}>Needs Attention</div>
                    <div className={styles['attention-grid']}>
                        <div className={styles['attention-card']}>
                            <h2 className={styles['card-title']}>Pending Confirmations</h2>
                            {attentionPosts.length > 0 ? attentionPosts.map(post => (<div key={post._id} className={styles['attention-item']}>
                                                                                        <div className={styles['attention-info']}>
                                                                                            <h4>{post.title}</h4>
                                                                                            <p>Accepted by {post.claimedBy?.name || 'an NGO'}</p>
                                                                                        </div>
                                                                                        {/* --- THIS IS THE FIX --- */}
                                                                                        <span className={styles['attention-badge']}>
                                                                                            {post.status === 'Claimed' 
                                                                                                ? 'Awaiting Pickup' 
                                                                                                : (post.status === 'In-Progress' ? 'In Transit' : post.status)
                                                                                            }
                                                                                        </span>
                                                                                    </div>)) : <p>No posts are currently awaiting pickup.</p>}
                        </div>
                        <div className={styles['attention-card']}>
                            <h2 className={styles['card-title']}>Active Posts</h2>
                            {livePosts.length > 0 ? livePosts.map(post => (<div key={post._id} className={styles['attention-item']}><div className={styles['attention-info']}><h4>{post.title}</h4><p>Currently available for NGOs</p></div><span className={`${styles['attention-badge']} ${styles.success}`}>Live</span></div>)) : <p>You have no live posts.</p>}
                        </div>
                    </div>
                </section>

                <section className={styles['activity-section']} id="activity">
                    <div className={styles['section-label']}>Recent Activity</div>
                    <div className={styles['activity-card']}>
                        {recentActivity.length > 0 ? recentActivity.map(activity => (
                            <div key={activity._id} className={styles['activity-item']}>
                                <div className={`${styles['activity-icon-wrapper']} ${activity.status === 'Available' ? styles.info : styles.success}`}>✓</div>
                                <div className={styles['activity-content']}>
                                    <h4>Post Created: {activity.title}</h4>
                                    <p>On {new Date(activity.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : <p>No recent activity.</p>}
                    </div>
                </section>

                <section className={styles['impact-section']} id="impact">
                    <h2 className={styles['impact-title']}>Your Impact This Month</h2>
                    <div className={styles['impact-grid']}>
                        <div className={styles['impact-item']}><h3>~{((stats.totalMeals || 0) * 0.5).toFixed(0)} kg</h3><p>Food waste prevented</p></div>
                        <div className={styles['impact-item']}><h3>~{stats.totalMeals || 0}</h3><p>People fed</p></div>
                        <div className={styles['impact-item']}><h3>~{((stats.totalMeals || 0) * 1.2).toFixed(0)} kg</h3><p>CO₂ emissions reduced</p></div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DonorDashboard;