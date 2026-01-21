import axios from "axios"

const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Remove trailing slash if present
        const cleanUrl = envUrl.replace(/\/$/, '');
        // Append /api if not already present
        return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
    }
    return "/api"; // Default to proxy for local dev
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Important for HttpOnly cookies
})

// Optional: Add response interceptor to handle 401s globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if we are not already on the login or register page to avoid redirect loops
            // if (!window.location.pathname.startsWith('/signin') && !window.location.pathname.startsWith('/signup')) {
            //     window.location.href = '/signin'
            // }
        }
        return Promise.reject(error)
    }
)

export default api
