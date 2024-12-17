import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  withCredentials: true
});

api.interceptors.request.use(
  config => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(new Error('No se pudo conectar con el servidor. Por favor, intente nuevamente.'));
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'Ha ocurrido un error. Por favor, intente nuevamente.';
    
    if (!error.response) {
      errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    } else if (error.response.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      console.error('API Error:', error);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;