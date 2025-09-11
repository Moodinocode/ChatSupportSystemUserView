import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning']='true'; // for ngrok
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Error Response:', error.response);


      if (error.response.status === 401) {
        sessionStorage.removeItem('token');

        window.location.href = '/login'; 
      }
    } else {
      console.error('Network or other error:', error.message);
      
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;