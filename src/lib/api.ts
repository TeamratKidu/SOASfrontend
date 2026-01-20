import axios from "axios"

const api = axios.create({
    baseURL: "/api", // Proxied to localhost:3000 in vite.config.ts
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
