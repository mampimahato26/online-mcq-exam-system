const API_URL = 'http://localhost:5000/api';

import axios from 'axios';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios interceptor to append authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mcq_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified services wrapper
const api = {
  // Authentication
  auth: {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data)
  },

  // Admin Management
  admin: {
    getStats: () => apiClient.get('/admin/stats'),
    getUsers: () => apiClient.get('/admin/users'),
    createUser: (data) => apiClient.post('/admin/users', data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    getExams: () => apiClient.get('/admin/exams'),
    getResults: () => apiClient.get('/admin/results')
  },

  // Examiner Operations
  examiner: {
    createExam: (data) => apiClient.post('/exams', data),
    getMyExams: () => apiClient.get('/exams/my-exams'),
    getExamById: (id) => apiClient.get(`/exams/${id}`),
    addQuestions: (id, questions) => apiClient.post(`/exams/${id}/questions`, { questions }),
    getExamResults: (id) => apiClient.get(`/exams/${id}/results`)
  },

  // Student Operations
  student: {
    getAvailableExams: () => apiClient.get('/exams'),
    startExam: (id) => apiClient.post(`/exams/${id}/start`),
    submitExam: (id, answers) => apiClient.post(`/exams/${id}/submit`, { answers }),
    getMyResults: () => apiClient.get('/results/my-results')
  }
};

export default api;
export { API_URL };
