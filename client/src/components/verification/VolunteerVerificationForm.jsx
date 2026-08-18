// import React, { useState } from 'react';

// const VolunteerVerificationForm = ({ onSubmit, loading }) => {
//     const [formData, setFormData] = useState({
//         phoneNumber: '',
//         vehicleDetails: ''
//     });
//     const [idProof, setIdProof] = useState(null);

//     const { phoneNumber, vehicleDetails } = formData;

//     const onChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const onFileChange = (e) => {
//         setIdProof(e.target.files[0]);
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         // File upload logic will be added later. For now, we submit the text data.
//         onSubmit(formData);
//     };

//     return (
//         <form onSubmit={handleFormSubmit}>
//             <p style={{ color: '#6e6e73', marginBottom: '1.5rem' }}>
//                 Thank you for volunteering! Please provide the following details to complete your profile.
//             </p>

//             <div className="form-group">
//                 <label htmlFor="phoneNumber">Contact Phone Number</label>
//                 <input
//                     type="tel"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     value={phoneNumber}
//                     onChange={onChange}
//                     placeholder="A number for delivery coordination"
//                     required
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="vehicleDetails">Vehicle Details (Optional)</label>
//                 <input
//                     type="text"
//                     id="vehicleDetails"
//                     name="vehicleDetails"
//                     value={vehicleDetails}
//                     onChange={onChange}
//                     placeholder="e.g., Motorcycle - BA21 3456"
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="idProof">Government ID Proof (e.g., Driver's License)</label>
//                 <input
//                     type="file"
//                     id="idProof"
//                     name="idProof"
//                     onChange={onFileChange}
//                 />
//                 {idProof && <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>Selected file: {idProof.name}</p>}
//             </div>

//             <button type="submit" className="signup-button" disabled={loading} style={{ marginTop: '1rem' }}>
//                 {loading ? 'Submitting...' : 'Submit for Verification'}
//             </button>
//         </form>
//     );
// };

// export default VolunteerVerificationForm;


// client/src/components/verification/VolunteerVerificationForm.jsx

import React, { useState } from 'react';

const VolunteerVerificationForm = ({ onSubmit, loading, styles }) => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        vehicleDetails: ''
    });
    const [idProof, setIdProof] = useState(null);

    const { phoneNumber, vehicleDetails } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFileChange = (e) => {
        setIdProof(e.target.files[0]);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <p style={{ color: '#6e6e73', marginBottom: '1.5rem' }}>
                Thank you for volunteering! Please provide the following details to complete your profile.
            </p>

            <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Contact Phone Number</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={onChange}
                    placeholder="A number for delivery coordination"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="vehicleDetails">Vehicle Details (Optional)</label>
                <input
                    type="text"
                    id="vehicleDetails"
                    name="vehicleDetails"
                    value={vehicleDetails}
                    onChange={onChange}
                    placeholder="e.g., Motorcycle - BA21 3456"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="idProof">Government ID Proof (e.g., Driver's License)</label>
                <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    onChange={onFileChange}
                />
                {idProof && <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>Selected file: {idProof.name}</p>}
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
        </form>
    );
};

export default VolunteerVerificationForm;