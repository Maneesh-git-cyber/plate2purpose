import React, { useState } from 'react';

// --- TEMPORARY, LOCAL COMPONENTS ---
// These simple components live ONLY inside this file for now.
// This removes the need for external imports and solves the error.
const Input = ({ label, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>{label}</label>
        <input {...props} style={{ padding: '8px', width: '250px' }} />
    </div>
);

const Button = ({ children, ...props }) => (
    <button {...props} style={{ padding: '10px 15px', cursor: 'pointer' }}>
        {children}
    </button>
);
// ------------------------------------

const AuthForm = ({ isLogin, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'DONOR', // Default for signup
    });

    const { name, email, password, role } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            {/* Conditional rendering for the Signup form */}
            {!isLogin && (
                <>
                    <Input label="Name" type="text" name="name" value={name} onChange={onChange} required />
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem' }}>I am a:</label>
                        <select name="role" value={role} onChange={onChange} style={{ padding: '8px' }}>
                            <option value="DONOR">Donor</option>
                            <option value="NGO">NGO</option>
                            <option value="VOLUNTEER">Volunteer</option>
                        </select>
                    </div>
                </>
            )}
            
            <Input label="Email" type="email" name="email" value={email} onChange={onChange} required />
            <Input label="Password" type="password" name="password" value={password} onChange={onChange} required />
            
            <Button type="submit" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </Button>
        </form>
    );
};

export default AuthForm;