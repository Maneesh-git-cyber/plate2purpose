// import React, { useState } from 'react';

// // This component receives 'onSubmit' and 'loading' from its parent (VerificationPage)
// const NGOVerificationForm = ({ onSubmit, loading }) => {
//     const [formData, setFormData] = useState({
//         organizationAddress: '',
//         contactPhoneNumber: '',
//         registrationId: '',
//         // We will handle the file object in a separate state
//     });
//     const [proofDocument, setProofDocument] = useState(null);

//     const { organizationAddress, contactPhoneNumber, registrationId } = formData;

//     const onChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const onFileChange = (e) => {
//         setProofDocument(e.target.files[0]);
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         // For now, we will just pass the text data.
//         // File uploads are more complex and we will handle them later.
//         onSubmit(formData);
//     };

//     return (
//         <form onSubmit={handleFormSubmit}>
//             <p style={{ color: '#6e6e73', marginBottom: '1.5rem' }}>
//                 Please provide your official NGO details. This information is crucial for building a trusted network.
//             </p>
            
//             <div className="form-group">
//                 <label htmlFor="organizationAddress">Full Organization Address</label>
//                 <input
//                     type="text"
//                     id="organizationAddress"
//                     name="organizationAddress"
//                     value={organizationAddress}
//                     onChange={onChange}
//                     placeholder="The primary address for deliveries"
//                     required
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
//                 <input
//                     type="tel"
//                     id="contactPhoneNumber"
//                     name="contactPhoneNumber"
//                     value={contactPhoneNumber}
//                     onChange={onChange}
//                     placeholder="A number for coordination"
//                     required
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="registrationId">Official Registration ID</label>
//                 <input
//                     type="text"
//                     id="registrationId"
//                     name="registrationId"
//                     value={registrationId}
//                     onChange={onChange}
//                     placeholder="e.g., Your government-issued NGO registration number"
//                     required
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="proofDocument">Proof of Registration (e.g., Certificate)</label>
//                 <input
//                     type="file"
//                     id="proofDocument"
//                     name="proofDocument"
//                     onChange={onFileChange}
//                     // We will add `accept="image/*,.pdf"` later
//                 />
//                  {proofDocument && <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>Selected file: {proofDocument.name}</p>}
//             </div>

//             <button type="submit" className="signup-button" disabled={loading} style={{ marginTop: '1rem' }}>
//                 {loading ? 'Submitting...' : 'Submit for Verification'}
//             </button>
//         </form>
//     );
// };

// export default NGOVerificationForm;

// client/src/components/verification/NGOVerificationForm.jsx

import React, { useState } from 'react';

const NGOVerificationForm = ({ onSubmit, loading, styles }) => {
    const [formData, setFormData] = useState({
        organizationAddress: '',
        contactPhoneNumber: '',
        registrationId: '',
    });
    const [proofDocument, setProofDocument] = useState(null);

    const { organizationAddress, contactPhoneNumber, registrationId } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFileChange = (e) => {
        setProofDocument(e.target.files[0]);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <p style={{ color: '#6e6e73', marginBottom: '1.5rem' }}>
                Please provide your official NGO details. This information is crucial for building a trusted network.
            </p>
            
            <div className={styles.formGroup}>
                <label htmlFor="organizationAddress">Full Organization Address</label>
                <input
                    type="text"
                    id="organizationAddress"
                    name="organizationAddress"
                    value={organizationAddress}
                    onChange={onChange}
                    placeholder="The primary address for deliveries"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
                <input
                    type="tel"
                    id="contactPhoneNumber"
                    name="contactPhoneNumber"
                    value={contactPhoneNumber}
                    onChange={onChange}
                    placeholder="A number for coordination"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="registrationId">Official Registration ID</label>
                <input
                    type="text"
                    id="registrationId"
                    name="registrationId"
                    value={registrationId}
                    onChange={onChange}
                    placeholder="e.g., Your government-issued NGO registration number"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="proofDocument">Proof of Registration (e.g., Certificate)</label>
                <input
                    type="file"
                    id="proofDocument"
                    name="proofDocument"
                    onChange={onFileChange}
                />
                 {proofDocument && <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>Selected file: {proofDocument.name}</p>}
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
        </form>
    );
};

export default NGOVerificationForm;