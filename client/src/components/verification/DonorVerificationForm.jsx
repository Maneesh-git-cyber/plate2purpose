// import React, { useState } from 'react';

// // This component receives the 'onSubmit' function and 'loading' state from its parent (VerificationPage)
// const DonorVerificationForm = ({ onSubmit, loading }) => {
//     // This form manages its own state for all the required input fields
//     const [formData, setFormData] = useState({
//         businessName: '',
//         businessAddress: '',
//         contactPhoneNumber: '',
//         foodLicenseId: '' // Optional field
//     });

//     const { businessName, businessAddress, contactPhoneNumber, foodLicenseId } = formData;

//     const onChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // When the form is submitted, it calls the 'onSubmit' function that was passed down from the parent
//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         // We pass the entire formData object up to the VerificationPage to handle the API call
//         onSubmit(formData);
//     };

//     return (
//         <form onSubmit={handleFormSubmit}>
//             <p style={{ color: '#6e6e73', marginBottom: '1.5rem' }}>
//                 Please provide details about your restaurant, business, or organization to be verified as a trusted food donor.
//             </p>
            
//             <div className="form-group">
//                 <label htmlFor="businessName">Restaurant / Business Name</label>
//                 <input
//                     type="text"
//                     id="businessName"
//                     name="businessName"
//                     value={businessName}
//                     onChange={onChange}
//                     placeholder="e.g., Srinith's Pizzeria"
//                     required
//                 />
//             </div>
            
//             <div className="form-group">
//                 <label htmlFor="businessAddress">Full Business Address</label>
//                 <input
//                     type="text"
//                     id="businessAddress"
//                     name="businessAddress"
//                     value={businessAddress}
//                     onChange={onChange}
//                     placeholder="This will be the default pickup location"
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
//                     placeholder="A number for pickup coordination"
//                     required
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="foodLicenseId">Food License ID (Optional)</label>
//                 <input
//                     type="text"
//                     id="foodLicenseId"
//                     name="foodLicenseId"
//                     value={foodLicenseId}
//                     onChange={onChange}
//                     placeholder="e.g., FSSAI License Number"
//                 />
//             </div>

//             <button type="submit" className="signup-button" disabled={loading} style={{ marginTop: '1rem' }}>
//                 {loading ? 'Submitting...' : 'Submit for Verification'}
//             </button>
//         </form>
//     );
// };

// export default DonorVerificationForm;


// client/src/components/verification/DonorVerificationForm.jsx

import React, { useState } from 'react';

const DonorVerificationForm = ({ onSubmit, loading, styles }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        businessAddress: '',
        contactPhoneNumber: '',
        foodLicenseId: ''
    });

    const { businessName, businessAddress, contactPhoneNumber, foodLicenseId } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <p style={{ color: '#6e6e73', marginBottom: '1.5rem' }}>
                Please provide details about your restaurant, business, or organization to be verified as a trusted food donor.
            </p>
            
            <div className={styles.formGroup}>
                <label htmlFor="businessName">Restaurant / Business Name</label>
                <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={businessName}
                    onChange={onChange}
                    placeholder="e.g., Srinith's Pizzeria"
                    required
                />
            </div>
            
            <div className={styles.formGroup}>
                <label htmlFor="businessAddress">Full Business Address</label>
                <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={businessAddress}
                    onChange={onChange}
                    placeholder="This will be the default pickup location"
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
                    placeholder="A number for pickup coordination"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="foodLicenseId">Food License ID (Optional)</label>
                <input
                    type="text"
                    id="foodLicenseId"
                    name="foodLicenseId"
                    value={foodLicenseId}
                    onChange={onChange}
                    placeholder="e.g., FSSAI License Number"
                />
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
        </form>
    );
};

export default DonorVerificationForm;