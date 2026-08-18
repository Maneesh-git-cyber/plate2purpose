import axios from 'axios';

// Create a new instance of axios
const axiosInstance = axios.create({
    // This is the crucial part: All requests will be prefixed with this URL
    baseURL: 'http://localhost:5001/api',
    timeout: 10000, // Optional: request will fail if it takes more than 10 seconds
});

// --- Request Interceptor ---
// This function runs BEFORE each request is sent. Its job is to add the auth token.
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('authToken');
        
        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config; // Always return the config, otherwise the request will be blocked
    },
    (error) => {
        // Handle any errors that happen during the request setup
        return Promise.reject(error);
    }
);

// --- Response Interceptor (Optional but good practice) ---
// This function runs AFTER a response is received from the server.
axiosInstance.interceptors.response.use(
    (response) => {
        // If the response is successful (status 2xx), just return it
        return response;
    },
    (error) => {
        // If the server responds with an error, we can handle common cases here
        if (error.response?.status === 401) {
            // This means the token is invalid or expired.
            // It's good practice to automatically log the user out.
            console.log("Authentication error. Logging out.");
            localStorage.removeItem('authToken');
            
            // This will force a page reload and redirect to the login page
            // We can make this more elegant later with React Router's `useNavigate`.
            window.location.href = '/login';
        }
        
        // Return the error so the component's .catch() block can also handle it
        return Promise.reject(error);
    }
);


export default axiosInstance;