import axios from 'axios';

const baseURL = '/.netlify/functions/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
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
    }

    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export const exchangeRates = {
  getMaster: () => api.get('/api/exchange-rates/master/rates'),
  
  uploadMaster: async (rates: any[], source: string) => {
    const sanitizedRates = rates.map(rate => ({
      date: new Date(rate.date).toISOString().split('T')[0],
      currency: String(rate.currency).trim().toUpperCase(),
      rate: Number(rate.rate)
    }));
    
    const response = await api.post('/api/exchange-rates/master/upload', { 
      rates: sanitizedRates,
      source 
    });
    
    return response.data;
  },

  clearMaster: () => api.delete('/api/exchange-rates/master/clear')
};

export default api;