import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => {
    // Check if we have file data that needs FormData
    const hasFile = userData instanceof FormData || 
                   Object.values(userData).some(value => value instanceof File);
    
    if (hasFile) {
      let formData;
      if (userData instanceof FormData) {
        formData = userData;
      } else {
        formData = new FormData();
        Object.keys(userData).forEach(key => {
          if (userData[key] instanceof File) {
            formData.append(key, userData[key]);
          } else if (userData[key] !== null && userData[key] !== undefined) {
            formData.append(key, userData[key]);
          }
        });
      }
      
      return api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return api.put('/auth/profile', userData);
    }
  },
};

// Pets API
export const petsAPI = {
  getAllPets: (params = {}) => api.get('/pets', { params }),
  getPet: (id) => api.get(`/pets/${id}`),
  getPetById: (id) => api.get(`/pets/${id}`),
  createPet: (petData) => {
    const formData = new FormData();
    
    // Append all pet data to FormData
    Object.keys(petData).forEach(key => {
      if (key === 'images') {
        petData[key].forEach(image => {
          formData.append('images', image);
        });
      } else if (typeof petData[key] === 'object' && petData[key] !== null) {
        formData.append(key, JSON.stringify(petData[key]));
      } else {
        formData.append(key, petData[key]);
      }
    });

    return api.post('/pets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updatePet: (id, petData) => {
    const formData = new FormData();
    
    Object.keys(petData).forEach(key => {
      if (key === 'images' && Array.isArray(petData[key])) {
        petData[key].forEach(image => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      } else if (typeof petData[key] === 'object' && petData[key] !== null) {
        formData.append(key, JSON.stringify(petData[key]));
      } else {
        formData.append(key, petData[key]);
      }
    });

    return api.put(`/pets/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePet: (id) => api.delete(`/pets/${id}`),
};

// Adoption API
export const adoptionAPI = {
  createRequest: (requestData) => api.post('/adoptions', requestData),
  submitRequest: (requestData) => api.post('/adoptions', requestData),
  getRequests: (params = {}) => api.get('/adoptions', { params }),
  getRequestById: (id) => api.get(`/adoptions/${id}`),
  updateRequestStatus: (id, statusData) => api.put(`/adoptions/${id}`, statusData),
  deleteRequest: (id) => api.delete(`/adoptions/${id}`),
  getUserRequests: () => api.get('/adoptions/user'),
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/chat'),
  getMessages: (userId, params = {}) => api.get(`/chat/${userId}`, { params }),
  sendMessage: (messageData) => api.post('/chat', messageData),
  startConversation: (userId) => api.post('/chat/start', { userId }),
  markAsRead: (userId) => api.put(`/chat/${userId}/read`),
  getUnreadCount: () => api.get('/chat/unread/count'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPetAnalytics: () => api.get('/analytics/pets'),
  getUserAnalytics: () => api.get('/analytics/users'),
};

export default api;
